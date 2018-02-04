package com.dacsee.nativeBridge.AMap;

import android.content.Context;
import android.util.Log;

import com.amap.api.services.core.LatLonPoint;
import com.amap.api.services.core.PoiItem;
import com.amap.api.services.poisearch.PoiResult;
import com.amap.api.services.poisearch.PoiSearch;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import org.jetbrains.annotations.NotNull;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by quzhi on 03/02/2018.
 */

public class AMapSearchModule extends ReactContextBaseJavaModule implements PoiSearch.OnPoiSearchListener {

  private Promise _promise;

  public AMapSearchModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() { return "AMapSearch"; }

  @Override
  public void onPoiItemSearched(PoiItem poiItem, int i) {
    Log.e("[DEBUG]", poiItem.toString());
  }

  @Override
  public void onPoiSearched(PoiResult poiResult, int i) {
    if (_promise == null) return;

    WritableArray pois = Arguments.createArray();
    for (PoiItem item :poiResult.getPois()) {
      WritableMap map = Arguments.createMap();
      map.putString("uid", item.getPoiId());
      map.putString("name", item.getTitle());
      map.putString("address", item.getSnippet());

      WritableMap location = Arguments.createMap();
      location.putDouble("lng", item.getLatLonPoint().getLongitude());
      location.putDouble("lat", item.getLatLonPoint().getLatitude());
      map.putMap("location", location);

      map.putInt("distance", item.getDistance());
      map.putString("city", item.getCityName());
      map.putString("district", item.getAdName());
      pois.pushMap(map);
    }

    WritableMap map = Arguments.createMap();
    map.putArray("pois", pois);
    map.putString("type", "ANDROID_PROMISE_TYPE");
    map.putInt("count", poiResult.getPois().size());
    _promise.resolve(map);
    _promise = null;
  }

  @ReactMethod
  public final void searchLocation(double lat, double lng, Promise promise) {
    PoiSearch.Query query = new PoiSearch.Query("", "");
    query.setPageSize(20);
    PoiSearch poiSearch = new PoiSearch(this.getReactApplicationContext(), query);
    poiSearch.setBound(new PoiSearch.SearchBound(new LatLonPoint(lat, lng), 500));
    poiSearch.setOnPoiSearchListener((PoiSearch.OnPoiSearchListener)this);
    poiSearch.searchPOIAsyn();

    if (_promise != null) _promise.reject("-1", "上一个未完成");
    _promise = promise;
  }

  @ReactMethod
  public final void searchKeywords(@NotNull String keyword, @NotNull String city, Promise promise) {
    PoiSearch.Query query = new PoiSearch.Query(keyword, city);
    query.setPageSize(20);
    PoiSearch poiSearch = new PoiSearch(this.getReactApplicationContext(), query);
    poiSearch.setOnPoiSearchListener((PoiSearch.OnPoiSearchListener)this);
    poiSearch.searchPOIAsyn();

    if (_promise != null) _promise.reject("-1", "上一个未完成");
    _promise = promise;
  }

}
