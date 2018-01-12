import { requireNativeComponent, NativeModules } from 'react-native';

export const AMapView = requireNativeComponent('AMap', null);
export const AMapMethod = NativeModules.AMapMethod;