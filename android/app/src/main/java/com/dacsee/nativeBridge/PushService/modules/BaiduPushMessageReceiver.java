package com.dacsee.nativeBridge.PushService.modules;

import android.app.ActivityManager;
import android.app.Application;
import android.content.Context;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import com.baidu.android.pushservice.PushMessageReceiver;
import com.dacsee.MainApplication;
import com.dacsee.nativeBridge.PushService.BaiduPushConstants;
import com.dacsee.nativeBridge.PushService.helpers.ApplicationBadgeHelper;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.List;
import java.util.Random;

import static com.dacsee.nativeBridge.PushService.modules.RNPushNotification.LOG_TAG;

import static android.content.Context.ACTIVITY_SERVICE;

public class BaiduPushMessageReceiver extends PushMessageReceiver {

    private interface ReactContextInitListener {
        void contextInitialized(ReactApplicationContext context);
    }

    @Override
    public void onBind(Context context, int errorCode, String appid, final String userId, final String channelId,
                       String requestId) {
        Log.d(RNPushNotification.LOG_TAG, "onBind");
        Context applicationContext = context.getApplicationContext();
        handleEvent(applicationContext, new ReactContextInitListener() {
            @Override
            public void contextInitialized(ReactApplicationContext context) {
                WritableMap params = Arguments.createMap();
                params.putString("userId", userId);
                params.putString("deviceToken", channelId);
                RNPushNotificationJsDelivery jsDelivery = new RNPushNotificationJsDelivery(context);
                jsDelivery.sendEvent("remoteNotificationsRegistered", params);
            }
        });
    }

    @Override
    public void onMessage(Context context, String message, String customContentString) {
        Log.d(RNPushNotification.LOG_TAG, "onMessage");
        JSONObject data = getPushData(message);
        final Bundle bundle = createBundleFromMessage(message);
        if (data != null) {
            final int badge = data.optInt("badge", -1);
            if (badge >= 0) {
                ApplicationBadgeHelper.INSTANCE.setApplicationIconBadgeNumber(context, badge);
            }
        }

        Context applicationContext = context.getApplicationContext();

        Log.v(RNPushNotification.LOG_TAG, "onMessageReceived: " + bundle);

        handleEvent(applicationContext, new ReactContextInitListener() {
            @Override
            public void contextInitialized(ReactApplicationContext context) {
                handleRemotePushNotification(context, bundle);
            }
        });
    }

    private void handleEvent(final Context applicationContext, final ReactContextInitListener reactContextInitListener) {
        // We need to run this on the main thread, as the React code assumes that is true.
        // Namely, DevServerHelper constructs a Handler() without a Looper, which triggers:
        // "Can't create handler inside thread that has not called Looper.prepare()"
        Handler handler = new Handler(Looper.getMainLooper());
        handler.post(new Runnable() {
            public void run() {
                // Construct and load our normal React JS code bundle
                if (applicationContext instanceof ReactApplication) {
                    ReactInstanceManager mReactInstanceManager = ((ReactApplication) applicationContext).getReactNativeHost().getReactInstanceManager();
                    ReactContext context = mReactInstanceManager.getCurrentReactContext();
                    // If it's constructed, send a notification
                    if (context != null) {
                        reactContextInitListener.contextInitialized((ReactApplicationContext) context);
                    } else {
                        // Otherwise wait for construction, then send the notification
                        mReactInstanceManager.addReactInstanceEventListener(new ReactInstanceManager.ReactInstanceEventListener() {
                            public void onReactContextInitialized(ReactContext context) {
                                reactContextInitListener.contextInitialized((ReactApplicationContext) context);
                            }
                        });
                        if (!mReactInstanceManager.hasStartedCreatingInitialContext()) {
                            // Construct it in the background
                            mReactInstanceManager.createReactContextInBackground();
                        }
                    }
                }
            }
        });
    }

    private Bundle createBundleFromMessage(String message) {
        Bundle extras = null;
        try {
            JSONObject baseJson = new JSONObject(message);
            JSONObject dataJson = baseJson.optJSONObject(BaiduPushConstants.DATA);
            JSONObject customJson= baseJson.optJSONObject("cd");
            extras = new Bundle();
            extras.putString(BaiduPushConstants.TITLE, dataJson.optString(BaiduPushConstants.TITLE));
            extras.putString(BaiduPushConstants.MESSAGE, dataJson.optString(BaiduPushConstants.DESCRIPTION));
            if (dataJson.optJSONObject(BaiduPushConstants.ROUTE) != null) {
                extras.putString(BaiduPushConstants.ROUTE, dataJson.optJSONObject(BaiduPushConstants.ROUTE).toString());
            }
            if (dataJson.optJSONObject(BaiduPushConstants.BADGE) != null) {
                extras.putString(BaiduPushConstants.BADGE, dataJson.optJSONObject(BaiduPushConstants.BADGE).toString());
            }
            if (customJson != null) {
                extras.putString("custom_data", customJson.toString());
            }
        } catch (JSONException e) {
            Log.e(RNPushNotification.LOG_TAG, e.getMessage());
        }
        return extras;
    }

    private JSONObject getPushData(String dataString) {
        try {
            return new JSONObject(dataString);
        } catch (Exception e) {
            return null;
        }
    }

    private void handleRemotePushNotification(ReactApplicationContext context, Bundle bundle) {

        // If notification ID is not provided by the user for push notification, generate one at random
        if (bundle.getString("id") == null) {
            Random randomNumberGenerator = new Random(System.currentTimeMillis());
            bundle.putString("id", String.valueOf(randomNumberGenerator.nextInt()));
        }

        Boolean isForeground = isApplicationInForeground(context);

        RNPushNotificationJsDelivery jsDelivery = new RNPushNotificationJsDelivery(context);
        bundle.putBoolean("foreground", isForeground);
        bundle.putBoolean("userInteraction", false);
        jsDelivery.notifyNotification(bundle);

        // If contentAvailable is set to true, then send out a remote fetch event
        if (bundle.getString("contentAvailable", "false").equalsIgnoreCase("true")) {
            jsDelivery.notifyRemoteFetch(bundle);
        }

        Log.v(RNPushNotification.LOG_TAG, "sendNotification: " + bundle);

        if (!isForeground) {
            Application applicationContext = (Application) context.getApplicationContext();
            RNPushNotificationHelper pushNotificationHelper = new RNPushNotificationHelper(applicationContext);
            pushNotificationHelper.sendToNotificationCentre(bundle);
        }
    }

    private boolean isApplicationInForeground(Context context) {
        ActivityManager activityManager = (ActivityManager) context.getSystemService(ACTIVITY_SERVICE);
        List<ActivityManager.RunningAppProcessInfo> processInfos = activityManager.getRunningAppProcesses();
        if (processInfos != null) {
            for (ActivityManager.RunningAppProcessInfo processInfo : processInfos) {
                if (processInfo.processName.equals(MainApplication.context.getPackageName())) {
                    if (processInfo.importance == ActivityManager.RunningAppProcessInfo.IMPORTANCE_FOREGROUND) {
                        for (String d : processInfo.pkgList) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    @Override
    public void onNotificationClicked(Context context, String title, String description, String customContentString) {
        Log.d(LOG_TAG, "onNotificationClicked");
    }

    @Override
    public void onNotificationArrived(Context context, String title, String description, String customContentString) {
        Log.d(LOG_TAG, "onNotificationArrived");
    }

    @Override
    public void onUnbind(Context context, int errorCode, String s) {
        Log.d(LOG_TAG, "onUnbind");
    }

    @Override
    public void onSetTags(Context context, int errorCode, List<String> list, List<String> list1, String s) {
        Log.d(LOG_TAG, "onSetTags");
    }

    @Override
    public void onDelTags(Context context, int errorCode, List<String> list, List<String> list1, String s) {
        Log.d(LOG_TAG, "onDelTags");

    }

    @Override
    public void onListTags(Context context, int i, List<String> list, String s) {
        Log.d(LOG_TAG, "onListTags");
    }

}
