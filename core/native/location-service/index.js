
import React from 'react'
import { NativeModules } from 'react-native'

export default class LocationService {

  static startTracking(authorization, vehicleId) {
    return new Promise(resolve => {
      NativeModules.LocationService.startTracking(authorization, vehicleId, resolve)
    })
  }

  static stopTracking() {
    return new Promise(resolve => {
      NativeModules.LocationService.stopTracking(resolve)
    })
  }

}