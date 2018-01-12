import { Dimensions } from 'react-native'
const { width, height } = Dimensions.get('window')

export default {
  /***
  ****  define screen params
  ***/
  Window: {
    Width: width,
    Height: height
  }
}
