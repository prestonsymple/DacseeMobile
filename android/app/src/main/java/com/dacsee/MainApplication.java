package com.dacsee;

import android.app.Application;
import android.content.Context;

import com.dacsee.nativeBridge.AMap.AMap3DPackage;
import com.dacsee.nativeBridge.PushService.ReactNativePushNotificationPackage;
import com.facebook.react.ReactApplication;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.mehcode.reactnative.splashscreen.SplashScreenPackage;
import com.airbnb.android.react.lottie.LottiePackage;
import com.microsoft.codepush.react.CodePush;
import com.rnfs.RNFSPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.tencent.bugly.crashreport.CrashReport;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

public class MainApplication extends Application implements ReactApplication {

  public static Context context;

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
      return Arrays.<ReactPackage>asList(
              new MainReactPackage(),
              new SplashScreenPackage(),
              new LottiePackage(),
              new ReactNativePushNotificationPackage(),
//            new MapsPackage(),
              new RNFSPackage(),
              new RNDeviceInfo(),
              new VectorIconsPackage(),
              new CodePush(getResources().getString(R.string.reactNativeCodePush_androidDeploymentKey), getApplicationContext(), BuildConfig.DEBUG),
              new AMap3DPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    context = this.getApplicationContext();
    CrashReport.initCrashReport(getApplicationContext(), "71b843ec39", false);
    SoLoader.init(this, /* native exopackage */ false);
  }

  public static void sendEvent(ReactApplicationContext appContext, String eventName, WritableMap map) {
    appContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, map);
  }
}
