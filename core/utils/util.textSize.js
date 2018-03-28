import { Dimensions, PixelRatio } from 'react-native'

const { width, height } = Dimensions.get('window')
const dpr = PixelRatio.get()
export default {
  TextSize: (size) => {

    if (dpr === 2) {
      // iphone 5s和老安卓机
      if (width < 360) {
        return size * 0.95
      }
      if(size>=18){
        return size
      }
      // iphone 5
      if (height < 667) {
        return size
      // iphone 6-6s
      } else if (height >= 667 && height <= 735) {
        return size * 1.10
      }
      // older phablets
      return size * 1.20
    }
    if(size>=18){
      return size
    }
    if (dpr === 3) {
      // catch Android font scaling on small machines
      // where pixel dpr / font scale dpr => 3:3
      if (width <= 360) {
        return size
      }
      // Catch other weird android width sizings
      if (height < 667) {
        return size * 1.10
      // catch in-between size Androids and scale font up
      // a tad but not too much
      }
      if (height >= 667 && height <= 735) {
        return size * 1.15
      }
      // catch larger devices
      // ie iphone 6s plus / 7 plus / mi note 等等
      return size * 1.20
    }
    if (dpr === 3.5) {
      // catch Android font scaling on small machines
      // where pixel dpr / font scale dpr => 3:3
      if (width <= 360) {
        return size
      // Catch other smaller android height sizings
      }
      if (height < 667) {
        return size * 1.15
      // catch in-between size Androids and scale font up
      // a tad but not too much
      }
      if (height >= 667 && height <= 735) {
        return size * 1.20
      }
      // catch larger phablet devices
      return size * 1.25
    }
    // if older device ie pixeldpr !== 2 || 3 || 3.5
    return size
  }
}
