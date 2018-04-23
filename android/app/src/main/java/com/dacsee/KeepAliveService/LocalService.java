package com.dacsee.KeepAliveService;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.content.SharedPreferences;
import android.os.IBinder;
import android.os.RemoteException;
import android.support.annotation.Nullable;
import android.util.Log;
import android.widget.RemoteViews;
import android.widget.Toast;

import com.dacsee.MainActivity;
import com.dacsee.R;
import com.dacsee.RemoteServiceInterface;
import com.dacsee.utils.HttpConnectionUtil;
import com.dacsee.utils.LocationManagerUtil;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;


public class LocalService extends Service {
  MyBinder binder;
  MyConn conn;

  Notification.Builder notification;
  NotificationManager serviceManager;
  RemoteViews remoteView;
  Thread threadHandle = null;

  public static final int SERVICE_ID = 0;

  @Nullable
  @Override
  public IBinder onBind(Intent intent) {
    return binder;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    binder = new MyBinder();
    conn = new MyConn();

    remoteView = new RemoteViews(getPackageName(), R.layout.driver_board_service);
    notification = new Notification.Builder(this.getApplicationContext());
    serviceManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
  }

  public static String padRight(String src, int len, char ch) {
    int diff = len - src.length();
    if (diff <= 0) {
      return src;
    }

    char[] charr = new char[len];
    System.arraycopy(src.toCharArray(), 0, charr, diff, src.length());
    for (int i = 0; i < diff; i++) {
      charr[i] = ch;
    }
    return new String(charr);
  }


  class MyBinder extends RemoteServiceInterface.Stub {
    @Override
    public String getServiceName() throws RemoteException {
      return LocalService.class.getSimpleName();
    }
  }

  @Override
  public int onStartCommand(Intent intent, int flags, int startId) {

    this.bindService(new Intent(LocalService.this, RemoteService.class), conn, Context.BIND_IMPORTANT);

    if (threadHandle == null) {
      threadHandle = new Thread(new Runnable() {
        @Override
        public void run()
        {
          while(true) {
            SharedPreferences preferences = LocalService.this.getSharedPreferences("defaultPerferences", Context.MODE_PRIVATE);
            boolean active = preferences.getBoolean("location_tracking",false);
            String vehicle_id = preferences.getString("vehicle_id", "");

            if (active) {
              SimpleDateFormat df = new SimpleDateFormat("yyyy_MM_dd");
              String date = df.format(new Date());
              long tick = preferences.getLong(date,0);

              long _hour = (tick / 60 / 60);
              String hour = padRight(String.valueOf(_hour), 2, '0');

              long _minute = (tick - (_hour * 60 * 60)) / 60;
              String minute = padRight(String.valueOf(_minute), 2, '0');

              long _second = tick % 60;
              String second = padRight(String.valueOf(_second), 2, '0');

              notification.setContent(remoteView);
              remoteView.setTextViewText(R.id.current_time, String.format("%s:%s:%s", hour, minute, second));
              serviceManager.notify(SERVICE_ID, notification.build());

              // 5s update location
              if (tick % 5 == 0) {
                String authorization = preferences.getString("authorization", "");
                try {
                  Map<String, Object> headers = new HashMap<>();
                  headers.put("Authorization", authorization);

                  Map<String, Object> body = new HashMap<>();
                  body.put("latitude", LocationManagerUtil.shareInstance().lastLocation.getLatitude());
                  body.put("longitude", LocationManagerUtil.shareInstance().lastLocation.getLongitude());

                  if (vehicle_id.length() != 0) {
                    body.put("vehicle_id", vehicle_id);
                  }

                  HttpConnectionUtil.getHttp().putRequset("https://location-dev.dacsee.io/api/v1", headers, body);
                } catch (Exception e) {
                  /*  */
                }
              }

              tick += 1;

              SharedPreferences.Editor editor = preferences.edit();
              editor.putLong(date, tick);
              editor.apply();
            } else {
              serviceManager.cancel(SERVICE_ID);
            }

            try {
              Thread.sleep( 1000);
            } catch (InterruptedException e) {
              e.printStackTrace();
            }
          }
        }
      });
      threadHandle.start();
    }

    notification = new Notification.Builder(this.getApplicationContext())
            .setContent(remoteView)
            .setPriority(Notification.PRIORITY_MAX)
            .setSmallIcon(R.mipmap.ic_launcher)
            .setOngoing(true)
            .setWhen(System.currentTimeMillis());

    Intent _intent = new Intent(this, MainActivity.class);
    PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, _intent, PendingIntent.FLAG_UPDATE_CURRENT);
    notification.setContentIntent(pendingIntent);



    serviceManager.notify(SERVICE_ID, notification.build());

    return START_STICKY;
  }



  class MyConn implements ServiceConnection {
    @Override
    public void onServiceConnected(ComponentName name, IBinder service) {
    }

    @Override
    public void onServiceDisconnected(ComponentName name) {
      LocalService.this.startService(new Intent(LocalService.this, RemoteService.class));
      LocalService.this.bindService(new Intent(LocalService.this, RemoteService.class), conn, Context.BIND_IMPORTANT);
    }
  }

  @Override
  public void onDestroy() {
    super.onDestroy();
    LocalService.this.startService(new Intent(LocalService.this, RemoteService.class));
    LocalService.this.bindService(new Intent(LocalService.this, RemoteService.class), conn, Context.BIND_IMPORTANT);

  }
}