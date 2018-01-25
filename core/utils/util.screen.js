import { Dimensions } from 'react-native'
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
    width: 0,
    height: 0
  },
}
