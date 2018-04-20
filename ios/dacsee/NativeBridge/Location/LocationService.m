//
//  LocationService.m
//  dacsee
//
//  Created by quzhi on 2018/4/17.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreLocation/CoreLocation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventDispatcher.h>
#import <React/RCTEventEmitter.h>
#import <AFNetworking/AFNetworking.h>

#define NATIVE_EVENT_NAME_IDENT_LOCATION_CHANGE @"@@@NATIVE_EVENT_NAME_IDENT_LOCATION_CHANGE"

@interface LocationService : NSObject <RCTBridgeModule, CLLocationManagerDelegate> {}

@property (nonatomic, strong) CLLocationManager *locationManager;
@property (nonatomic, strong) CLLocation *locationStorage;

@end


@implementation LocationService

@synthesize bridge;

RCT_EXPORT_MODULE();

- (instancetype)init {
  self = [super init];
  if (self) {
    self.locationManager = [CLLocationManager new];
    self.locationManager.desiredAccuracy = kCLLocationAccuracyNearestTenMeters;
    self.locationManager.distanceFilter = 50.f;
    self.locationManager.delegate = self;
    [self.locationManager setPausesLocationUpdatesAutomatically: YES];
    
    if([self.locationManager respondsToSelector: @selector(allowsBackgroundLocationUpdates)]) {
      [self.locationManager setAllowsBackgroundLocationUpdates: YES];
    }
    
  }
  return self;
}

// 更新新的位置
- (void)locationManager:(CLLocationManager *)manager didUpdateLocations:(NSArray<CLLocation *> *)locations {
  if ([locations count] > 0) {
    [bridge.eventDispatcher sendAppEventWithName: NATIVE_EVENT_NAME_IDENT_LOCATION_CHANGE body: @[locations.lastObject]];
    
    // UPLOAD
//    NSURLSessionConfiguration *configuration = [NSURLSessionConfiguration defaultSessionConfiguration];
//    AFURLSessionManager *manager = [[AFURLSessionManager alloc] initWithSessionConfiguration:configuration];
//    
//    NSString *URL = @"https://location-dev.dacsee.io/api/v1";
//    NSURLRequest *request = [[AFJSONRequestSerializer serializer] requestWithMethod: @"POST" URLString: URL parameters: @[] error:nil];
//    NSURLSessionDataTask *dataTask = [manager dataTaskWithRequest:request completionHandler:^(NSURLResponse *response, id responseObject, NSError *error) {
//      // DO NOTHING;
//    }];
//    [dataTask resume];
  }
}

RCT_EXPORT_METHOD(startTracking: (RCTResponseSenderBlock)completion) {
  [self.locationManager startUpdatingLocation];
  if (completion) {
    completion(@[]);
  }
}

RCT_EXPORT_METHOD(stopTracking: (RCTResponseSenderBlock)completion) {
  [self.locationManager stopUpdatingLocation];
  if (completion) {
    completion(@[]);
  }
}

RCT_EXPORT_METHOD(setLocationManagerFilter: (CLLocationDistance)distanceFilter completion: (RCTResponseSenderBlock)completion) {
  self.locationManager.distanceFilter = distanceFilter;
  if (completion) {
    completion(@[]);
  }
}

@end
