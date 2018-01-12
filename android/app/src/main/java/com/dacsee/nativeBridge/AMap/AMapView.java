package com.dacsee.nativeBridge.AMap;

import com.amap.api.maps.MapView;
import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

/**
 * Created by quzhi on 12/01/2018.
 */

public class AMapView extends SimpleViewManager<MapView> {

  public static final String REACT_CLASS = "AMap";

  @Override
  public String getName() {
    return REACT_CLASS;
  }

  @Override
  public MapView createViewInstance(ThemedReactContext context) {
    return new MapView(context);
  }

}
