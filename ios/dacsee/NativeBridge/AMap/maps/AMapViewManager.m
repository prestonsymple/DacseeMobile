#import <React/RCTUIManager.h>
#import <AMapSearchKit/AMapSearchKit.h>
#import "AMapView.h"
#import "AMapMarker.h"
#import "AMapOverlay.h"

#pragma ide diagnostic ignored "OCUnusedClassInspection"
#pragma ide diagnostic ignored "-Woverriding-method-mismatch"

@interface AMapViewManager : RCTViewManager <MAMapViewDelegate, AMapSearchDelegate>
@end

@implementation AMapViewManager {
  AMapSearchAPI *_search;
  AMapView *_mapView;
}

RCT_EXPORT_MODULE()

- (UIView *)view {
    _search = [AMapSearchAPI new];
    _search.delegate = self;
  
    _mapView = [AMapView new];
    _mapView.centerCoordinate = CLLocationCoordinate2DMake(39.9242, 116.3979);
    _mapView.zoomLevel = 10;
    _mapView.delegate = self;
    return _mapView;
}

RCT_EXPORT_VIEW_PROPERTY(locationEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(showsCompass, BOOL)
RCT_EXPORT_VIEW_PROPERTY(showsScale, BOOL)
RCT_EXPORT_VIEW_PROPERTY(showsIndoorMap, BOOL)
RCT_EXPORT_VIEW_PROPERTY(showsLabels, BOOL)
RCT_EXPORT_VIEW_PROPERTY(showsTraffic, BOOL)
RCT_EXPORT_VIEW_PROPERTY(showsBuildings, BOOL)
RCT_EXPORT_VIEW_PROPERTY(zoomLevel, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(maxZoomLevel, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(minZoomLevel, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(zoomEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(scrollEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(rotateEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(tiltEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(mapType, MAMapType)
RCT_EXPORT_VIEW_PROPERTY(coordinate, CLLocationCoordinate2D)
RCT_EXPORT_VIEW_PROPERTY(limitRegion, MACoordinateRegion)
RCT_EXPORT_VIEW_PROPERTY(region, MACoordinateRegion)
RCT_EXPORT_VIEW_PROPERTY(tilt, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(rotation, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(distanceFilter, CLLocationDistance)
RCT_EXPORT_VIEW_PROPERTY(locationStyle, LocationStyle)

RCT_EXPORT_VIEW_PROPERTY(onPress, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onLongPress, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onLocation, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onStatusChange, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onStatusChangeComplete, RCTBubblingEventBlock)

// ADD
RCT_EXPORT_VIEW_PROPERTY(onPOISearchResponse, RCTBubblingEventBlock)

RCT_EXPORT_METHOD(searchWithLocation: (double)lat
                  longitude: (double)lng) {
  AMapPOIAroundSearchRequest *request = [AMapPOIAroundSearchRequest new];
  request.location = [AMapGeoPoint locationWithLatitude: lat longitude: lng];
  request.sortrule = 0;
  request.requireExtension = YES;
  [_search AMapPOIAroundSearch: request];
}

RCT_EXPORT_METHOD(searchWithKeywords: (NSString *)keywords andCity: (NSString *)city) {
  AMapPOIKeywordsSearchRequest *request = [[AMapPOIKeywordsSearchRequest alloc] init];
  request.keywords            = keywords;
  request.city                = city;
  request.requireExtension    = YES;
  request.cityLimit           = YES;
  request.requireSubPOIs      = YES;
  [_search AMapPOIKeywordsSearch: request];
}

RCT_EXPORT_METHOD(animateTo:(nonnull NSNumber *)reactTag params:(NSDictionary *)params duration:(NSInteger)duration) {
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        AMapView *mapView = (AMapView *) viewRegistry[reactTag];
        MAMapStatus *mapStatus = mapView.getMapStatus;
        if (params[@"zoomLevel"]) {
            mapStatus.zoomLevel = [params[@"zoomLevel"] floatValue];
        }
        if (params[@"coordinate"]) {
            NSDictionary *coordinate = params[@"coordinate"];
            mapStatus.centerCoordinate = CLLocationCoordinate2DMake(
                    [coordinate[@"latitude"] doubleValue],
                    [coordinate[@"longitude"] doubleValue]);
        }
        if (params[@"tilt"]) {
            mapStatus.cameraDegree = [params[@"tilt"] floatValue];
        }
        if (params[@"rotation"]) {
            mapStatus.rotationDegree = [params[@"rotation"] floatValue];
        }
        [mapView setMapStatus:mapStatus animated:YES duration:duration / 1000.0];
    }];
}

- (void)mapView:(AMapView *)mapView didSingleTappedAtCoordinate:(CLLocationCoordinate2D)coordinate {
    if (mapView.onPress) {
        mapView.onPress(@{
                @"latitude": @(coordinate.latitude),
                @"longitude": @(coordinate.longitude),
        });
    }
}

- (void)mapView:(AMapView *)mapView didLongPressedAtCoordinate:(CLLocationCoordinate2D)coordinate {
    if (mapView.onLongPress) {
        mapView.onLongPress(@{
                @"latitude": @(coordinate.latitude),
                @"longitude": @(coordinate.longitude),
        });
    }
}

- (void)onPOISearchDone:(AMapPOISearchBaseRequest *)request response:(AMapPOISearchResponse *)response {
  if (_mapView.onPOISearchResponse) {
    
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
      _mapView.onPOISearchResponse(@{ @"count": @(response.count), @"pois": pois, @"type": @"near" });
    } else if ([request isMemberOfClass: [AMapPOIKeywordsSearchRequest class]]) {
      _mapView.onPOISearchResponse(@{ @"count": @(response.count), @"pois": pois, @"type": @"keywords" });
    }
    
  }
}

- (void)mapView:(AMapView *)mapView didUpdateUserLocation:(MAUserLocation *)userLocation updatingLocation:(BOOL)updatingLocation {
    if (mapView.onLocation) {
        mapView.onLocation(@{
                @"latitude": @(userLocation.coordinate.latitude),
                @"longitude": @(userLocation.coordinate.longitude),
                @"accuracy": @((userLocation.location.horizontalAccuracy + userLocation.location.verticalAccuracy) / 2),
                @"altitude": @(userLocation.location.altitude),
                @"speed": @(userLocation.location.speed),
                @"timestamp": @(userLocation.location.timestamp.timeIntervalSince1970),
        });
    }
}

- (MAAnnotationView *)mapView:(AMapView *)mapView viewForAnnotation:(id <MAAnnotation>)annotation {
    if ([annotation isKindOfClass:[MAPointAnnotation class]]) {
        AMapMarker *marker = [mapView getMarker:annotation];
        return marker.annotationView;
    }
    return nil;
}

- (MAOverlayRenderer *)mapView:(MAMapView *)mapView rendererForOverlay:(id <MAOverlay>)overlay {
    if ([overlay isKindOfClass:[AMapOverlay class]]) {
        return ((AMapOverlay *) overlay).renderer;
    }
    return nil;
}

- (void)mapView:(AMapView *)mapView didSelectAnnotationView:(MAAnnotationView *)view {
    AMapMarker *marker = [mapView getMarker:view.annotation];
    if (marker.onPress) {
        marker.onPress(nil);
    }
}

- (void)mapView:(AMapView *)mapView didAnnotationViewCalloutTapped:(MAAnnotationView *)view {
    AMapMarker *marker = [mapView getMarker:view.annotation];
    if (marker.onInfoWindowPress) {
        marker.onInfoWindowPress(nil);
    }
}

- (void)mapView:(AMapView *)mapView annotationView:(MAAnnotationView *)view didChangeDragState:(MAAnnotationViewDragState)newState
   fromOldState:(MAAnnotationViewDragState)oldState {
    AMapMarker *marker = [mapView getMarker:view.annotation];
    if (newState == MAAnnotationViewDragStateStarting && marker.onDragStart) {
        marker.onDragStart(nil);
    }
    if (newState == MAAnnotationViewDragStateDragging) {
        if (marker.onDrag) {
            marker.onDrag(nil);
        }
    }
    if (newState == MAAnnotationViewDragStateEnding && marker.onDragEnd) {
        marker.onDragEnd(@{
                @"latitude": @(marker.annotation.coordinate.latitude),
                @"longitude": @(marker.annotation.coordinate.longitude),
        });
    }
}

- (void)mapViewRegionChanged:(AMapView *)mapView {
    if (mapView.onStatusChange) {
        MAMapStatus *status = mapView.getMapStatus;
        mapView.onStatusChange(@{
                @"zoomLevel": @(status.zoomLevel),
                @"tilt": @(status.cameraDegree),
                @"rotation": @(status.rotationDegree),
                @"latitude": @(status.centerCoordinate.latitude),
                @"longitude": @(status.centerCoordinate.longitude),
        });
    }
}

- (void)mapView:(AMapView *)mapView regionDidChangeAnimated:(BOOL)animated {
    if (mapView.onStatusChangeComplete) {
        MAMapStatus *status = mapView.getMapStatus;
        mapView.onStatusChangeComplete(@{
                @"zoomLevel": @(status.zoomLevel),
                @"tilt": @(status.cameraDegree),
                @"rotation": @(status.rotationDegree),
                @"latitude": @(status.centerCoordinate.latitude),
                @"longitude": @(status.centerCoordinate.longitude),
                @"latitudeDelta": @(mapView.region.span.latitudeDelta),
                @"longitudeDelta": @(mapView.region.span.longitudeDelta),
        });
    }
}

- (void)mapInitComplete:(AMapView *)mapView {
    mapView.loaded = YES;

    // struct 里的值会被初始化为 0，这里以此作为条件，判断 initialRegion 是否被设置过
    // 但实际上经度为 0 是一个合法的坐标，只是考虑到高德地图只在中国使用，就这样吧
    if (mapView.initialRegion.center.latitude != 0) {
        mapView.region = mapView.initialRegion;
    }
}

@end
