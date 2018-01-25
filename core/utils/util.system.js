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
  Platform: {
    Name: Platform.OS,
    Android: Platform.OS === 'android',
    iOS: Platform.OS === 'ios'
  },
  Device: {
    Name: DeviceInfo.getModel()
  }
}