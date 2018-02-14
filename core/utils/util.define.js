import DeviceInfo from 'react-native-device-info'

const TextInputArgs = {
  returnKeyType: 'next',
  autoCapitalize: 'none',
  selectTextOnFocus: false,
  autoCorrect: false,
  clearTextOnFocus: true,
  underlineColorAndroid: 'transparent'
}

const system = {
  ios: {
    std: (DeviceInfo.getModel().startsWith('iPhone') && !DeviceInfo.getModel().endsWith('Plus')),
    plus: (DeviceInfo.getModel().startsWith('iPhone') && DeviceInfo.getModel().endsWith('Plus')),
    x: DeviceInfo.getModel() === 'iPhone X',
    mini: DeviceInfo.getModel().startsWith('iPad Mini'),
    air: DeviceInfo.getModel().startsWith('iPad Air'),
    pro: DeviceInfo.getModel().startsWith('iPad Pro')
  },
  android: {

  }
}

export default {
  TextInputArgs,
  FixPlusPixel: system.ios.plus ? 1 : .6,
  system: system
}
