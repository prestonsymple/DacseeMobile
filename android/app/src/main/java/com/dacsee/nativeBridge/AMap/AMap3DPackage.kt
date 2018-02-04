package com.dacsee.nativeBridge.AMap

import cn.qiuxiang.react.amap3d.AMapOfflineModule
import cn.qiuxiang.react.amap3d.AMapUtilsModule
import com.dacsee.nativeBridge.AMap.maps.*
import com.dacsee.nativeBridge.AMap.navigation.AMapDriveManager
import com.dacsee.nativeBridge.AMap.navigation.AMapRideManager
import com.dacsee.nativeBridge.AMap.navigation.AMapWalkManager
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class AMap3DPackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        return listOf(
                AMapUtilsModule(reactContext),
                AMapOfflineModule(reactContext),
                AMapSearchModule(reactContext)
        )
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return listOf(
                AMapViewManager(),
                AMapMarkerManager(),
                AMapInfoWindowManager(),
                AMapPolylineManager(),
                AMapPolygonManager(),
                AMapCircleManager(),
                AMapHeatMapManager(),
                AMapMultiPointManager(),
                AMapDriveManager(),
                AMapWalkManager(),
                AMapRideManager()
        )
    }
}
