// @flow
import { NativeModules } from 'react-native'
const { AMapSearch } = NativeModules

export default {
  // 根据关键词获取附近的POI数据点
  searchKeywords: async (
    keywords: string,
    city: string
  ): Promise<> => {
    const ret = await AMapSearch.searchKeywords(keywords, city)
    return ret
  },

  // 根据坐标位置获取附近的POI数据点
  // Android 搜索附近300米
  // iOS 搜索附近1000米
  searchLocation: async (
    lng: number,
    lat: number
  ): Promise<> => {
    const { count, type, pois } = await AMapSearch.searchLocation(lng, lat)
    return { count, type, pois }
  }
}
