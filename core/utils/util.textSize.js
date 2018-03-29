import { Dimensions, PixelRatio } from 'react-native'

const { width, height } = Dimensions.get('window')
const dpr = PixelRatio.get()
/*
 *设计稿为6s时
 */
export default {
  TextSize: (size) => {
    if (dpr === 2) {
      // iphone 5s和老安卓机  y
      if (width < 360) {
        return size * 0.8;
      }
      // iphone 5
      if (height < 667) {
        return size * 0.833;
        // iphone 6-6s
      } else if (height >= 667 && height <= 735) {
        return size;
      }
      // older phablets
      return size * 1.04;
    }
    if (dpr === 3) {
      // catch Android font scaling on small machines
      // where pixel ratio / font scale ratio => 3:3
      if (width <= 360) {
        return size * 0.8;
      }
      // Catch other weird android width sizings
      if (height < 667) {
        return size * 0.95;
        // catch in-between size Androids and scale font up
        // a tad but not too much
      }
      if (height >= 667 && height <= 735) {
        return size;
      }
      // catch larger devices
      // ie iphone 6s plus / 7 plus / mi note 等等
      return size * 1.06;
    }
    if (dpr === 3.5) {
      // catch Android font scaling on small machines
      // where pixel ratio / font scale ratio => 3:3
      if (width <= 360) {
        return size* 0.833;
        // Catch other smaller android height sizings
      }
      if (height < 667) {
        return size;
        // catch in-between size Androids and scale font up
        // a tad but not too much
      }
      if (height >= 667 && height <= 735) {
        return size * 1.04;
      }
      // catch larger phablet devices
      return size * 1.166;
    }
    // if older device ie pixelRatio !== 2 || 3 || 3.5
    return size;
  }
}
