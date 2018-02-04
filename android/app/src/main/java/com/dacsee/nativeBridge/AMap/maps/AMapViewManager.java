package com.dacsee.nativeBridge.AMap.maps;

import android.content.Context;
import android.view.View;
import android.view.ViewGroup;

import com.amap.api.maps.AMap;
import com.amap.api.maps.CameraUpdateFactory;
import com.amap.api.maps.UiSettings;
import com.amap.api.maps.model.LatLng;
import com.amap.api.services.core.LatLonPoint;
import com.amap.api.services.core.PoiItem;
import com.amap.api.services.poisearch.PoiResult;
import com.amap.api.services.poisearch.PoiSearch;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by quzhi on 03/02/2018.
 */
//PoiSearch.PoiSearch.OnPoiSearchListener
public class AMapViewManager extends ViewGroupManager<AMapView> {

  private static final int ANIMATE_TO = 1;
  private ThemedReactContext _context;

  public String getName() {
    return "AMapView";
  }

  @Override
  protected AMapView createViewInstance(ThemedReactContext reactContext) {
    this._context = reactContext;
    return new AMapView(reactContext);
  }

  public void onDropViewInstance(AMapView view) {
    super.onDropViewInstance(view);
    view.onDestroy();
  }

  public Map getCommandsMap() {
    Map maps = new HashMap<String, Integer>();
    maps.put("animateTo", this.ANIMATE_TO);
    return maps;
  }

  public void receiveCommand(@NotNull AMapView overlay, int commandId, @Nullable ReadableArray args) {
    if (commandId == this.ANIMATE_TO) {
      overlay.animateTo(args);
    }
  }

  @Override
  public void addView(AMapView parent, View child, int index) {
    parent.add(child);
    super.addView(parent, child, index);
  }

  @Override
  public void removeViewAt(AMapView parent, int index) {
    parent.removeViewAt(index);
    super.removeViewAt(parent, index);
  }

  @javax.annotation.Nullable
  @Override
  public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
    Map event = MapBuilder.of(
            "onPress", MapBuilder.of("registrationName", "onPress"),
            "onLongPress", MapBuilder.of("registrationName", "onLongPress"),
            "onAnimateCancel", MapBuilder.of("registrationName", "onAnimateCancel"),
            "onAnimateFinish", MapBuilder.of("registrationName", "onAnimateFinish"),
            "onStatusChange", MapBuilder.of("registrationName", "onStatusChange"),
            "onStatusChangeComplete", MapBuilder.of("registrationName", "onStatusChangeComplete"),
            "onLocation", MapBuilder.of("registrationName", "onLocation"));
    return event;
  }

  @ReactProp(name = "locationEnabled")
  public final void setMyLocationEnabled(@NotNull AMapView view, boolean enabled) {
    view.setLocationEnabled(enabled);
  }

  @ReactProp(name = "showsIndoorMap")
  public final void showIndoorMap(@NotNull AMapView view, boolean show) {
    view.getMap().showIndoorMap(show);
  }

  @ReactProp(name = "showsIndoorSwitch")
  public final void setIndoorSwitchEnabled(@NotNull AMapView view, boolean show) {
    AMap var10000 = view.getMap();
    UiSettings var3 = var10000.getUiSettings();
    var3.setIndoorSwitchEnabled(show);
  }

  @ReactProp(name = "showsBuildings")
  public final void showBuildings(@NotNull AMapView view, boolean show) {
    view.getMap().showBuildings(show);
  }

  @ReactProp(name = "showsLabels")
  public final void showMapText(@NotNull AMapView view, boolean show) {
    view.getMap().showMapText(show);
  }

  @ReactProp(name = "showsCompass")
  public final void setCompassEnabled(@NotNull AMapView view, boolean show) {
    AMap var10000 = view.getMap();
    UiSettings var3 = var10000.getUiSettings();
    var3.setCompassEnabled(show);
  }

  @ReactProp(name = "showsZoomControls")
  public final void setZoomControlsEnabled(@NotNull AMapView view, boolean enabled) {
    AMap var10000 = view.getMap();
    UiSettings var3 = var10000.getUiSettings();
    var3.setZoomControlsEnabled(enabled);
  }

  @ReactProp(name = "showsScale")
  public final void setScaleControlsEnabled(@NotNull AMapView view, boolean enabled) {
    AMap var10000 = view.getMap();
    UiSettings var3 = var10000.getUiSettings();
    var3.setScaleControlsEnabled(enabled);
  }

  @ReactProp(name = "showsLocationButton")
  public final void setMyLocationButtonEnabled(@NotNull AMapView view, boolean enabled) {
    AMap var10000 = view.getMap();
    UiSettings var3 = var10000.getUiSettings();
    var3.setMyLocationButtonEnabled(enabled);
  }

  @ReactProp(name = "showsTraffic")
  public final void setTrafficEnabled(@NotNull AMapView view, boolean enabled) {
    AMap var10000 = view.getMap();
    var10000.setTrafficEnabled(enabled);
  }

  @ReactProp(name = "maxZoomLevel")
  public final void setMaxZoomLevel(@NotNull AMapView view, float zoomLevel) {
    AMap var10000 = view.getMap();
    var10000.setMaxZoomLevel(zoomLevel);
  }

  @ReactProp(name = "minZoomLevel")
  public final void setMinZoomLevel(@NotNull AMapView view, float zoomLevel) {
    AMap var10000 = view.getMap();
    var10000.setMinZoomLevel(zoomLevel);
  }

  @ReactProp(name = "zoomLevel")
  public final void setZoomLevel(@NotNull AMapView view, float zoomLevel) {
    view.getMap().moveCamera(CameraUpdateFactory.zoomTo(zoomLevel));
  }

  @ReactProp(name = "zoomEnabled")
  public final void setZoomGesturesEnabled(@NotNull AMapView view, boolean enabled) {
    AMap var10000 = view.getMap();
    UiSettings var3 = var10000.getUiSettings();
    var3.setZoomGesturesEnabled(enabled);
  }

  @ReactProp(name = "mapType")
  public final void setMapType(@NotNull AMapView view, @NotNull String mapType) {
    AMap var10000;
    switch(mapType) {
      case "satellite":
          var10000 = view.getMap();
          var10000.setMapType(2);
        break;
      case "bus":
          var10000 = view.getMap();
          var10000.setMapType(5);
        break;
      case "night":
          var10000 = view.getMap();
          var10000.setMapType(3);
        break;
      case "standard":
          var10000 = view.getMap();
          var10000.setMapType(1);
        break;
      case "navigation":
          var10000 = view.getMap();
          var10000.setMapType(4);
    }
  }

  @ReactProp(name = "scrollEnabled")
  public final void setScrollGesturesEnabled(@NotNull AMapView view, boolean enabled) {
    AMap var10000 = view.getMap();
    UiSettings var3 = var10000.getUiSettings();
    var3.setScrollGesturesEnabled(enabled);
  }

  @ReactProp(name = "rotateEnabled")
  public final void setRotateGesturesEnabled(@NotNull AMapView view, boolean enabled) {
    AMap var10000 = view.getMap();
    UiSettings var3 = var10000.getUiSettings();
    var3.setRotateGesturesEnabled(enabled);
  }

  @ReactProp(name = "tiltEnabled")
  public final void setTiltGesturesEnabled(@NotNull AMapView view, boolean enabled) {
    AMap var10000 = view.getMap();
    UiSettings var3 = var10000.getUiSettings();
    var3.setTiltGesturesEnabled(enabled);
  }

  @ReactProp(name = "coordinate")
  public final void moveToCoordinate(@NotNull AMapView view, @NotNull ReadableMap coordinate) {
    view.getMap().moveCamera(CameraUpdateFactory.changeLatLng(new LatLng(coordinate.getDouble("latitude"), coordinate.getDouble("longitude"))));
  }

  @ReactProp(name = "region")
  public final void setRegion(@NotNull AMapView view, @NotNull ReadableMap region) {
    view.setRegion(region);
  }

  @ReactProp(name = "limitRegion")
  public final void setLimitRegion(@NotNull AMapView view, @NotNull ReadableMap limitRegion) {
    view.setLimitRegion(limitRegion);
  }

  @ReactProp(name = "tilt")
  public final void changeTilt(@NotNull AMapView view, float tilt) {
    view.getMap().moveCamera(CameraUpdateFactory.changeTilt(tilt));
  }

  @ReactProp(name = "rotation")
  public final void changeRotation(@NotNull AMapView view, float rotation) {
    view.getMap().moveCamera(CameraUpdateFactory.changeBearing(rotation));
  }

  @ReactProp(name = "locationInterval")
  public final void setLocationInterval(@NotNull AMapView view, int interval) {
    view.setLocationInterval((long)interval);
  }

  @ReactProp(name = "locationStyle")
  public final void setLocationStyle(@NotNull AMapView view, @NotNull ReadableMap style) {
    view.setLocationStyle(style);
  }
}
