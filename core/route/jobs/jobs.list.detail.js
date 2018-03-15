import React, { Component, PureComponent } from 'react'
import { 
  Text, View, Animated, StyleSheet, Platform, StatusBar, Image, TouchableOpacity, TouchableHighlight, 
  DeviceEventEmitter, TextInput, Easing, ListView, ScrollView
} from 'react-native'
import DatePicker from 'react-native-datepicker'
import InteractionManager from 'InteractionManager'
import { NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter'
import moment from 'moment'

import { MapView, Marker, Utils } from '../../native/AMap'
import { Screen, Icons, Redux, Define, System, Session } from '../../utils'
import { Button } from '../../components'
import Resources from '../../resources'
import { application, booking } from '../../redux/actions'
import WalletTransactionListScreen from '../wallet/wallet.transaction.list'
import IncomeList from '../income/income.list'

const { height, width } = Screen.window

const MAP_DEFINE = {
  showsCompass: false,
  showsScale: false,
  tiltEnabled: false,
  rotateEnabled: false,
  showsTraffic: false,
  showsZoomControls: false, /* android fix */
}

// const styles = StyleSheet.create({
//   pageWrap: { width: width, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white' },
//   itemWrap: { alignItems: 'center', justifyContent: 'center' },
//   itemTitle: { color: '#666', fontSize: 14, fontWeight: '100', marginBottom: 8 },
//   itemImageContent: { marginHorizontal: 6, width: 68, height: 68, borderRadius: 33, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderWidth: 3 },
//   itemImage: { opacity: 0.7, width: 66, height: 66, borderRadius: 33, borderWidth: 1.5, borderColor: 'white', resizeMode: 'cover' }
// })

export default class JobsListDetailScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      drawerLockMode: 'locked-closed', 
      title: '行程详情'
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      route: {
        routeBounds: { 
          northEast: { longitude: 0, latitude: 0 }, 
          southWest: { longitude: 0, latitude: 0 } 
        },
        routeCenterPoint: { longitude: 0, latitude: 0 },
        routeLength: 0,
        routeNaviPoint: [],
        routeTime: 0,
        routeTollCost: 0
      },
      jobDetail: this.props.navigation.state.params.jobDetail,
    }
    console.log(this.state.jobDetail)
  }

  // async componentDidMount() {
  //   const { from, destination } = this.props.data
  //   await InteractionManager.runAfterInteractions()
  //   this.subscription = DeviceEventEmitter.addListener('NAVIGATION.EVENT.ON.PRESS.BACK.BOOKING', () => {
  //     this.props.navigation.goBack()
  //     this.props.dispatch(booking.journeyUpdateData({ to: { location: { lat: 0, lng: 0 } } }))
  //   })
  //   this.eventListener = RCTDeviceEventEmitter.addListener('EVENT_AMAP_VIEW_ROUTE_SUCCESS', async (args) => {
  //       // 初始化
  //   const route = Array.isArray(args) ? args[0] : args
  //   const distance = await Utils.distance(from.location.lat, from.location.lng, destination.location.lat, destination.location.lng)
  //   const km = distance / 1000

  //   let zoom = 16
  //   if (km >= 160) { zoom = 8 }
  //   else if (km >= 80) { zoom = 9 }
  //   else if (km >= 40) { zoom = 10 }
  //   else if (km >= 20) { zoom = 11 } 
  //   else if (km >= 10) { zoom = 12 }
  //   else if (km >= 5) { zoom = 13 }
  //   else if (km >= 2.5) { zoom = 14 }
  //   else { zoom = 15 }

  //   zoom -= 1

  //   const { routeCenterPoint, routeLength } = route

  //   if (System.Platform.Android) { // TODO: Android 中心点存在偏移
  //     this.map.animateTo({ zoomLevel: zoom, coordinate: { latitude: routeCenterPoint.latitude, longitude: routeCenterPoint.longitude } }, 500) 
  //   } else {
  //     this.map.animateTo({ zoomLevel: zoom, coordinate: { latitude: routeCenterPoint.latitude, longitude: routeCenterPoint.longitude } }, 500)
  //   }
  //     this.setState({ route })

  //     Animated.loop(Animated.timing(this.indicator, { toValue: 1, duration: 800, useNativeDriver: true })).start()
  //     this.selectCarType(this.props.data.type, routeLength, this.props.data)
  //   })

  //   this.map.calculateDriveRouteWithStartPoints({
  //     latitude: from.location.lat,
  //     longitude: from.location.lng
  //   }, {
  //     latitude: destination.location.lat,
  //     longitude: destination.location.lng
  //   })
  // }

  // componentWillUnmount() {
  //   this.eventListener && this.eventListener.remove()
  //   // this.subscription && this.subscription.remove()
  // }

  render() {
    // const { destination = { coords: { lat: 0, lng: 0 } }, from = { coords: { lat: 0, lng: 0 } }} = this.state.jobDetail
    const { destination, from, payment_method, fare, booking_at, status } = this.state.jobDetail
    return (      
      <View style={{ flex: 1 }}>
        <MapView
          {...MAP_DEFINE}
          style={{ flex: 1 }}
          mapType={'standard'}
          coordinate={{ latitude: from.coords.lat, longitude: from.coords.lng }}
          zoomLevel={ 10 }
          // region={{ latitude: from.coords.lat, longitude: from.coords.lng, latitudeDelta: destination.coords.lat, longitudeDelta: destination.coords.lng }}
          ref={e => this.map = e}
        >
          <Marker image={'rn_amap_startpoint'} coordinate={{ latitude: from.coords.lat, longitude: from.coords.lng }} />
          <Marker image={'rn_amap_endpoint'} coordinate={{ latitude: destination.coords.lat, longitude: destination.coords.lng }} />
        </MapView>
        
        <View style={[
          styles.JobDetailWrap
        ]}>
          <View style={[
            { marginBottom: 6, backgroundColor: 'white' }, 
            Platform.select({
              ios: {},
              android: { borderColor: '#ccc', borderWidth: .8 },
            }),
            { shadowOffset: { width: 0, height: 2 }, shadowColor: '#999', shadowOpacity: .5, shadowRadius: 3 },
          ]}>
            <View style={{ margin: 15, height: 166, flex: 1, justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <Text style={{ width:60, fontSize: 14, color:'#a5a5a5' }}>出发地</Text>
                <Text style={{ marginRight: 5, fontSize: 14 }}>{ from.name }({ from.address })</Text>
              </View>
              <View style={{ marginTop:10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{  width:60, fontSize: 14, color:'#a5a5a5' }}>目的地</Text>
                <Text style={{ marginRight: 5, fontSize: 14 }}>{ destination.name }({ destination.address })</Text>
              </View>
              
              <View style={{ marginTop:10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{  width:60, fontSize: 14, color:'#a5a5a5' }}>支付金额</Text>
                <Text style={{  marginRight: 5, fontSize: 14  }}>{ parseInt(fare).toFixed(2) }</Text>
              </View>
              <View style={{ marginTop:10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{  width:60, fontSize: 14, color:'#a5a5a5' }}>支付方式</Text>
                <Text style={{  marginRight: 5, fontSize: 14  }}>{ payment_method }</Text>
              </View>
              <View style={{ marginTop:10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{  width:60, fontSize: 14, color:'#a5a5a5' }}>预订时间</Text>
                <Text style={{  marginRight: 5, fontSize: 14  }}>{ moment(Date.parse(booking_at)).format('YYYY-MM-D HH:mm') }</Text>
              </View>
              {/* <View style={{ marginTop:10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{  width:60, fontSize: 14, color:'#a5a5a5' }}>订单状态</Text>
                <Text style={{  marginLeft: 10, fontSize: 14  }}>{ status }</Text>
              </View> */}
            </View>
            {/* <View style={{ height: 116, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              {
                (carArgs.length === 0) ? (
                  <View style={Platform.select({
                    android: { position: 'absolute', height: 116, top: 0, bottom: 0, left: (Screen.window.width - 30 - 66) / 2, alignItems: 'center', justifyContent: 'center' },
                    ios: { position: 'absolute', height: 96, top: 0, bottom: 0, left: (Screen.window.width - 30 - 66) / 2, alignItems: 'center', justifyContent: 'center' }
                  })}>
                    <Lottie progress={this.indicator} style={{ width: 66, height: 66 }} source={Resources.animation.simpleLoader} />
                  </View>
                ) : (
                  <ScrollView
                    pagingEnabled={type !== 'circle'}
                    horizontal={true} 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ 
                      height: 116, 
                      justifyContent: 'center', 
                      alignItems: 'center' 
                    }}
                    style={{ width: width - 30 }}
                  >
                    { (type === 'circle') ? 
                      carArgs.map((pipe, index) => (
                        <SelectButton key={index} data={pipe} />
                      )) : 
                      carArgs.map((pipe, index) => (
                        <View key={index} style={{ width: width - 30 }}>
                          <SelectButton key={index} data={pipe} />
                        </View>
                      ))
                    }
                  </ScrollView>
                )
              }
            </View> */}
          </View>
        </View>
      </View> 
    )
  }
}

const styles = StyleSheet.create({
  JobDetailWrap: Platform.select({
    ios: { position: 'absolute', bottom: Define.system.ios.x ? 40 : 30, left: 15, right: 15, borderRadius: 3 },
    android: { position: 'absolute', bottom: 15, left: 15, right: 15, borderRadius: 3 }
  }),
  // PickAddressWrap: Platform.select({
  //   ios: { position: 'absolute', bottom: 30, left: 15, right: 15, height: 89, backgroundColor: 'white', borderRadius: 3 },
  //   android: { position: 'absolute', bottom: 30, left: 15, right: 15, height: 89, backgroundColor: 'white', borderRadius: 3, borderColor: '#ccc', borderWidth: .6 }
  // })
})