package com.dacsee.nativeBridge.KeepAliveService;


import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.IBinder;
import android.util.Log;
import android.widget.RemoteViews;

import com.dacsee.MainActivity;
import com.dacsee.R;

public class DriverServiceHandle extends Service {

  private static final String TAG = DriverServiceHandle.class.getSimpleName();

  public static final String ACTION_SET_BUNDLE = "@@DACSEE.SET.BUNDLE.SERVICE";

  public static final String ACTION_START = "@@DACSEE.START.SERVICE";
  public static final String ACTION_CLOSE = "@@DACSEE.CLOSE.SERVICE";

  public static final int SERVICE_ID = 0;

  private long _timerTick = 0;
  private Thread _runTask = new Thread(new Runnable()
  {
    @Override
    public void run()
    {
      while(true) {

        long _hour = (_timerTick / 60 / 60);
        String hour = padRight(String.valueOf(_hour), 2, '0');

        long _minute = (_timerTick - (_hour * 60 * 60)) / 60;
        String minute = padRight(String.valueOf(_minute), 2, '0');

        long _second = _timerTick % 60;
        String second = padRight(String.valueOf(_second), 2, '0');


        remoteView.setTextViewText(R.id.current_time, String.format("%s:%s:%s", hour, minute, second));
        serviceManager.notify(SERVICE_ID, notification.build());
        _timerTick += 1;

        try {
          Thread.sleep(1 * 1000);
        } catch (InterruptedException e) {
          e.printStackTrace();
        }
      }
    }
  });

  private Notification.Builder notification;
  private RemoteViews remoteView;
  private NotificationManager serviceManager;
  private DriverBinder mBinder;

  @Override
  public void onCreate() {
    super.onCreate();
    remoteView = new RemoteViews(getPackageName(), R.layout.driver_board_service);
    notification = new Notification.Builder(this.getApplicationContext());
    serviceManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);

    mBinder = new DriverBinder();
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

  @Override
  public int onStartCommand(Intent intent, int flags, int startId) {
    // 启动服务
    if (intent.getAction() == ACTION_START) {
      startForeground(SERVICE_ID, notification.build());
    }

    // 停止服务
    if (intent.getAction() == ACTION_CLOSE) {
      stopForeground(true);
    }

    // 激活并显示服务
    if (intent.getAction() == ACTION_SET_BUNDLE) {
//      Bundle bundle = intent.getBundleExtra("bundle");

      notification = new Notification.Builder(this.getApplicationContext())
              .setContent(remoteView)
              .setPriority(Notification.PRIORITY_MAX)
              .setSmallIcon(R.mipmap.ic_launcher)
              .setOngoing(true)
              .setWhen(System.currentTimeMillis());

      Intent _intent = new Intent(this, MainActivity.class);
      PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, _intent, PendingIntent.FLAG_UPDATE_CURRENT);
      notification.setContentIntent(pendingIntent);

      new Thread(new Runnable()
      {
        @Override
        public void run()
        {
          long tick = 0;
          while(true) {

            Log.e("DEBUG", "SERVICE 正在运行中");

            long _hour = (tick / 60 / 60);
            String hour = padRight(String.valueOf(_hour), 2, '0');

            long _minute = (tick - (_hour * 60 * 60)) / 60;
            String minute = padRight(String.valueOf(_minute), 2, '0');

            long _second = tick % 60;
            String second = padRight(String.valueOf(_second), 2, '0');


//            Intent intent = new Intent();
//            Context c = null;
//            try {
//
//              c = createPackageContext("com.example.broadcasttest", Context.CONTEXT_INCLUDE_CODE | Context.CONTEXT_IGNORE_SECURITY);
//            } catch (PackageManager.NameNotFoundException e) {
//              e.printStackTrace();
//            }
//            intent.setPackage(getPackageName());
//            intent.setComponent(pkgName, className);
//            intent.setComponent(pkgNameContext, className);
//            intent.setClassName(c, "com.example.broadcasttest.TestBroadcastReceiver");
////            intent.setClassName("com.example.broadcasttest", "com.example.broadcasttest.TestBroadcastReceiver");
//            intent.setAction("my.broadcast.test");
//            intent.setFlags(Intent.FLAG_INCLUDE_STOPPED_PACKAGES);
//            sendBroadcast(intent);


            remoteView.setTextViewText(R.id.current_time, String.format("%s:%s:%s", hour, minute, second));
            serviceManager.notify(SERVICE_ID, notification.build());
            tick += 1;

            try {
              Thread.sleep(1 * 1000);
            } catch (InterruptedException e) {
              e.printStackTrace();
            }
          }
        }
      }).start();

      serviceManager.notify(SERVICE_ID, notification.build());
    }

    return super.onStartCommand(intent, flags, startId);
  }

  @Override
  public IBinder onBind(Intent intent) {
    return mBinder;
  }

  @Override
  public void onDestroy() {
    remoteView.setTextViewText(R.id.current_time, String.format("服务已停止"));
    serviceManager.notify(SERVICE_ID, notification.build());
    Log.e("DEBUG", "SERVICE 已被销毁");
    super.onDestroy();
  }
}
