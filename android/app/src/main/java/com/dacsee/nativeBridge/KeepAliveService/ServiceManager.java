package com.dacsee.nativeBridge.KeepAliveService;

import android.content.ComponentName;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.Bundle;
import android.os.IBinder;

import com.dacsee.MainApplication;

import static android.content.Context.BIND_AUTO_CREATE;

public class ServiceManager {

  private static DriverBinder mbinder;

  private static ServiceConnection mServiceConnection = new ServiceConnection() {

    @Override
    public void onServiceDisconnected(ComponentName name) {
      // TODO Auto-generated method stub

    }

    @Override
    public void onServiceConnected(ComponentName name, IBinder service) {
    }
  };

  public static void startService() {
    final Intent intent = new Intent(MainApplication.context, DriverServiceHandle.class);
    intent.setAction(DriverServiceHandle.ACTION_START);
    MainApplication.context.startService(intent);
  }

  public static void endService() {
    final Intent intent = new Intent(MainApplication.context, DriverServiceHandle.class);
    intent.setAction(DriverServiceHandle.ACTION_CLOSE);
    MainApplication.context.stopService(intent);
  }

  public static void connectionService() {
    final Intent intent = new Intent(MainApplication.context, DriverServiceHandle.class);
    MainApplication.context.bindService(intent, mServiceConnection, BIND_AUTO_CREATE);
  }

  public static void setService(Bundle bundle) {
    final Intent intent = new Intent(MainApplication.context, DriverServiceHandle.class);
    intent.setAction(DriverServiceHandle.ACTION_SET_BUNDLE);
    intent.putExtra("bundle", bundle);
    MainApplication.context.startService(intent);
  }
}
