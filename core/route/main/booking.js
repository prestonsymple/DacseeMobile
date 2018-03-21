/* global navigator */

import React, { Component, PureComponent } from 'react'
import {
  Text, View, Animated, StyleSheet, Image, TouchableOpacity,
  DeviceEventEmitter, ListView, Platform, ScrollView, StatusBar
} from 'react-native'
import moment from 'moment'
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter'
import InteractionManager from 'InteractionManager'
import { NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'
import Lottie from 'lottie-react-native'

import Resources from '../../resources'
import ModalDriverRespond from '../../modal/modal.driver.respond'

import HeaderSection from './booking.header.section'
import BookingSelectCircle from './booking.select.circle'
import BookingNavigationBarSwipe from './booking.navigation.bar.swipe'

import { MapView, Search, Marker, Utils } from '../../native/AMap'
import { Screen, Icons, Define, Session, System } from '../../utils'
import { application, booking } from '../../redux/actions'
import { Button, SelectCarType } from '../../components'
import { JobsListScreen } from '../jobs'
import { BOOKING_STATUS } from '.'

const { height, width } = Screen.window

const MAP_DEFINE = {
  showsCompass: false,
  showsScale: false,
  tiltEnabled: false,
  rotateEnabled: false,
  showsTraffic: false,
  showsZoomControls: false, /* android fix */
}

const PIN_HEIGHT = ((height - 22) / 2)
const BOTTOM_MARGIN = Platform.select({
  ios: Define.system.ios.x ? 35 : 5,
  android: 25
}) 

// TODO: Optimize the callback
const dataContrast = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

// export default connect(state => ({ data: state.booking })) // TEST
export default connect(state => ({
  booking_status: state.booking.status,
  jobs_status: state.jobs.status,
  app_status: state.application.application_status
}))(class MainScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state
    const { status = BOOKING_STATUS.PASSGENER_BOOKING_INIT } = params

    const SETTER = {
      activeOpacity: .7,
      style: { top: 1, width: 54, paddingLeft: 8, justifyContent: 'center', alignItems: 'flex-start' },
      onPress: () => {
        if (status === BOOKING_STATUS.PASSGENER_BOOKING_INIT) {
          DeviceEventEmitter.emit('APPLICATION.LISTEN.EVENT.DRAWER.OPEN') 
        } else {
          navigation.dispatch(booking.passengerSetStatus(BOOKING_STATUS.PASSGENER_BOOKING_INIT))
        }
      }
    } 

    const maps = {
      drawerLockMode: 'locked-closed',
      headerStyle: {
        backgroundColor: '#1AB2FD',
        shadowColor: 'transparent',
        shadowOpacity: 0,
        borderBottomWidth: 0,
        borderBottomColor: 'transparent',
        elevation: 0,
      },
      title: (status >= BOOKING_STATUS.PASSGENER_BOOKING_INIT) ? 'DACSEE' : '确认行程',
      headerLeft: (
        <TouchableOpacity {...SETTER}>
          {
            (status === BOOKING_STATUS.PASSGENER_BOOKING_INIT) && (Icons.Generator.Octicons('three-bars', 23, 'white', { style: { left: 8 } }))
          }
          {
            (status >= BOOKING_STATUS.PASSGENER_BOOKING_PICKED_ADDRESS) && (Icons.Generator.Material('keyboard-arrow-left', 30, 'white'))
          }
        </TouchableOpacity>
      )
    }

    return maps
  }

  constructor(props) {
    super(props)
    this.state = {
      deniedAccessLocation: false
    }
  }

  async componentDidMount() {
    await InteractionManager.runAfterInteractions()
    this.subscription = DeviceEventEmitter.addListener('APPLICATION.LISTEN.EVENT.DRAWER.OPEN', () => this.props.navigation.navigate('DrawerOpen'))
    this.checkLocationPermission()
  }

  componentWillUnmount() {
    this.subscription && this.subscription.remove()
  }

  async componentWillReceiveProps(props) {
    const { booking_status, jobs_status } = props
    if (this.props.booking_status !== booking_status) {
      this.props.navigation.setParams({ status: booking_status })
    }

    if (this.props.app_status !== props.app_status && props.app_status === 'active') {
      this.checkLocationPermission()
    }
  }

  checkLocationPermission() {
    navigator.geolocation.getCurrentPosition(() => this.setState({ deniedAccessLocation: false }), (e) => {
      if (e.code === 1 || e.code === 2) this.setState({ deniedAccessLocation: true })
    }, { timeout: 1000 })
  }

  render() {
    const { deniedAccessLocation } = this.state
    return deniedAccessLocation ? (
      <View style={{ flex: 1, width, justifyContent: 'center', alignItems: 'center', top: -44 }}>
        <Image style={{ top: -22 }} source={ require('../../resources/images/location-error.png') } />
        <Text style={{ color: '#666', fontSize: 14 }}>请确认您的位置权限是否打开</Text>
      </View>
    ) : (
      <View style={{ flex: 1, alignItems: 'center' }}>
        <StatusBar animated={true} hidden={false} backgroundColor={'#1ab2fd'} barStyle={'light-content'} />
        <BookingNavigationBarSwipe />
        <BookingContainerSwipe />
      </View>
    )
  }
})

const BookingContainerSwipe = connect(state => ({ core_mode: state.application.core_mode }))(class BookingContainerSwipe extends Component {

  constructor(props) { 
    super(props)
  }

  async componentDidMount() { 
    await InteractionManager.runAfterInteractions()
    this.scrollView.scrollTo({ x: this.props.core_mode === 'driver' ? 0 : width, animated: false }) 

    // 修复Android初始化加载延迟问题, Tab页切换不对
    if (System.Platform.Android) {
      await new Promise((resolve, reject) => setTimeout(() => resolve(), 250))
      this.scrollView.scrollTo({ x: this.props.core_mode === 'driver' ? 0 : width, animated: false }) 
    }
  }

  componentWillReceiveProps(props) {
    if (props.core_mode !== this.props.core_mode) {
      this.scrollView.scrollTo({ x: props.core_mode === 'driver' ? 0 : width, animated: false })
    }
  }

  render() {
    const VIEW_SETTER = {
      scrollEnabled: false,
      horizontal: true,
      ref: (e) => this.scrollView = e
    }
    return (
      <ScrollView {...VIEW_SETTER}>
        <DriverComponent />
        <PassengerComponent />
      </ScrollView>
    )
  }
})

class DriverComponent extends Component {
  render() {
    return (
      <View style={{ width }}>
        <JobsListScreen />
      </View>
    )
  }
}

const PassengerComponent = connect(state => ({
  ...state.booking
}))(class PassengerComponent extends Component {

  constructor(props) {
    super(props)
    this.state = {
      drag: false,
      routeBounds: {}, routeCenterPoint: {}, routeLength: 0, routeNaviPoint: [], routeTime: 0, routeTollCost: 0
    }
    this.currentLoc = {}
    this.timer = null
    this.pin = new Animated.Value(0)
    this.board = new Animated.Value(0)
    this.ui = new Animated.Value(0)
    this.form = new Animated.Value(0)

    this.count = 0

    this.ready = false
  }

  async componentWillReceiveProps(props) {
    if (this.props.status !== props.status && props.status === BOOKING_STATUS.PASSGENER_BOOKING_INIT)  {
      this.map.animateTo({ zoomLevel: 16, coordinate: this.state.current }, 500)
      this.setState({ ready: true })
    }

    if (this.props.status !== props.status && props.status === BOOKING_STATUS.PASSGENER_BOOKING_PICKED_ADDRESS) {
      const { destination, from } = props
      this.map.calculateDriveRouteWithStartPoints(
        { latitude: from.location.lat, longitude: from.location.lng }, 
        { latitude: destination.location.lat, longitude: destination.location.lng }
      )

      const { fare } = await Session.Booking.Get(`v1/fares?from_lat=${from.location.lat}&from_lng=${from.location.lng}&destination_lat=${destination.location.lat}&destination_lng=${destination.location.lng}`)
      this.props.dispatch(booking.passengerSetValue({ fare: fare.Circle }))
    }
  }

  async componentDidMount() {
    await InteractionManager.runAfterInteractions()
    this.eventListener = RCTDeviceEventEmitter.addListener('EVENT_AMAP_VIEW_ROUTE_SUCCESS', (args) => this.aMapMathRouteSuccess(args))
    this.props.dispatch(booking.passengerSetStatus(BOOKING_STATUS.PASSGENER_BOOKING_INIT))
  }

  componentWillUnmount() {
    this.eventListener && this.eventListener.remove()
  }

  async aMapMathRouteSuccess(args) {
    const route = Array.isArray(args) ? args[0] : args
    const { routeCenterPoint } = route
    let zoom = 15

    if (this.props.status === BOOKING_STATUS.PASSGENER_BOOKING_PICKED_ADDRESS) {
      const { destination, from } = this.props
      const distance = await Utils.distance(
        from.location.lat, from.location.lng, 
        destination.location.lat, destination.location.lng
      )
      zoom = this.mathDistanceZoom(distance)
      this.setState({ ...route })
    }
    this.map.animateTo({ zoomLevel: zoom, coordinate: { latitude: routeCenterPoint.latitude, longitude: routeCenterPoint.longitude } }, 500) 
  }

  mathDistanceZoom(distance) {
    const km = distance / 1000

    let zoom = 16
    if (km >= 160) { zoom = 8 }
    else if (km >= 80) { zoom = 9 }
    else if (km >= 40) { zoom = 10 }
    else if (km >= 20) { zoom = 11 } 
    else if (km >= 10) { zoom = 12 }
    else if (km >= 5) { zoom = 13 }
    else if (km >= 2.5) { zoom = 14 }
    else { zoom = 15 }

    zoom -= 1
    return zoom
  }

  async onLocationListener({ nativeEvent }) {
    const { latitude, longitude } = nativeEvent

    if (latitude === 0 || longitude === 0) return
    if (!this.ready) {
      await InteractionManager.runAfterInteractions()
      this.map.animateTo({ zoomLevel: 16, coordinate: { latitude, longitude } }, 500)
      this.ready = true
    }
    this.setState({ current: { latitude, longitude } })
    // try {
    //   await Session.Location.Put('v1', { latitude, longitude })
    // } catch (e) { /**/ }
  }

  onStatusChangeListener({ nativeEvent }) {
    const { longitude, latitude, rotation, zoomLevel, tilt } = nativeEvent
    if (!this.state.drag) {
      this.setState({ drag: true })
      this.props.dispatch(booking.passengerSetValue({ from: {} }))
      Animated.spring(this.pin, { toValue: 1, friction: 1.5 }).start()
      Animated.timing(this.board, { toValue: 1, duration: 100 }).start()
    }
    this.timer && clearTimeout(this.timer)
    this.timer = setTimeout(this.onLocationSearch.bind(this, longitude, latitude), 1500)
  }

  async onLocationSearch(longitude, latitude) {
    try {
      Animated.timing(this.pin, { toValue: 0, duration: 200 }).start()
      Animated.timing(this.board, { toValue: 0, duration: 200 }).start()
      const { pois } = await Search.searchLocation(longitude, latitude)

      if (!this.state.city) {
        let city = pois[0].city
        city = city.length > 2 ? city.substr(0, 2) : city
        this.setState({ city })
      }

      const address = pois.find(pipe => {
        if (pipe.address.endsWith('米')) return pipe
        if (pipe.address.endsWith('站')) return pipe
        if (pipe.address.endsWith('号')) return pipe
        if (pipe.address.endsWith('弄')) return pipe
        return false
      })
      this.props.dispatch(booking.passengerSetValue({ from: address || {} }))
      this.setState({ drag: false })
    } catch (e) {
      return
    }
  }

  render() {
    const { drag } = this.state
    const { status, from, destination } = this.props

    const MAP_SETTER = {
      style: { flex: 1 },
      locationEnabled: true,
      mapType: 'standard',
      locationInterval: 1000,
      onLocation: this.onLocationListener.bind(this),
      ref: (e) => this.map = e
    }

    if (status === BOOKING_STATUS.PASSGENER_BOOKING_INIT) {
      MAP_SETTER.onStatusChange = this.onStatusChangeListener.bind(this)
    }
    
    return (
      <View style={{ flex: 1, width }}>
        <MapView {...MAP_DEFINE} {...MAP_SETTER}>
          <Marker image={'rn_amap_startpoint'} coordinate={{ latitude: from.location ? from.location.lat : 0, longitude: from.location ? from.location.lng : 0 }} />
          <Marker image={'rn_amap_endpoint'} coordinate={{ latitude: destination.location ? destination.location.lat : 0, longitude: destination.location ? destination.location.lng : 0 }} />
        </MapView>

        { status === BOOKING_STATUS.PASSGENER_BOOKING_INIT && (<HeaderSection />) }

        { status === BOOKING_STATUS.PASSGENER_BOOKING_INIT && (<MapPin timing={this.pin} />) }
        { status === BOOKING_STATUS.PASSGENER_BOOKING_INIT && (<MapPinTip timing={this.board} />) }

        { 
          (
            status === BOOKING_STATUS.PASSGENER_BOOKING_INIT ||
            status === BOOKING_STATUS.PASSGENER_BOOKING_PICKED_ADDRESS
          ) && (<BookingSelectCircle init={true} />) 
        }

        { status === BOOKING_STATUS.PASSGENER_BOOKING_INIT && (<PickerAddress timing={this.ui} drag={drag} />) }
        { status === BOOKING_STATUS.PASSGENER_BOOKING_PICKED_ADDRESS && (<PickerOptions />) }

        <ModalDriverRespond />
      </View>
    )
  }
})

const PickerOptions = connect(state => ({ status: state.booking.status, fare: state.booking.fare }))(class PickerOptions extends Component {
  render() {
    return (
      <Animated.View style={[
        { position: 'absolute', left: 0, right: 0, bottom: 0, height: Define.system.ios.x ? 160 + 22 : 160, justifyContent: 'center' },
        { shadowOffset: { width: 0, height: 2 }, shadowColor: '#999', shadowOpacity: .5 },
        { backgroundColor: 'white', paddingHorizontal: 23 },
        { borderTopLeftRadius: 28, borderTopRightRadius: 28 }
      ]}>
        <View style={{ alignItems: 'center' }}>
          <View style={{ width: 276, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <TouchableOpacity activeOpacity={.7} style={{ width: 128, height: 56, borderRadius: 8, backgroundColor: '#1ab2fd', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>现金</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={.7} style={{ width: 128, height: 56, borderRadius: 8, backgroundColor: '#1ab2fd', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>现在</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => {
            this.props.dispatch(booking.passengerSetStatus(BOOKING_STATUS.PASSGENER_BOOKING_WAIT_SERVER_RESPONSE))
          }} activeOpacity={.7} style={{ width: 276, height: 56, borderRadius: 28, backgroundColor: '#ffb639', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>{ (this.props.fare === 0) ? '开始' : `开始 - 行程费用 ￥${parseInt(this.props.fare).toFixed(2)}`}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    )
  }
})

class SelectButton extends Component {
  constructor(props) {
    super(props) 
  }

  render() {
    const { data = {} } = this.props
    const { image, title, price, circle, label, key, icon, onPress = () => {} } = data
    return (
      <Button onPress={onPress} key={key} style={{ alignItems: 'center', justifyContent: 'center', marginHorizontal: 12, top: 3 }}>
        <Animated.View style={[
          { width: 58, height: 58, borderRadius: 33, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#fff' }
        ]}>
          {
            icon ? (
              <View style={{ backgroundColor: '#f2f2f2', width: 58, height: 58, borderRadius: 29, justifyContent: 'center', alignItems: 'center' }}>
                { icon }
              </View>
            ) : (
              <Animated.Image 
                style={{ opacity: 0.7, width: 58, height: 58, borderRadius: 29, borderWidth: 1.5, borderColor: 'white', resizeMode: 'cover' }} 
                source={image}
              />
            )
          }
        </Animated.View>
        <Text style={{ color: '#666', fontSize: 14, fontWeight: '400', marginTop: 6 }}>{ title }</Text>
      </Button>
    )
  }
}

const PickerAddress = connect(state => ({ ...state.booking }))(class PickerAddress extends Component {

  constructor(props) {
    super(props)
    this.animated = new Animated.Value(0)
  }

  componentWillReceiveProps(props) {
    if (props.drag) { Animated.loop(Animated.timing(this.animated, { toValue: 1, duration: 800, useNativeDriver: true })).start() }
    if (props.from.name) { this.animated.stopAnimation() }
  }

  render() {
    const { drag, from, destination } = this.props

    return (
      <Animated.View style={[
        { position: 'absolute', left: 0, right: 0, bottom: 0, height: Define.system.ios.x ? 142 : 120, justifyContent: 'center' },
        { shadowOffset: { width: 0, height: 2 }, shadowColor: '#999', shadowOpacity: .5 },
        { backgroundColor: 'white', paddingBottom: Define.system.ios.x ? 22 : 0, paddingHorizontal: 23 },
        { borderTopLeftRadius: 28, borderTopRightRadius: 28 }
      ]}>
        <View style={{ height: 79 }}>
          {/* From */}
          <TouchableOpacity onPress={() => {
            !drag && this.props.dispatch(NavigationActions.navigate({ routeName: 'PickerAddressModal', params: { type: 'from' } }))
          }} activeOpacity={0.7} style={{ flex: 1, height: 44, justifyContent: 'center' }}>
            <View style={{ backgroundColor: '#FEA81C', height: 10, width: 10, borderRadius: 5, position: 'absolute', left: 20 }} />
            <Text numberOfLines={1} style={{ marginHorizontal: 48, textAlign: 'center', color: '#333', fontSize: 14, fontWeight: '600' }}>{from.name}</Text>
            <View style={{ position: 'absolute', top: 0, bottom: 0, left: (Screen.window.width - 46 - 44) / 2, alignItems: 'center', justifyContent: 'center' }}>
              {
                (!from.name || drag) && (<Lottie progress={this.animated} style={{ width: 44, height: 44 }} source={Resources.animation.simpleLoader} />)
              }
            </View>
          </TouchableOpacity>
          <View style={{ backgroundColor: '#e8e8e8', height: .5, marginHorizontal: 18 }} />
          {/* To */}
          <TouchableOpacity onPress={() => {
            this.props.dispatch(NavigationActions.navigate({ routeName: 'PickerAddressModal', params: { type: 'destination' } }))
          }} activeOpacity={0.7} style={{ flex: 1, height: 44, justifyContent: 'center' }}>
            <View style={{ backgroundColor: '#7ED321', height: 10, width: 10, borderRadius: 5, position: 'absolute', left: 20 }} />
            <Text numberOfLines={1} style={{ marginHorizontal: 48, textAlign: 'center', color: destination.name ? '#333' : '#a2a2a2', fontSize: 14, fontWeight: '600', /* PositionFix */ top: -1 }}>{destination.name || '请输入目的地'}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    )
  }
})

class MapPinTip extends Component {
  render() {
    const { timing } = this.props
    return (
      <Animated.View style={[
        { position: 'absolute', backgroundColor: 'transparent', top: PIN_HEIGHT - 94, left: (Screen.window.width - 140) / 2 },
        { justifyContent: 'center', alignItems: 'center', paddingVertical: 6, width: 140 },
        { shadowOffset: { width: 0, height: 2 }, shadowColor: '#666', shadowOpacity: .3, shadowRadius: 3 },
        { opacity: timing.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }
      ]}>
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'white', flex: 1, borderRadius: 20 }} />
        <View style={{ position: 'absolute', bottom: -10 }}>
          {Icons.Generator.Material('network-wifi', 20, 'white')}
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ fontSize: 13, color: '#666', fontWeight: '600' }}>Board after </Text>
          <Text style={{ fontSize: 13, color: '#ffa81d', fontWeight: '600' }}>1 min(s)</Text>
        </View>
      </Animated.View>
    )
  }
}

class MapPin extends Component {
  render() {
    const { timing } = this.props
    return (
      <View style={{ position: 'absolute', left: (Screen.window.width - 18) / 2 }}>
        <Animated.Image style={[
          { width: 18, height: 28 },
          { top: timing.interpolate({ inputRange: [0, 1], outputRange: [PIN_HEIGHT - 56, PIN_HEIGHT - 60] }) }
        ]} source={Resources.image.pin} />
      </View>
    )
  }
}