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
//@interface AMapSearch :
//
//
//#define EVENT_NAME_IDENT_LOCATION_AUTHORIZATION_STATUS @"NATIVE_EVENT_LOCATION_AUTHORIZATION_STATUS"
//
//
//@interface AMapMethod : NSObject<RCTBridgeModule, CLLocationManagerDelegate>
//
//@property (strong, nonatomic) CLLocationManager *locationManager;
//
//@end
//
//@implementation AMapMethod
//
//@synthesize bridge;
//
//RCT_EXPORT_MODULE(AMapMethod) // 导出模块
//
//RCT_EXPORT_METHOD(initialization: (NSString *)sdk_key) {
//  [AMapServices sharedServices].apiKey = sdk_key;
//}
//
//-(dispatch_queue_t) methodQueue {
//  return dispatch_get_main_queue();
//}
//
////RCT_EXPORT_METHOD(requestLocationAuthorization) {
////  if ([[UIDevice currentDevice].systemVersion floatValue] > 8) {
////    kDISPATCH_MAIN_THREAD(^{
////      self.locationManager = [[CLLocationManager alloc] init];
////      self.locationManager.delegate = self;
////      [self.locationManager requestAlwaysAuthorization];
////    })
////  }
////}
////
////-(void) locationManager:(CLLocationManager *)manager didChangeAuthorizationStatus:(CLAuthorizationStatus)status {
////  [bridge.eventDispatcher sendAppEventWithName:EVENT_NAME_IDENT_LOCATION_AUTHORIZATION_STATUS body: nil];
////}
//
//@end
//
//
