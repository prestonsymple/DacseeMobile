package com.dacsee.nativeBridge.AMap.maps

import com.facebook.react.uimanager.LayoutShadowNode
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager

class AMapInfoWindowManager : ViewGroupManager<AMapInfoWindow>() {
    override fun getName(): String {
        return "AMapInfoWindow"
    }

    override fun createViewInstance(reactContext: ThemedReactContext): AMapInfoWindow {
        return AMapInfoWindow(reactContext)
    }

    override fun createShadowNodeInstance(): LayoutShadowNode {
        return super.createShadowNodeInstance()
    }
}