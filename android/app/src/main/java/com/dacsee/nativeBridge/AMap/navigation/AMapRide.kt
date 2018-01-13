package com.dacsee.nativeBridge.AMap.navigation

import android.annotation.SuppressLint
import com.amap.api.navi.model.AMapModelCross
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.uimanager.ThemedReactContext

@SuppressLint("ViewConstructor")
class AMapRide(context: ThemedReactContext) : AMapNavigation(context) {
    override fun hideModeCross() {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    override fun showModeCross(p0: AMapModelCross?) {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    override fun calculateRoute(args: ReadableArray?) {
        navigation.calculateRideRoute(
                latLngFromReadableMap(args?.getMap(0)!!),
                latLngFromReadableMap(args.getMap(1))
        )
    }
}