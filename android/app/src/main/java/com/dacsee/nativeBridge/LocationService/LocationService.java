package com.dacsee.nativeBridge.LocationService;

import android.content.Context;
import android.content.SharedPreferences;

import com.dacsee.MainApplication;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class LocationService extends ReactContextBaseJavaModule {


  public LocationService(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "LocationService";
  }

  @ReactMethod
  public void startTracking(String vehicle_id, final Callback successCallback) {
    SharedPreferences preferences = MainApplication.context.getSharedPreferences("defaultPerferences", Context.MODE_PRIVATE);
    SharedPreferences.Editor editor = preferences.edit();
    editor.putBoolean("location_tracking", true);
    editor.putString("vehicle_id", vehicle_id);
    editor.apply();
    successCallback.invoke();
  }

  @ReactMethod
  public void stopTracking(final Callback successCallback) {
    SharedPreferences preferences = MainApplication.context.getSharedPreferences("defaultPerferences", Context.MODE_PRIVATE);
    SharedPreferences.Editor editor = preferences.edit();
    editor.putBoolean("location_tracking", false);
    editor.putString("vehicle_id", "");
    editor.apply();
    successCallback.invoke();
  }

}
