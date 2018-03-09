package com.dacsee.nativeBridge.AMap.maps;

import android.content.Context;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;

import com.amap.api.maps.AMap;
import com.amap.api.maps.CameraUpdateFactory;
import com.amap.api.maps.UiSettings;
import com.amap.api.maps.model.LatLng;
import com.amap.api.navi.AMapNavi;
import com.amap.api.navi.AMapNaviListener;
import com.amap.api.navi.model.AMapLaneInfo;
import com.amap.api.navi.model.AMapModelCross;
import com.amap.api.navi.model.AMapNaviCameraInfo;
import com.amap.api.navi.model.AMapNaviCross;
import com.amap.api.navi.model.AMapNaviInfo;
import com.amap.api.navi.model.AMapNaviLocation;
import com.amap.api.navi.model.AMapNaviPath;
import com.amap.api.navi.model.AMapNaviTrafficFacilityInfo;
import com.amap.api.navi.model.AMapServiceAreaInfo;
import com.amap.api.navi.model.AimLessModeCongestionInfo;
import com.amap.api.navi.model.AimLessModeStat;
import com.amap.api.navi.model.NaviInfo;
import com.amap.api.navi.model.NaviLatLng;
import com.amap.api.services.core.LatLonPoint;
import com.amap.api.services.core.PoiItem;
import com.amap.api.services.poisearch.PoiResult;
import com.amap.api.services.poisearch.PoiSearch;
import com.autonavi.tbt.TrafficFacilityInfo;
import com.dacsee.MainApplication;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableNativeArray;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
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
  private static final int CALCULATE_DRIVE_ROUTE = 2;


  private final AMapNaviListener aMapNaviListener = new AMapNaviListener() {
    @Override
    public void onInitNaviFailure() {

    }

    @Override
    public void onInitNaviSuccess() {

    }

    @Override
    public void onStartNavi(int i) {

    }

    @Override
    public void onTrafficStatusUpdate() {

    }

    @Override
    public void onLocationChange(AMapNaviLocation aMapNaviLocation) {

    }

    @Override
    public void onGetNavigationText(int i, String s) {

    }

    @Override
    public void onGetNavigationText(String s) {

    }

    @Override
    public void onEndEmulatorNavi() {

    }

    @Override
    public void onArriveDestination() {

    }

    @Override
    public void onCalculateRouteFailure(int i) {

    }

    @Override
    public void onReCalculateRouteForYaw() {

    }

    @Override
    public void onReCalculateRouteForTrafficJam() {

    }

    @Override
    public void onArrivedWayPoint(int i) {

    }

    @Override
    public void onGpsOpenStatus(boolean b) {

    }

    @Override
    public void onNaviInfoUpdate(NaviInfo naviInfo) {

    }

    @Override
    public void onNaviInfoUpdated(AMapNaviInfo aMapNaviInfo) {

    }

    @Override
    public void updateCameraInfo(AMapNaviCameraInfo[] aMapNaviCameraInfos) {

    }

    @Override
    public void onServiceAreaUpdate(AMapServiceAreaInfo[] aMapServiceAreaInfos) {

    }

    @Override
    public void showCross(AMapNaviCross aMapNaviCross) {

    }

    @Override
    public void hideCross() {

    }

    @Override
    public void showModeCross(AMapModelCross aMapModelCross) {

    }

    @Override
    public void hideModeCross() {

    }

    @Override
    public void showLaneInfo(AMapLaneInfo[] aMapLaneInfos, byte[] bytes, byte[] bytes1) {

    }

    @Override
    public void hideLaneInfo() {

    }

    @Override
    public void onCalculateRouteSuccess(int[] ints) {
      // 路线规划成功
      AMapNaviPath path = _aMapNaviInstace.getNaviPath();

//      WritableArray args = Arguments.createArray();


      WritableMap arg = Arguments.createMap();
      arg.putInt("routeTime", path.getAllTime());


      WritableMap routeCenterPoint = Arguments.createMap();
      if (path.getCenterForPath().getLongitude() != 0 || path.getCenterForPath().getLatitude() != 0) {
        routeCenterPoint.putDouble("longitude", path.getCenterForPath().getLongitude());
        routeCenterPoint.putDouble("latitude", path.getCenterForPath().getLatitude());
      } else {
        NaviLatLng centerPoint = getCenterPoint(path.getCoordList());
        routeCenterPoint.putDouble("longitude", centerPoint.getLongitude());
        routeCenterPoint.putDouble("latitude", centerPoint.getLatitude());
      }
      arg.putMap("routeCenterPoint", routeCenterPoint);

      WritableMap routeBounds = Arguments.createMap();
      WritableMap northEast = Arguments.createMap();
      northEast.putDouble("longitude", path.getBoundsForPath().northeast.longitude);
      northEast.putDouble("latitude", path.getBoundsForPath().northeast.latitude);
      routeBounds.putMap("northEast", northEast);
      WritableMap southWest = Arguments.createMap();
      southWest.putDouble("longitude", path.getBoundsForPath().southwest.longitude);
      southWest.putDouble("latitude", path.getBoundsForPath().southwest.latitude);
      routeBounds.putMap("southWest", southWest);
      arg.putMap("routeBounds", routeBounds);

      arg.putInt("routeLength", path.getAllLength());

      arg.putInt("routeTollCost", path.getTollCost());


      WritableArray routeNaviPoint = Arguments.createArray();
      for(NaviLatLng coord:path.getCoordList()){
        WritableMap map = Arguments.createMap();
        map.putDouble("lat", coord.getLatitude());
        map.putDouble("lng", coord.getLongitude());
        routeNaviPoint.pushMap(map);
      }
      arg.putArray("routeNaviPoint", routeNaviPoint);

//      args.pushMap(arg);
      MainApplication.sendEvent(_context, "EVENT_AMAP_VIEW_ROUTE_SUCCESS", arg);


      if (_aMapNaviInstace != null) {
        _aMapNaviInstace.destroy();
        _aMapNaviInstace = null;
      }
    }

    @Override
    public void notifyParallelRoad(int i) {

    }

    @Override
    public void OnUpdateTrafficFacility(AMapNaviTrafficFacilityInfo aMapNaviTrafficFacilityInfo) {

    }

    @Override
    public void OnUpdateTrafficFacility(AMapNaviTrafficFacilityInfo[] aMapNaviTrafficFacilityInfos) {

    }

    @Override
    public void OnUpdateTrafficFacility(TrafficFacilityInfo trafficFacilityInfo) {

    }

    @Override
    public void updateAimlessModeStatistics(AimLessModeStat aimLessModeStat) {

    }

    @Override
    public void updateAimlessModeCongestionInfo(AimLessModeCongestionInfo aimLessModeCongestionInfo) {

    }

    @Override
    public void onPlayRing(int i) {

    }
  };

  private ThemedReactContext _context;
  private AMapNavi _aMapNaviInstace;

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
    maps.put("calculateDriveRouteWithStartPoints", this.CALCULATE_DRIVE_ROUTE);
    return maps;
  }

  public void receiveCommand(@NotNull AMapView overlay, int commandId, @Nullable ReadableArray args) {
    if (commandId == this.ANIMATE_TO) {
      overlay.animateTo(args);
    }

    if (commandId == this.CALCULATE_DRIVE_ROUTE) {
      this.calculateDriveRoute(args);
    }
  }

  private NaviLatLng getCenterPoint(List<NaviLatLng> geoCoordinateList)
  {
    int total = geoCoordinateList.size();
    double X = 0, Y = 0, Z = 0;
    for (NaviLatLng geo : geoCoordinateList) {
      double lat, lon, x, y, z;
      lat = geo.getLatitude() * Math.PI / 180;
      lon = geo.getLongitude() * Math.PI / 180;
      x = Math.cos(lat) * Math.cos(lon);
      y = Math.cos(lat) * Math.sin(lon);
      z = Math.sin(lat);
      X += x;
      Y += y;
      Z += z;
    }
    X = X / total;
    Y = Y / total;
    Z = Z / total;
    double Lon = Math.atan2(Y, X);
    double Hyp = Math.sqrt(X * X + Y * Y);
    double Lat = Math.atan2(Z, Hyp);
    return new NaviLatLng(Lat * 180 / Math.PI, Lon * 180 / Math.PI);
  }

  private void calculateDriveRoute(ReadableArray args) {

    if (_aMapNaviInstace != null) {
      _aMapNaviInstace.destroy();
      _aMapNaviInstace = null;
    }

    _aMapNaviInstace = AMapNavi.getInstance(_context);
    _aMapNaviInstace.addAMapNaviListener(this.aMapNaviListener);

    ReadableMap startPoint = args.getMap(0);
    ReadableMap endPoint = args.getMap(1);

    List startArgs = new ArrayList();
    startArgs.add(new NaviLatLng(startPoint.getDouble("latitude"), startPoint.getDouble("longitude")));

    List endArgs = new ArrayList();
    endArgs.add(new NaviLatLng(endPoint.getDouble("latitude"), endPoint.getDouble("longitude")));

    int strategy = 1;
    try {
      strategy = _aMapNaviInstace.strategyConvert(true, false, false, false, false);
    } catch (Exception e) {
      e.printStackTrace();
    }

    _aMapNaviInstace.calculateDriveRoute(startArgs, endArgs, null, strategy);
  }

  @Override
  public void addView(AMapView parent, View child, int index) {
    parent.add(child);
    super.addView(parent, child, index);
  }

  @Override
  public void removeViewAt(AMapView parent, int index) {
    try {
      parent.removeViewAt(index);
      super.removeViewAt(parent, index);
    } catch (Exception e) {
      Log.e("[发生错误]", e.toString());
    }
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
