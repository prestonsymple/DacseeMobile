#import <React/RCTUIManager.h>
#import <AMapSearchKit/AMapSearchKit.h>
#import <AMapNaviKit/AMapNaviKit.h>
#import "AMapView.h"
#import "AMapMarker.h"
#import "AMapOverlay.h"


#pragma ide diagnostic ignored "OCUnusedClassInspection"
#pragma ide diagnostic ignored "-Woverriding-method-mismatch"

@interface AMapViewManager : RCTViewManager <MAMapViewDelegate, AMapSearchDelegate, AMapNaviDriveManagerDelegate>

@property(copy, nonatomic) RCTPromiseResolveBlock resolve;
@property(copy, nonatomic) RCTPromiseRejectBlock reject;

@end

@implementation AMapViewManager {
  AMapSearchAPI *_search;
  AMapView *_mapView;
}

RCT_EXPORT_MODULE()

- (UIView *)view {
  [AMapNaviDriveManager sharedInstance].delegate = self;
  
  _mapView = [AMapView new];
  _mapView.centerCoordinate = CLLocationCoordinate2DMake(0, 0);
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

RCT_EXPORT_METHOD(calculateDriveRouteWithStartPoints:(nonnull NSNumber *)reactTag startPoint: (AMapNaviPoint *)startPoint endPoint: (AMapNaviPoint *)endPoint) {
  [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
    [[AMapNaviDriveManager sharedInstance] calculateDriveRouteWithStartPoints: @[startPoint]
                                                                    endPoints: @[endPoint]
                                                                    wayPoints: nil
                                                              drivingStrategy: 1];
  }];
}

// 绘制折线的回调
//- (MAOverlayRenderer *)mapView:(MAMapView *)mapView rendererForOverlay:(id<MAOverlay>)overlay
//{
//  if ([overlay isKindOfClass:[SelectableOverlay class]])
//  {
//    SelectableOverlay * selectableOverlay = (SelectableOverlay *)overlay;
//    id<MAOverlay> actualOverlay = selectableOverlay.overlay;
//
//    MAPolylineRenderer *polylineRenderer = [[MAPolylineRenderer alloc] initWithPolyline:actualOverlay];
//
//    polylineRenderer.lineWidth = 8.f;
//    polylineRenderer.strokeColor = selectableOverlay.selectedColor;
//
//    return polylineRenderer;
//  }
//
//  return nil;
//}

-(void)driveManagerOnCalculateRouteSuccess:(AMapNaviDriveManager *)driveManager {
  if ([[AMapNaviDriveManager sharedInstance].naviRoutes count] <= 0) {
    return [self.bridge.eventDispatcher sendAppEventWithName:@"EVENT_AMAP_VIEW_ROUTE_SUCCESS" body: @[]];
  }
  
  NSMutableArray *args = [NSMutableArray new];
  for (NSNumber *aRouteID in [[AMapNaviDriveManager sharedInstance].naviRoutes allKeys])
  {
    AMapNaviRoute *aRoute = [[[AMapNaviDriveManager sharedInstance] naviRoutes] objectForKey:aRouteID];
    
    NSMutableArray *naviPoint = [NSMutableArray new];
    [[aRoute routeCoordinates] enumerateObjectsUsingBlock:^(AMapNaviPoint * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
      [naviPoint addObject: @{ @"lat": @(obj.latitude), @"lng": @(obj.longitude) }];
    }];
    
    [args addObject: @{
                       @"routeTime": @(aRoute.routeTime),
                       @"routeCenterPoint": @{
                           @"longitude": @(aRoute.routeCenterPoint.longitude),
                           @"latitude": @(aRoute.routeCenterPoint.latitude)
                       },
                       @"routeBounds": @{
                           @"northEast": @{
                               @"longitude": @(aRoute.routeBounds.northEast.longitude),
                               @"latitude": @(aRoute.routeBounds.northEast.latitude)
                           },
                           @"southWest": @{
                               @"longitude": @(aRoute.routeBounds.southWest.longitude),
                               @"latitude": @(aRoute.routeBounds.southWest.latitude)
                           },
                       },
                       @"routeLength": @(aRoute.routeLength),
                       @"routeTollCost": @(aRoute.routeTollCost),
                       @"routeNaviPoint": naviPoint
                       }];
  }
  
  
  [self.bridge.eventDispatcher sendAppEventWithName:@"EVENT_AMAP_VIEW_ROUTE_SUCCESS" body: args];
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

- (MAOverlayRenderer *)mapView:(MAMapView *)mapView rendererForOverlay:(id <MAOverlay>)overlay {
  if ([overlay isKindOfClass:[AMapOverlay class]]) {
    return ((AMapOverlay *) overlay).renderer;
  }
  return nil;
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

    if (mapView.initialRegion.center.latitude != 0) {
        mapView.region = mapView.initialRegion;
    }
}

@end
