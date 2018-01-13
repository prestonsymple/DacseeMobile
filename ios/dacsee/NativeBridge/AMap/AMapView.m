////
////  AMapMethod.m
////  dacsee
////
////  Created by Vito on 2018/1/10.
////  Copyright © 2018年 Facebook. All rights reserved.
////
//
//#import <React/RCTBridgeModule.h>
//#import <React/RCTEventDispatcher.h>
//#import <React/RCTEventEmitter.h>
//#import <React/RCTConvert.h>
//#import <React/RCTViewManager.h>
//
//#import <MAMapKit/MAMapKit.h>
//#import <AMapFoundationKit/AMapFoundationKit.h> // 高德地图SDK
//
//
//@interface AMapOverride : MAMapView
//
//@property (nonatomic) CGFloat currentZoomLevel;
//
//@end
//
//@implementation AMapOverride
//
//-(void)setCurrentZoomLevel:(CGFloat)currentZoomLevel {
//  [self setZoomLevel:currentZoomLevel animated:true];
//}
//
//@end
//
//
//@interface AMapView : RCTViewManager
//@end
//
//@implementation AMapView
//
//@synthesize bridge;
//
//RCT_EXPORT_MODULE(AMap) // 导出模块
//
//AMapOverride *mapView;
//
//
//- (UIView *)view {
//  mapView = [AMapOverride new];
//  mapView.allowsBackgroundLocationUpdates = true;
//  mapView.showsUserLocation = true;
//  mapView.userTrackingMode = MAUserTrackingModeFollow;
//  return mapView;
//}
//
////RCT_EXPORT_METHOD(changeBackgroundLocationUpdateStatus:(BOOL)allow) {
////  mapView.showsUserLocation = false;
////  mapView.allowsBackgroundLocationUpdates = allow;
////  mapView.showsUserLocation = true;
////}
//
//// 交通数据
//RCT_EXPORT_VIEW_PROPERTY(showTraffic, BOOL);
//// 用户位置
//RCT_EXPORT_VIEW_PROPERTY(showsUserLocation, BOOL);
//// 指南针
//RCT_EXPORT_VIEW_PROPERTY(showsCompass, BOOL);
//// 比例尺
//RCT_EXPORT_VIEW_PROPERTY(showsScale, BOOL);
////
//RCT_EXPORT_VIEW_PROPERTY(logoCenter, CGPoint);
//// 缩放控制
//RCT_EXPORT_VIEW_PROPERTY(zoomEnabled, BOOL);
//// 滑动控制
//RCT_EXPORT_VIEW_PROPERTY(scrollEnabled, BOOL);
//// 旋转控制
//RCT_EXPORT_VIEW_PROPERTY(rotateEnabled, BOOL);
//// 镜头旋转控制
//RCT_EXPORT_VIEW_PROPERTY(rotateCameraEnabled, BOOL);
//// 地图缩放级别
//RCT_EXPORT_VIEW_PROPERTY(zoomLevel, CGFloat);
//RCT_EXPORT_VIEW_PROPERTY(currentZoomLevel, CGFloat); // Animate is true
//
//-(dispatch_queue_t)methodQueue {
//  return dispatch_get_main_queue();
//}
//
//@end
//
//
//@interface RCTConvert (AMapView)
//
//@end
//
//
//@implementation RCTConvert(AMapView)
//
//@end

