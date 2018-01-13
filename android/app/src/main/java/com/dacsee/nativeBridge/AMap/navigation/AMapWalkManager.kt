package com.dacsee.nativeBridge.AMap.navigation

import com.facebook.react.uimanager.ThemedReactContext

class AMapWalkManager : AMapNavigationManager<AMapWalk>() {
    override fun getName(): String {
        return "AMapWalk"
    }

    override fun createViewInstance(reactContext: ThemedReactContext): AMapWalk {
        return AMapWalk(reactContext)
    }
}