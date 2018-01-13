package com.dacsee.nativeBridge.AMap.maps

import com.amap.api.maps.AMap

interface AMapOverlay {
    fun add(map: AMap)
    fun remove()
}