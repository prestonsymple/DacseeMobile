package com.dacsee;

import android.app.Application;
import android.content.Context;

import com.airbnb.android.react.maps.MapsPackage;
import com.dacsee.nativeBridge.AMap.AMap3DPackage;
import com.dacsee.nativeBridge.PushService.ReactNativePushNotificationPackage;
import com.dacsee.nativeBridge.UMeng.DplusReactPackage;
import com.dacsee.nativeBridge.Utils.UtilsPackages;
import com.facebook.react.ReactApplication;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GoogleApiAvailability;
import com.microsoft.codepush.react.CodePush;
import com.mehcode.reactnative.splashscreen.SplashScreenPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.beefe.picker.PickerViewPackage;
import com.imagepicker.ImagePickerPackage;
import com.rnfs.RNFSPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import org.reactnative.camera.RNCameraPackage;
import com.airbnb.android.react.lottie.LottiePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.tencent.bugly.crashreport.CrashReport;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

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

      List<ReactPackage> packages = new ArrayList<>();
      packages.add(new MainReactPackage());
      packages.add(new LottiePackage());
      packages.add(new RNCameraPackage());
      packages.add(new ImagePickerPackage());
      packages.add(new PickerViewPackage());
      packages.add(new SplashScreenPackage());
      packages.add(new ReactNativePushNotificationPackage());
      packages.add(new RNDeviceInfo());
      packages.add(new VectorIconsPackage());
      packages.add(new CodePush(getResources().getString(R.string.reactNativeCodePush_androidDeploymentKey), getApplicationContext(), com.facebook.react.BuildConfig.DEBUG));
      packages.add(new AMap3DPackage());
      packages.add(new DplusReactPackage());
      packages.add(new RNFSPackage());
      packages.add(new UtilsPackages());

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
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    context = this.getApplicationContext();
    CrashReport.initCrashReport(getApplicationContext(), "71b843ec39", false);
  }

  public static void sendEvent(ReactContext appContext, String eventName, WritableMap map) {
    appContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, map);
  }

}
