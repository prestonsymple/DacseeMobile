package com.dacsee.utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class DateTimeUtil {

  private long time;
  private Date mCurDate;

  public DateTimeUtil() {
    this(System.currentTimeMillis());
  }

  public DateTimeUtil(long currMillis) {
    time = currMillis;
  }

  public String toString(String pattern) {
    SimpleDateFormat dateFormat = new SimpleDateFormat(pattern);
    if (mCurDate == null) {
      mCurDate = new Date(time);
    } else {
      mCurDate.setTime(time);
    }
    return dateFormat.format(mCurDate);
  }

  public String toString() {
    return toString("yyyy-MM-dd HH:mm:ss");
  }

  public DateTimeUtil plusHour(int i) {
    Calendar calendar = Calendar.getInstance();
    calendar.setTimeInMillis(time);
    calendar.set(Calendar.HOUR_OF_DAY, calendar.get(Calendar.HOUR_OF_DAY) + i);
    return new DateTimeUtil(calendar.getTimeInMillis());
  }

  public static DateTimeUtil parse(String timeStr, String pattern) {
    SimpleDateFormat sdf = new SimpleDateFormat(pattern);
    try {
      Date date = sdf.parse(timeStr);
      return new DateTimeUtil(date.getTime());
    } catch (ParseException e) {
      return new DateTimeUtil();
    }
  }

  public Date getDate() {
    return new Date(time);
  }

  public long getMillis() {
    return time;
  }

  public boolean after(DateTimeUtil dateTime) {
    return time > dateTime.getMillis();
  }

  public boolean after(long millis) {
    return this.time > millis;
  }
}