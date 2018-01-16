#import <React/RCTBridgeModule.h>
#import <MAMapKit/MAGeometry.h>
#import <AMapFoundationKit/AMapFoundationKit.h>
#import <AMapSearchKit/AMapSearchKit.h>
#import <React/RCTComponent.h>

#pragma ide diagnostic ignored "OCUnusedClassInspection"

@interface AMapUtils : NSObject <RCTBridgeModule, AMapSearchDelegate>

@property(nonatomic, strong) AMapSearchAPI* search;

@property(nonatomic, copy) RCTBubblingEventBlock onSearchPOIResponse;

@end

@implementation AMapUtils

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(distance:(double)lat1
                      lng1:(double)lng1
                      lat2:(double)lat2
                      lng2:(double)lng2
                   resolve:(RCTPromiseResolveBlock)resolve
                    reject:(RCTPromiseRejectBlock)reject) {
    resolve(@(MAMetersBetweenMapPoints(
            MAMapPointForCoordinate(CLLocationCoordinate2DMake(lat1, lng1)),
            MAMapPointForCoordinate(CLLocationCoordinate2DMake(lat2, lng2))
    )));
}

RCT_EXPORT_METHOD(latitude: (double)lat
                  longitude: (double)lng) {
  if (!self.search) {
    self.search = [AMapSearchAPI new];
    self.search.delegate = self;
  }
  
  AMapPOIAroundSearchRequest *request = [AMapPOIAroundSearchRequest new];
  request.location = [AMapGeoPoint locationWithLatitude: lat longitude: lng];
  request.sortrule = 0;
  request.requireExtension = YES;
  [self.search AMapPOIAroundSearch:request];
}

- (void)onPOISearchDone:(AMapPOISearchBaseRequest *)request response:(AMapPOISearchResponse *)response {
  self.onSearchPOIResponse(@{ @"count": [NSNumber numberWithInteger: response.count], @"pois": response.pois });
}

@end
