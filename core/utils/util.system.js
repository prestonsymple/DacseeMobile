/* eslint-disable */
/* global navigator */
import React from 'react'
import { Alert } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import Platform from 'Platform'
// const { android, ios } = { isAndroid: Platform.OS === 'android', isIOS: Platform.OS === 'ios' }
/* eslint-enable */


export default {
  Version: DeviceInfo.getVersion(),
  Build: DeviceInfo.getBuildNumber(),
  UUID: DeviceInfo.getUniqueID(),
  Platform: {
    Name: Platform.OS,
    Android: Platform.OS === 'android',
    iOS: Platform.OS === 'ios'
  },
  Device: {
    Brand: DeviceInfo.getBrand(),
    Version: DeviceInfo.getSystemVersion(),
    Name: DeviceInfo.getModel()
  },
  Location: {
    Current: async () => {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((position) => {
          resolve(position.coords)
        }, () => reject(), {
          timeout: 5000,
          enableHighAccuracy: true
        })
      })
    }
  },
  Rules: {
    isMail: (val) => {
      const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
      return reg.test(val)
    },
    isNumber: (val) => {
      const reg = /^[0-9]*$/
      return reg.test(val)
    }
  }
}