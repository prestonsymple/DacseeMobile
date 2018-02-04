//
//  AMapSearch.m
//  dacsee
//
//  Created by quzhi on 03/02/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTLog.h>
#import <AMapSearchKit/AMapSearchKit.h>

@interface AMapSearch : NSObject <RCTBridgeModule, AMapSearchDelegate> {
  AMapSearchAPI *_search;
}

@property(assign, nonatomic) RCTPromiseResolveBlock resolve;
@property(assign, nonatomic) RCTPromiseRejectBlock reject;


@end


@implementation AMapSearch

-(instancetype)init {
  _search = [AMapSearchAPI new];
  _search.delegate = self;
  
  self = [super init];
  return self;
}

RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(searchLocation,
                 latitude: (double)lat
                 longitude: (double)lng
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
  AMapPOIAroundSearchRequest *request = [AMapPOIAroundSearchRequest new];
  request.location = [AMapGeoPoint locationWithLatitude: lat longitude: lng];
  request.sortrule = 0;
  request.requireExtension = YES;
  [_search AMapPOIAroundSearch: request];
  
  if (self.reject != nil) self.reject(@"-1", @"上一个未完成", nil);
  self.resolve = resolve;
  self.reject = reject;
}

RCT_REMAP_METHOD(searchKeywords,
                 keywords: (NSString *)keywords
                 city: (NSString *)city
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
  AMapPOIKeywordsSearchRequest *request = [[AMapPOIKeywordsSearchRequest alloc] init];
  request.keywords            = keywords;
  request.city                = city;
  request.requireExtension    = YES;
  request.cityLimit           = YES;
  request.requireSubPOIs      = YES;
  [_search AMapPOIKeywordsSearch: request];
  
  if (self.reject != nil) self.reject(@"-1", @"上一个未完成", nil);
  self.resolve = resolve;
  self.reject = reject;
}

- (void)onPOISearchDone:(AMapPOISearchBaseRequest *)request response:(AMapPOISearchResponse *)response {
  if (!self.resolve && !self.reject) return;
  
  NSMutableArray *pois = [[NSMutableArray alloc] init];
  [response.pois enumerateObjectsUsingBlock:^(AMapPOI * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
    [pois addObject: @{
                       @"uid": obj.uid,
                       @"name": obj.name,
                       @"location": @{ @"lng": @(obj.location.longitude), @"lat": @(obj.location.latitude) },
                       @"address": obj.address,
                       @"distance": @(obj.distance),
                       @"city": obj.city,
                       @"district": obj.district
                       }];
  }];
  
  if ([request isMemberOfClass: [AMapPOIAroundSearchRequest class]]) {
    self.resolve(@{ @"count": @(response.count), @"pois": pois, @"type": @"near" });
  } else if ([request isMemberOfClass: [AMapPOIKeywordsSearchRequest class]]) {
    self.resolve(@{ @"count": @(response.count), @"pois": pois, @"type": @"keywords" });
  }
  
  self.resolve = nil;
  self.reject = nil;
}

@end

