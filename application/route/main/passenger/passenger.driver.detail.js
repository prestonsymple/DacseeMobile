import React, { Component } from 'react'
import {
  Text, View, TouchableOpacity, Platform, DeviceEventEmitter, Image, Linking
} from 'react-native'
import { connect } from 'react-redux'
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter'
import InteractionManager from 'InteractionManager'
import ActionSheet from 'react-native-actionsheet'

import { MapView, Marker, Utils, Polyline } from 'react-native-amap3d'
import { Screen, Icons, Define, System, Session, TextFont } from '../../../utils'
import { booking, application } from '../../../redux/actions'
import { Button } from '../../../components'
import { BOOKING_STATUS } from '..'

const { height, width } = Screen.window

const MAP_DEFINE = {
  showsCompass: false,
  showsScale: false,
  tiltEnabled: false,
  rotateEnabled: false,
  showsTraffic: false,
  showsZoomControls: false /* android fix */
}

export default connect(state => ({
  status: state.booking.status,
  i18n: state.intl.messages || {},
  nav: state.nav
}))(class BookingDriverDetailScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    const { title } = navigation.state.params
    return {
      drawerLockMode: 'locked-closed',
      headerLeft: (null),
      title: title || '等待接驾'
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      driver_info: {},
      driver_id: '',
      current: {},
      carLocation: {},
      ready: false,
      from: {},
      destination: {},
      route: {}
    }
    this.tick = 0
    this.trackTimer
  }

  async componentDidMount() {
    await InteractionManager.runAfterInteractions()

    // this.eventListener = RCTDeviceEventEmitter.addListener('EVENT_AMAP_VIEW_ROUTE_SUCCESS', async (args) => {
    //   if (this.props.status === 'ARRIVED') return undefined
    //   if (this.props.status === '' || this.props.status === 'ON_BOARD') {
    //     const { from, carLocation, destination, current } = this.state

    //     // 初始化
    //     const route = Array.isArray(args) ? args[0] : args
    //     route.polylines = route.routeNaviPoint.map(pipe => ({
    //       latitude: pipe.lat,
    //       longitude: pipe.lng
    //     }))
    //     const distance = this.props.status === '' ?
    //       await Utils.distance(from.coords.lat, from.coords.lng, carLocation.latitude, carLocation.longitude) : // 等待接驾
    //       await Utils.distance(destination.coords.lat || 0, destination.coords.lng || 0, current.latitude || 0, current.longitude || 0) // 前往目的地
    //     const km = distance / 1000

    //     let zoom = 16
    //     if (km >= 160) { zoom = 8 }
    //     else if (km >= 80) { zoom = 9 }
    //     else if (km >= 40) { zoom = 10 }
    //     else if (km >= 20) { zoom = 11 }
    //     else if (km >= 10) { zoom = 12 }
    //     else if (km >= 5) { zoom = 13 }
    //     else if (km >= 2.5) { zoom = 14 }
    //     else { zoom = 15 }

    //     zoom -= 1

    //     const { routeCenterPoint, routeLength } = route

    //     if (this.map) {
    //       this.map.animateTo({ zoomLevel: zoom, coordinate: { latitude: routeCenterPoint.latitude, longitude: routeCenterPoint.longitude } }, 500)
    //     }
    //     this.setState({ route })
    //   }
    // })

    this.subscription = DeviceEventEmitter.addListener('APPLICATION.LISTEN.EVENT.OPEN.MORE.MENU', () => this.ActionSheet.show())
    this.fetchOrderDetail()
  }

  componentWillUnmount() {
    this.subscription && this.subscription.remove()
    this.trackTimer && clearTimeout(this.trackTimer)
  }

  componentWillReceiveProps(props) {
    if (this.props.status !== props.status && props.status === BOOKING_STATUS.PASSGENER_BOOKING_DRIVER_ON_THE_WAY) {
      this.props.navigation.setParams({ title: '等待接驾中' })
    } else if (this.props.status !== props.status && props.status === BOOKING_STATUS.PASSGENER_BOOKING_DRIVER_ARRIVED) {
      this.props.navigation.setParams({ title: '司机已到达' })
    } else if (this.props.status !== props.status && props.status === BOOKING_STATUS.PASSGENER_BOOKING_ON_BOARD) {
      this.props.navigation.setParams({ title: '行驶中' })
    }
  }

  async fetchOrderDetail() {
    try {
      const { booking_id } = this.props.navigation.state.params
      const { driver_info, driver_id, from, destination } = await Session.Booking.Get(`v1/bookings/${booking_id}?fields=driver_info,driver_id,from,destination`)
      this.setState({ driver_info, driver_id, from, destination })
      this.activeLocationTrack()
    } catch (e) {
      this.tick += 1
      if (this.tick >= 4) {
        this.props.dispatch(application.showMessage(this.props.i18n.unable_get_order_pls_check_network))
        // TODO:
      } else {
        this.props.dispatch(application.showMessage(this.props.i18n.order_timeout_try))
        this.fetchOrderDetail()
      }
    }
  }

  async activeLocationTrack() {
    const { driver_id, from } = this.state
    if (!this.trackTimer) {
      this.trackTimer = setTimeout(async () => {
        if (this.props.status === BOOKING_STATUS.PASSGENER_BOOKING_WAIT_DRIVER_ON_THE_WAY) {
          try {
            const data = await Session.Location.Get(`/v1?reqUser_id=${driver_id}&userRole=passenger`)
            const { latitude, longitude } = data
            if (!latitude || !longitude) return undefined
            this.map.calculateDriveRouteWithStartPoints({ latitude, longitude }, {
              latitude: from.coords.lat,
              longitude: from.coords.lng
            })
            this.setState({ carLocation: { latitude, longitude } })
          } catch (e) {
            undefined
          } finally {
            // TODO .....
            this.trackTimer && clearTimeout(this.trackTimer)
            this.trackTimer = undefined
            this.activeLocationTrack()
          }
        } else if (this.props.status === BOOKING_STATUS.PASSGENER_BOOKING_WAIT_DRIVER_ARRIVED) {
          return undefined
        } else if (this.props.status === BOOKING_STATUS.PASSGENER_BOOKING_WAIT_ON_BOARD) {
          try {
            const { destination, current } = this.state
            const { latitude, longitude } = current
            this.map.calculateDriveRouteWithStartPoints({ latitude, longitude }, {
              latitude: destination.coords.lat,
              longitude: destination.coords.lng
            })
          } catch (e) {
            undefined
          } finally {
            // TODO .....
            this.trackTimer && clearTimeout(this.trackTimer)
            this.trackTimer = undefined
            this.activeLocationTrack()
          }
        }
      }, 2500)
    }
  }

  _pressActionSheet(index) {

  }

  onLocationListener({ nativeEvent }) {
    const { latitude, longitude } = nativeEvent
    if (latitude === 0 || longitude === 0) return
    if (!this.state.ready) {
      this.map.animateTo({ zoomLevel: 16, coordinate: { latitude, longitude } }, 500)
      this.setState({ ready: true })
    }
    this.setState({ current: { latitude, longitude } })
  }

  render() {
    const { status } = this.props
    const { route, from } = this.state

    return (
      <View style={{ flex: 1 }}>
        <MapView
          {...MAP_DEFINE}
          style={{ flex: 1 }}
          mapType={'standard'}
          locationEnabled={true}
          ref={e => this.map = e}
          locationInterval={1000}
          locationStyle={{}}
          showsTraffic={true}
          onLocation={this.onLocationListener.bind(this)}
        >
          { // 司机路径
            ('routeNaviPoint' in route && route.routeNaviPoint.length > 0) && (
              <Marker image={'rn_amap_car'} coordinate={{ latitude: route.routeNaviPoint[0].lat, longitude: route.routeNaviPoint[0].lng }} />
            )
          }
          {
            (status === BOOKING_STATUS.PASSGENER_BOOKING_WAIT_DRIVER_ARRIVED && from && from.coords) && (
              <Marker image={'rn_amap_startpoint'} coordinate={{ latitude: from.coords.lat, longitude: from.coords.lng }} />
            )
          }
          {
            ('polylines' in route) && (
              <Polyline
                coordinates={route.polylines}
                width={6}
                color={'#2d2a4a'}
              />
            )
          }
        </MapView>

        {(status === BOOKING_STATUS.PASSGENER_BOOKING_WAIT_DRIVER_ON_THE_WAY) && (<DriverOnTheWayLabel />)}
        <DriverStatusPanel {...this.state.driver_info} />
      </View>
    )
  }
})

class DriverOnTheWayLabel extends Component {
  render() {
    return (
      <View style={[
        { position: 'absolute', bottom: Define.system.ios.x ? 190 : 166, backgroundColor: 'white', height: 28 },
        { paddingHorizontal: 15, justifyContent: 'center', alignItems: 'center', left: 12, right: 12 },
        { flexDirection: 'row' },
        { shadowOffset: { width: 0, height: 2 }, shadowColor: '#999', shadowOpacity: .5, shadowRadius: 3 }
      ]}>
        {Icons.Generator.Material('volume-up', 16, '#999')}
        <Text style={{ color: '#777', fontSize: TextFont.TextSize(13), marginLeft: 6 }}>司机正在赶来，请前往路边等待</Text>
      </View>
    )
  }
}

class DriverStatusPanel extends Component {
  render() {
    const { avatars= [{ url: 'https://storage.googleapis.com/dacsee-service-user/_shared/default-profile.jpg' }], fullName, phoneCountryCode, phoneNo } = this.props

    return (
      <View style={[
        { height: Define.system.ios.x ? 184 : 160, backgroundColor: 'white' },
        { shadowOffset: { width: 0, height: -2 }, shadowColor: '#999', shadowOpacity: .5, shadowRadius: 3 },
      ]}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#eee', height: 64, width: 64, borderRadius: 32 }}>
            {avatars && (<Image style={{ width: 64, height: 64, borderRadius: 32 }} source={{ uri: avatars[0].url }} />)}
          </View>
          <Text style={{ color: '#666', fontSize: TextFont.TextSize(15), fontWeight: '400', marginTop: 6 }}>{fullName}</Text>
        </View>
        <View style={{ height: .8, backgroundColor: '#eee' }} />
        <View style={{ flexDirection: 'row', height: Define.system.ios.x ? 64 : 44, paddingBottom: Define.system.ios.x ? 24 : 0 }}>
          <TouchableOpacity onPress={() => Linking.openURL(`tel:${phoneCountryCode}${phoneNo}`)} style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            {Icons.Generator.Material('phone', 16, '#999', { style: { top: 1 } })}
            <Text style={{ color: '#444', fontWeight: '400', fontSize: TextFont.TextSize(15), marginLeft: 6 }}>打电话</Text>
          </TouchableOpacity>
          <View style={{ width: .8, backgroundColor: '#eee' }} />
          <TouchableOpacity style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            {Icons.Generator.Material('cancel', 16, '#999', { style: { top: 1 } })}
            <Text style={{ color: '#444', fontWeight: '400', fontSize: TextFont.TextSize(15), marginLeft: 6 }}>取消订单</Text>
          </TouchableOpacity>
          {/* <View style={{ width: .8, backgroundColor: '#eee' }} />
          <TouchableOpacity style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: Platform.select({ ios: 4, android: 0 }) }}>
            { Icons.Generator.Material('phone', 16, '#999', { style: { top: 1 } }) }
            <Text style={{ color: '#444', fontWeight: '400', fontSize: 15, marginLeft: 6 }}>打电话</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    )
  }
}
