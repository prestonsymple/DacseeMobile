#import <MAMapKit/MAMapKit.h>
#import <AMapSearchKit/AMapSearchKit.h>

@class AMapMarker;

@interface AMapView : MAMapView

@property(nonatomic, copy) RCTBubblingEventBlock onLocation;
@property(nonatomic, copy) RCTBubblingEventBlock onPress;
@property(nonatomic, copy) RCTBubblingEventBlock onLongPress;
@property(nonatomic, copy) RCTBubblingEventBlock onStatusChange;
@property(nonatomic, copy) RCTBubblingEventBlock onStatusChangeComplete;

@property(nonatomic, copy) RCTBubblingEventBlock onPOISearchResponse;

@property(nonatomic) BOOL loaded;
@property(nonatomic) MACoordinateRegion initialRegion;

- (AMapMarker *)getMarker:(id <MAAnnotation>)annotation;

@end
