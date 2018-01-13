package com.dacsee.nativeBridge.AMap.navigation

import android.annotation.SuppressLint
import com.amap.api.navi.enums.PathPlanningStrategy
import com.amap.api.navi.model.AMapModelCross
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.uimanager.ThemedReactContext

@SuppressLint("ViewConstructor")
class AMapDrive(context: ThemedReactContext) : AMapNavigation(context) {
    override fun hideModeCross() {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    override fun showModeCross(p0: AMapModelCross?) {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    override fun calculateRoute(args: ReadableArray?) {
        val points = args?.getArray(2)!!
        navigation.calculateDriveRoute(
                listOf(latLngFromReadableMap(args.getMap(0))),
                listOf(latLngFromReadableMap(args.getMap(1))),
                (0 until points.size()).map { latLngFromReadableMap(points.getMap(it)) },
                PathPlanningStrategy.DRIVING_DEFAULT
        )
    }
}
