package com.dacsee.utils;

import android.content.Context;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;

import com.dacsee.MainApplication;

public class LocationManagerUtil {

  private static Location lastLocation;

  private static LocationManager mLocationManager;
  private static LocationListener mLocationListener = new LocationListener() {

    @Override
    public void onStatusChanged(String provider, int status, Bundle extras) { }

    @Override
    public void onProviderEnabled(String provider) {
      Location location = mLocationManager.getLastKnownLocation(provider);
      lastLocation = location;
    }

    @Override
    public void onProviderDisabled(String provider) { }

    @Override
    public void onLocationChanged(Location location) { }

  };

  public void startLocationUpdate() {
    Location location = mLocationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER);
    mLocationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 5000, 8, mLocationListener);
    lastLocation = location;
  }

  public void stopLocationUpdate() {
    mLocationManager.removeUpdates(mLocationListener);
  }

  public LocationManagerUtil() {
    if (mLocationManager == null) {
      mLocationManager = (LocationManager)MainApplication.context.getSystemService(Context.LOCATION_SERVICE);
    }
  }

}
