package com.dacsee.nativeBridge.AMap.navigation

import com.facebook.react.uimanager.ThemedReactContext

class AMapRideManager : AMapNavigationManager<AMapRide>() {
    override fun getName(): String {
        return "AMapRide"
    }

    override fun createViewInstance(reactContext: ThemedReactContext): AMapRide {
        return AMapRide(reactContext)
    }
}