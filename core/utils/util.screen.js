import { Dimensions } from 'react-native'
import Define from './util.define'

const { width, height } = Dimensions.get('window')

export default {
  /***
  ****  define screen params
  ***/
  window: {
    width,
    height
  },
  // Fix iPhone X
  safaContent: {
    width: width,
    height: Define.system.ios.x ? height - 88 : height - 64
  },
}
