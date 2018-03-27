import React, { Component, PureComponent } from 'react'
import { 
  Text, View, Animated, StyleSheet, Platform, StatusBar, Image, TouchableOpacity, TouchableHighlight, 
  DeviceEventEmitter, TextInput, Easing, ListView, ScrollView, Linking
} from 'react-native'
import DatePicker from 'react-native-datepicker'
import InteractionManager from 'InteractionManager'
import { NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter'
import moment from 'moment'
import { injectIntl } from 'react-intl'

import { MapView, Marker, Utils } from '../../native/AMap'
import { Screen, Icons, Redux, Define, System, Session } from '../../utils'
import { Button } from '../../components'
import Resources from '../../resources'
import { application, booking } from '../../redux/actions'
import WalletTransactionListScreen from '../wallet/wallet.transaction.list'
import IncomeList from '../income/income.list'
import { FormattedMessage } from 'react-intl';

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

export default connect( state => ({
  i18n: state.intl.messages || {}
}))(class JobsListDetailScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      drawerLockMode: 'locked-closed', 
      title: '订单详情'
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

  _getStatus(status) {
    switch (status) {
    case 'Pending_Acceptance':
      return {left: 'reject', right: 'accept', leftAction: () => { }, rightAction: () => {} }
    case 'On_The_Way':
      return {left: 'cancel', right: 'on_the_way', leftAction: () => { }, rightAction: () => {} }
    case 'Arrived':
      return {left: 'No Show', right: 'On Board', leftAction: () => {}, rightAction: () => {} }
    }
  }

  _getOptionable(status) {
    if (status == 'Pending_Acceptance' || status == 'On_The_Way' || status == 'Arrived' ) {
      return true
    } 
    return false
  }

  _statusInChinese(str) {
    switch(str) {
    // case 'Pending_Passenger':
    //   return '等待乘客'
    // case 'Pending_Assignment':
    //   return ''
    case 'Pending_Acceptance':
      return '等待接单'
    // case 'Confirmed':
    //   return ''
    case 'On_The_Way':
      return '司机即将到达'
    case 'Arrived':
      return '司机已到达'
    case 'No_Show':
      return '乘客未抵达'
    case 'On_Board':
      return '乘客已上车'
    case 'Completed':
      return '订单完成'
    case 'Cancelled_by_Passenger':
      return '乘客已取消'
    case 'Cancelled_by_Driver':
      return '司机已取消'
    case 'Rejected_by_Driver':
      return '司机已拒绝'
    case 'No_Taker':
      return '订单无人应答'
    }
  }

  render() {
    // const { destination = { coords: { lat: 0, lng: 0 } }, from = { coords: { lat: 0, lng: 0 } }} = this.state.jobDetail
    const { destination, from, payment_method, fare, booking_at, status, passenger_info } = this.state.jobDetail
    const { avatars, fullName, phoneCountryCode, phoneNo } = passenger_info
    const { i18n } = this.props
    const leftBtn = this._getStatus(status).left
    const rightBtn = this._getStatus(status).right
    return (      
      <View style={{ flex: 1 }}>
        <MapView
          {...MAP_DEFINE}
          style={{ height: 210 }}
          mapType={'standard'}
          coordinate={{ latitude: from.coords.lat, longitude: from.coords.lng }}
          zoomLevel={ 10 }
          // region={{ latitude: from.coords.lat, longitude: from.coords.lng, latitudeDelta: destination.coords.lat, longitudeDelta: destination.coords.lng }}
          ref={e => this.map = e}
        >
          <Marker image={'rn_amap_startpoint'} coordinate={{ latitude: from.coords.lat, longitude: from.coords.lng }} />
          <Marker image={'rn_amap_endpoint'} coordinate={{ latitude: destination.coords.lat, longitude: destination.coords.lng }} />
        </MapView>

        <View style={{ position: 'absolute', top: 160, bottom:0, left: 0, right: 0, opacity: 1}}>
      
          <View style={{ marginTop: 40, flex: 1, backgroundColor: 'white', borderTopRightRadius: 20, borderTopLeftRadius: 20, shadowOffset: {width: 0, height: 5}, shadowColor: '#999', shadowOpacity: .5, shadowRadius: 20 }}> 
            <ScrollView style={{ marginTop: 50, marginBottom: 70 }} >
              <View style={{ paddingHorizontal: 20 }}>
                <View style={{ flexDirection: 'row', width: width - 40, justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 17, color:'#999', width: 120 }}>
                    <FormattedMessage id={'from'} />
                  </Text>
                  <Text style={{ flex: 1, fontSize: 16, color: '#333', fontWeight: 'bold', textAlign: 'right' }}>{ from.name }({ from.address })</Text>
                </View>

                <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 17, color:'#999', width: 120 }}>
                    <FormattedMessage id={'destination'}/>
                  </Text>
                  <Text style={{ flex: 1, fontSize: 16, color: '#333', fontWeight: 'bold', textAlign: 'right' }}>{ destination.name }({ destination.address })</Text>
                </View>
                
                <View style={{ marginTop: 20, flexDirection: 'row' }}>
                  <Text style={{ fontSize: 17, color:'#999', width: 120 }}>
                    <FormattedMessage id={'book_time'}/>
                  </Text>
                  <Text style={{ flex: 1, fontSize: 16, color: '#333', fontWeight: 'bold', textAlign: 'right' }}>{ moment(Date.parse(booking_at)).format('YYYY-MM-D HH:mm') }</Text>               
                </View>

                <View style={{ marginTop: 20, height: 1, backgroundColor: '#e5e5e5' }}></View>
              </View>
              <View style={{ marginHorizontal: 20, marginVertical: 12, flexDirection: 'row', justifyContent: 'center' }}>
                <View style={{flex: 1, alignItems:'center', }}>
                  <Image source={ Resources.image.joblist_car} resizeMethod={'scale'} style={{ width:40, height: 40}} />
                  <Text style={{ marginTop: 10, fontSize: 15, color: '#333' }}>
                    <FormattedMessage id={'car_standard'}/>
                  </Text>
                </View>
                <View style={{ flex: 1, alignItems:'center'}}>
                  <Image source={ Resources.image.joblist_payment} resizeMethod={'scale'} style={{ height: 40}} />
                  <Text style={{ marginTop: 10, fontSize: 15, color: '#333' }}>{ payment_method == 'Cash' ? '现金' : payment_method }</Text>
                </View>
              </View>
              <View style={{ marginHorizontal: 20, height: .5, backgroundColor: '#e5e5e5' }}></View>              
              <View style={{ marginHorizontal: 20, marginVertical: 12 }}>
                <Text style={{ fontSize: 17, fontWeight: 'bold', color: '#333' }}>
                  <FormattedMessage id={'note_to_driver'}/>
                </Text>
                <Text style={{ marginTop: 10, fontSize: 17, color: '#999' }}>
                  <FormattedMessage id={'no_content'}/>
                </Text>
              </View>
            </ScrollView>

            <View style={[styles.JobDetailWrap, { height: 70 }]}>
              <View style={{ height: 1, backgroundColor: '#d5d5d5' }}></View>
              <View style={{marginHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 70 }}>
                <Text style={{ fontWeight: 'bold', color: '#333', fontSize: 27 }}>{ fare.toFixed(2) }</Text>
                {
                  this._getOptionable(status) ?               
                    <View style={{ flexDirection: 'row' }}>
                      <Button style={{ borderRadius: 5, width: 100, height: 40, backgroundColor: '#E8969E', marginRight: 20 }} onPress={ this._getStatus(status).leftAction }>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white'}}>{ i18n.leftBtn }</Text>
                      </Button>
                      <Button style={{ borderRadius: 5, width: 100, height: 40, backgroundColor: '#7FCE34' }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white'}} onPress={ this._getStatus(status).rightAction }>{ i18n.rightBtn }</Text>
                      </Button>
                    </View> :
                    <Text style={{ fontSize: 17 }}>{ this._statusInChinese(status) }</Text>
                }                        
              </View>
            </View>              
          </View>

          <View style={{ position: 'absolute', top: 10, left:30, right: 30, height: 80, flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
              <Image source={{ uri: avatars == undefined ? 'https://storage.googleapis.com/dacsee-service-user/_shared/default-profile.jpg' : avatars[avatars.length - 1].url }} style={{ width: 70, height: 70 , borderRadius: 35 }} />
            </View>
            <View style={{ position: 'absolute', top:25, left: 75, right: 116, height: 50, backgroundColor: 'white' }}>
              <Text style={{ marginLeft: 10, marginTop: 5, fontSize: 17, color: '#333', fontWeight: 'bold' }}>{ fullName }</Text>
            </View>            
            <View style={{ flexDirection: 'row', position: 'absolute', right: 0}}>
              <View style={{ marginRight: 10, width: 58, height: 58, borderRadius: 29, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => {
                  Linking.openURL(`sms:${phoneCountryCode}${phoneNo}`)
                }} style={{ backgroundColor: '#eee', width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center'}}>
                  { Icons.Generator.Material('textsms', 24, '#555') }
                </TouchableOpacity>
              </View>
              <View style={{ width: 58, height: 58, borderRadius: 29, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => {
                  Linking.openURL(`tel:${phoneCountryCode}${phoneNo}`)
                }} style={{ backgroundColor: '#eee', width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' }}>
                  { Icons.Generator.Material('phone', 24, '#555') }
                </TouchableOpacity>
              </View>
            </View>
          </View>          
        </View>        
      </View> 
    )
  }
})

const styles = StyleSheet.create({
  JobDetailWrap: Platform.select({
    ios: { position: 'absolute', bottom: Define.system.ios.x ? 20 : 0, left: 0, right: 0},
    android: { position: 'absolute', bottom: 15, left: 0, right: 0 }
  }),
  // PickAddressWrap: Platform.select({
  //   ios: { position: 'absolute', bottom: 30, left: 15, right: 15, height: 89, backgroundColor: 'white', borderRadius: 3 },
  //   android: { position: 'absolute', bottom: 30, left: 15, right: 15, height: 89, backgroundColor: 'white', borderRadius: 3, borderColor: '#ccc', borderWidth: .6 }
  // })
})