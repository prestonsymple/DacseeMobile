package com.dacsee.nativeBridge.Utils;

import android.content.Context;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GoogleApiAvailability;

public class DeviceModule extends ReactContextBaseJavaModule {

  Context _context;

  public DeviceModule(ReactApplicationContext reactContext) {
    super(reactContext);
    _context = reactContext;
  }

  @Override
  public String getName() {
    return "UtilDevice";
  }

  @ReactMethod
  public void getGMSStatus(final Callback successCallback) {
    int googleAvailable = GoogleApiAvailability.getInstance().isGooglePlayServicesAvailable(_context);

    String message = "";
    switch (googleAvailable) {
      case ConnectionResult.SUCCESS:
        message = "SUCCESS";
        break;
      case ConnectionResult.CANCELED:
        message = "CANCELED";
        break;
      case ConnectionResult.API_UNAVAILABLE:
        message = "API_UNAVAILABLE";
        break;
      case ConnectionResult.DEVELOPER_ERROR:
        message = "DEVELOPER_ERROR";
        break;
      case ConnectionResult.INTERNAL_ERROR:
        message = "INTERNAL_ERROR";
        break;
      case ConnectionResult.INTERRUPTED:
        message = "INTERRUPTED";
        break;
      case ConnectionResult.INVALID_ACCOUNT:
        message = "INVALID_ACCOUNT";
        break;
      case ConnectionResult.LICENSE_CHECK_FAILED:
        message = "LICENSE_CHECK_FAILED";
        break;
      case ConnectionResult.NETWORK_ERROR:
        message = "NETWORK_ERROR";
        break;
      case ConnectionResult.RESOLUTION_REQUIRED:
        message = "RESOLUTION_REQUIRED";
        break;
      case ConnectionResult.RESTRICTED_PROFILE:
        message = "RESTRICTED_PROFILE";
        break;
      case ConnectionResult.SERVICE_DISABLED:
        message = "SERVICE_DISABLED";
        break;
      case ConnectionResult.SERVICE_INVALID:
        message = "SERVICE_INVALID";
        break;
      case ConnectionResult.SERVICE_MISSING:
        message = "SERVICE_MISSING";
        break;
      case ConnectionResult.SERVICE_MISSING_PERMISSION:
        message = "SERVICE_MISSING_PERMISSION";
        break;
      case ConnectionResult.SERVICE_UPDATING:
        message = "SERVICE_UPDATING";
        break;
      case ConnectionResult.SERVICE_VERSION_UPDATE_REQUIRED:
        message = "SERVICE_VERSION_UPDATE_REQUIRED";
        break;
      case ConnectionResult.SIGN_IN_FAILED:
        message = "SIGN_IN_FAILED";
        break;
      case ConnectionResult.SIGN_IN_REQUIRED:
        message = "SIGN_IN_REQUIRED";
        break;
      case ConnectionResult.TIMEOUT:
        message = "TIMEOUT";
        break;
      default:
        message = "ERROR";
        break;
    }

    WritableMap result = Arguments.createMap();
    result.putInt("code", googleAvailable);
    result.putString("message", message);
    successCallback.invoke(result);
  }

}
