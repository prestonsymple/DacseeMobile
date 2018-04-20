package com.dacsee.utils;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.Map;
import java.util.concurrent.Callable;
import java.util.concurrent.FutureTask;

public class HttpConnectionUtil {
  public static HttpConnectionUtil http = new HttpConnectionUtil();

  public static HttpConnectionUtil getHttp() {
    return http;
  }

  public String getRequset(final String url) {
    final StringBuilder sb = new StringBuilder();
    FutureTask<String> task = new FutureTask<String>(new Callable<String>() {
      @Override
      public String call() throws Exception {
        HttpURLConnection connection = null;
        BufferedReader reader = null;
        try {
          URL requestUrl = new URL(url);
          connection = (HttpURLConnection) requestUrl.openConnection();
          connection.setRequestMethod("GET");
          connection.setConnectTimeout(8000);
          connection.setReadTimeout(8000);
          if (connection.getResponseCode() == 200) {
            InputStream in = connection.getInputStream();
            reader = new BufferedReader(new InputStreamReader(in));
            String line;
            while ((line = reader.readLine()) != null) {
              sb.append(line);
            }
            System.out.println(sb);

          }
        } catch (Exception e) {
          e.printStackTrace();
        } finally {
          if (reader != null) {
            reader.close();
          }
          if (connection != null) {
            connection.disconnect();//断开连接，释放资源
          }
        }
        return sb.toString();
      }
    });
    new Thread(task).start();
    String s = null;
    try {
      s = task.get();
    } catch (Exception e) {
      e.printStackTrace();
    }
    return s;
  }

  public String postRequset(final String url, final Map<String, Object> header, final Map<String, Object> map) {
    final StringBuilder sb = new StringBuilder();
    FutureTask<String> task = new FutureTask<String>(new Callable<String>() {
      @Override
      public String call() throws Exception {
        HttpURLConnection connection = null;
        BufferedReader reader = null;
        try {
          URL requestUrl = new URL(url);
          connection = (HttpURLConnection) requestUrl.openConnection();
          connection.setRequestMethod("POST");
          connection.setConnectTimeout(8000);//链接超时
          connection.setReadTimeout(8000);//读取超时
          //发送post请求必须设置
          connection.setDoOutput(true);
          connection.setDoInput(true);
          connection.setUseCaches(false);
          connection.setInstanceFollowRedirects(true);
          connection.setRequestProperty("Content-Type", "application/json");

          for (String key : header.keySet()) {
            connection.setRequestProperty(key, URLEncoder.encode(header.get(key).toString(), "UTF-8"));
          }

          DataOutputStream out = new DataOutputStream(connection
                  .getOutputStream());
          StringBuilder request = new StringBuilder();

          // TO JSON
          JSONObject json = new JSONObject(map);
          request.append(json.toString());

          out.writeBytes(request.toString());
          out.flush();
          out.close();
          if (connection.getResponseCode() == 200) {
            InputStream in = connection.getInputStream();
            reader = new BufferedReader(new InputStreamReader(in));
            String line;
            while ((line = reader.readLine()) != null) {
              sb.append(line);
            }
            System.out.println(sb);
          }
        } catch (Exception e) {
          e.printStackTrace();
        } finally {
          if (reader != null) {
            reader.close();//关闭流
          }
          if (connection != null) {
            connection.disconnect();//断开连接，释放资源
          }
        }
        return sb.toString();
      }
    });
    new Thread(task).start();
    String s = null;
    try {
      s = task.get();
    } catch (Exception e) {
      e.printStackTrace();
    }
    return s;
  }

}