package com.dacsee;

import android.app.Application;
import android.content.Context;

import com.airbnb.android.react.maps.MapsPackage;
import com.dacsee.nativeBridge.AMap.AMap3DPackage;
import com.dacsee.nativeBridge.PushService.ReactNativePushNotificationPackage;
import com.dacsee.nativeBridge.UMeng.DplusReactPackage;
import com.dacsee.nativeBridge.UMeng.ShareModule;
import com.facebook.react.BuildConfig;
import com.facebook.react.ReactApplication;
import com.facebook.react.bridge.NativeModule;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GoogleApiAvailability;
import com.krazylabs.OpenAppSettingsPackage;

import com.airbnb.android.react.lottie.LottiePackage;

import org.reactnative.camera.RNCameraPackage;
import com.imagepicker.ImagePickerPackage;
import com.beefe.picker.PickerViewPackage;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.mehcode.reactnative.splashscreen.SplashScreenPackage;
import com.microsoft.codepush.react.CodePush;
import com.rnfs.RNFSPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  public static Context context;

//  protected boolean checkGooglePlaySevices() {
//    final int googlePlayServicesCheck = GoogleApiAvailability.getInstance().isGooglePlayServicesAvailable(context);
//    switch (googlePlayServicesCheck) {
//      case ConnectionResult.SUCCESS:
//        return true;
//      case ConnectionResult.SERVICE_DISABLED:
//      case ConnectionResult.SERVICE_INVALID:
//      case ConnectionResult.SERVICE_MISSING:
//      case ConnectionResult.SERVICE_VERSION_UPDATE_REQUIRED:
//        Dialog dialog = GooglePlayServicesUtil.getErrorDialog(googlePlayServicesCheck, activity, 0);
//        dialog.setOnCancelListener(new DialogInterface.OnCancelListener() {
//          @Override
//          public void onCancel(DialogInterface dialogInterface) {
//            activity.finish();
//          }
//        });
//        dialog.show();
//    }
//    return false;
//  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

    @Override
    protected String getJSBundleFile() {
        return CodePush.getJSBundleFile();
        }

    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      List<ReactPackage> packages = new ArrayList<>();
      packages.add(new MainReactPackage());
      packages.add(new OpenAppSettingsPackage());
      packages.add(new LottiePackage());
      packages.add(new RNCameraPackage());
      packages.add(new ImagePickerPackage());
      packages.add(new PickerViewPackage());
      packages.add(new SplashScreenPackage());
      packages.add(new ReactNativePushNotificationPackage());
      packages.add(new RNDeviceInfo());
      packages.add(new VectorIconsPackage());
      packages.add(new CodePush(getResources().getString(R.string.reactNativeCodePush_androidDeploymentKey), getApplicationContext(), BuildConfig.DEBUG));
      packages.add(new AMap3DPackage());
      packages.add(new DplusReactPackage());
      packages.add(new RNFSPackage());

      int googleAvailable = GoogleApiAvailability.getInstance().isGooglePlayServicesAvailable(context);
      if (googleAvailable == ConnectionResult.SUCCESS || googleAvailable == ConnectionResult.SERVICE_VERSION_UPDATE_REQUIRED) {
        packages.add(new MapsPackage());
      }
      return packages;
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }

  };

  @Override
  protected void attachBaseContext(Context base) {
    super.attachBaseContext(base);
//    MultiDex.install(this);
  }

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    context = this.getApplicationContext();

//    com.tencent.bugly.
//    CrashReport.initCrashReport(getApplicationContext(), "71b843ec39", false);
//    SoLoader.init(getApplicationContext(), /* native exopackage */ false);
  }

  public static void sendEvent(ReactContext appContext, String eventName, WritableMap map) {
    appContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, map);
  }
}
