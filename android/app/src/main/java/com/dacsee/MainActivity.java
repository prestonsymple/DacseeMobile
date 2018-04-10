package com.dacsee;

import android.content.Intent;
import android.os.Bundle;

import com.dacsee.nativeBridge.UMeng.ShareModule;
import com.facebook.react.ReactActivity;
import com.mehcode.reactnative.splashscreen.SplashScreen;
import com.umeng.socialize.UMShareAPI;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "dacsee";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this, getReactInstanceManager());
        ShareModule.initSocialSDK(this);
        super.onCreate(savedInstanceState);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        UMShareAPI.get(this).onActivityResult(requestCode,resultCode,data);
    }
}
