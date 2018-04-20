
import React from 'react'
import { NativeModules } from 'react-native'

export default class LocationService {
  
  constructor(option) {
    this._service = NativeModules.LocationService
  }

  async startTracking() {
    return new Promise(resolve => {
      this._service.startTracking(resolve)
    })
  }

  async stopTracking() {
    return new Promise(resolve => {
      this._service.stopTracking(resolve)
    })
  }

}