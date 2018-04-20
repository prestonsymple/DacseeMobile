package com.dacsee.KeepAliveService;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.Service;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.IBinder;
import android.os.RemoteException;
import android.support.annotation.Nullable;
import android.widget.Toast;

import com.dacsee.RemoteServiceInterface;

public class RemoteService extends Service {

  MyConn conn;
  MyBinder binder;

  Intent mIntent;

  @Nullable
  @Override
  public IBinder onBind(Intent intent) {
    return binder;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    conn = new MyConn();
    binder = new MyBinder();
  }

  @Override
  public int onStartCommand(Intent intent, int flags, int startId) {
    this.bindService(new Intent(this, LocalService.class), conn, Context.BIND_IMPORTANT);
    return START_STICKY;
  }

  class MyBinder extends RemoteServiceInterface.Stub {
    @Override
    public String getServiceName() throws RemoteException {
      return RemoteService.class.getSimpleName();
    }
  }

  class MyConn implements ServiceConnection {

    @Override
    public void onServiceConnected(ComponentName name, IBinder service) {

    }

    @Override
    public void onServiceDisconnected(ComponentName name) {
      RemoteService.this.startService(new Intent(RemoteService.this, LocalService.class));
      RemoteService.this.bindService(new Intent(RemoteService.this, LocalService.class), conn, Context.BIND_IMPORTANT);
    }

  }

  @Override
  public void onDestroy() {
    super.onDestroy();
    RemoteService.this.startService(new Intent(RemoteService.this, LocalService.class));
    RemoteService.this.bindService(new Intent(RemoteService.this, LocalService.class), conn, Context.BIND_IMPORTANT);

  }
}
