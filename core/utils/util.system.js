/* eslint-disable */
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
  }
}