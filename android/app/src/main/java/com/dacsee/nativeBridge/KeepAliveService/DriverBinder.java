package com.dacsee.nativeBridge.KeepAliveService;

import android.app.Application;
import android.content.Context;
import android.content.Intent;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.location.LocationProvider;
import android.os.Binder;
import android.os.Bundle;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.Parcel;
import android.os.RemoteException;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.util.Log;


import com.dacsee.R;
import com.dacsee.utils.HttpConnectionUtil;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.Callable;
import java.util.concurrent.FutureTask;

class DriverBinder extends Binder {

  private Intent _intent;
  private HandlerThread mThread;
  private Handler mHandler;

  private String mToken;

  private LocationManager mLocationManager;
//  private Runnable mBackgroundRunnable = new Runnable() {
//    @Override
//    public void run() {
//
//      Location location = mLocationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER);
//      mLocationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 5000, 8, new LocationListener() {
//
//        @Override
//        public void onStatusChanged(String provider, int status, Bundle extras) {
//          // TODO Auto-generated method stub
//        }
//
//        @Override
//        public void onProviderEnabled(String provider) {
//          Location location = mLocationManager.getLastKnownLocation(provider);
//          sessionUpdateLocation(location.getLatitude(), location.getLongitude());
//        }
//
//        @Override
//        public void onProviderDisabled(String provider) {
//          // TODO Auto-generated method stub
//        }
//
//        @Override
//        public void onLocationChanged(Location location) {
//          sessionUpdateLocation(location.getLatitude(), location.getLongitude());
//        }
//
//      });
//      sessionUpdateLocation(location.getLatitude(), location.getLongitude());
//    }
//  };

  private void sessionUpdateLocation(double latitude, double longitude) {
    Map header = new HashMap<String, String>();
    header.put("Authorization", mToken);

    Map body = new HashMap<String, Integer>();
    body.put("latitude", latitude);
    body.put("longitude", longitude);

    HttpConnectionUtil.getHttp().postRequset("https://location-dev.dacsee.io/api/v1", header, body);
  }

  public void runTask(Context context, String token) {

//    mLocationManager = (LocationManager)context.getSystemService(Context.LOCATION_SERVICE);
//    mToken = token;

//    mThread = new HandlerThread("DRIVER_RUN_TASK");
//    mThread.start();
//
//    mHandler = new Handler(mThread.getLooper());
//    mHandler.post(mBackgroundRunnable);

    new Thread(new Runnable()
    {
      @Override
      public void run()
      {
        while(true) {

          Log.e("DEBUG", "SERVICE 正在运行中");

          try {
            Thread.sleep(1 * 1000);
          } catch (InterruptedException e) {
            e.printStackTrace();
          }
        }
      }
    }).start();

  }

  public void stopTask() {
//    mHandler.removeCallbacks(mBackgroundRunnable);
  }

  @Override
  protected boolean onTransact(int code, @NonNull Parcel data, @Nullable Parcel reply, int flags) throws RemoteException {
    return super.onTransact(code, data, reply, flags);
  }
}