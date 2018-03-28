import React, { Component, PureComponent } from 'react'
import { Text, View, Animated, TouchableOpacity, Modal } from 'react-native'
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter'
import InteractionManager from 'InteractionManager'
import { NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'
import Lottie from 'lottie-react-native'

import Resources from '../../../resources'
import ModalDriverRespond from './passenger.modal.wait.driver'

import HeaderSection from '../components/navigator.header.selector'
import CircleBar from '../components/circle.bar'

import { MapView as AMapView, Marker, Utils, Polyline } from '../../../native/AMap'
// import GoogleMap from 'react-native-maps'
import { Screen, Icons, Define, Session, UtilMath } from '../../../utils'
import { booking, account } from '../../../redux/actions'
import { BOOKING_STATUS } from '..'
import TimePicker from '../../../components/timePicker'
import SelectPay from '../../../components/selectPay'
const { height, width } = Screen.window

const MAP_DEFINE = {
  showsCompass: false,
  showsScale: false,
  tiltEnabled: false,
  rotateEnabled: false,
  showsTraffic: false,
  showsZoomControls: false, /* android fix */
}

const DEFAULT_COORDS = { lat: 0, lng: 0, latitude: 0, longitude: 0 }

const PIN_HEIGHT = ((height - 22) / 2)

export default connect(state => ({ ...state.booking, booking_id: state.storage.booking_id }))(class PassengerComponent extends Component {

  constructor(props) {
    super(props)
    this.state = {
      drag: false,
      showTP:false,
      showSP:false,
      routeBounds: {}, routeCenterPoint: {}, routeLength: 0, routeNaviPoint: [], routeTime: 0, routeTollCost: 0,
      polyline: []
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
    if (props.status === BOOKING_STATUS.PASSGENER_BOOKING_INIT && this.props.status !== props.status) {
      this.map.animateTo({ zoomLevel: 16, coordinate: this.state.current }, 500)
      this.setState({ ready: true, polyline: [] })
    }

    if (props.status === BOOKING_STATUS.PASSGENER_BOOKING_PICKED_ADDRESS && this.props.status !== props.status) {
      const { destination, from } = props

      const mLat = ((from.coords.lat + destination.coords.lat) / 2) - 0.035
      const mLng = ((from.coords.lng + destination.coords.lng) / 2)

      const distance = await Utils.distance(from.coords.lat, from.coords.lng, destination.coords.lat, destination.coords.lng)
      const zoom = this.mathDistanceZoom(distance)
      this.map.animateTo({ zoomLevel: zoom, coordinate: { latitude: mLat, longitude: mLng } }, 500)

      const { fare = {} } = await Session.Booking.Get(`v1/fares?from_lat=${from.coords.lat}&from_lng=${from.coords.lng}&destination_lat=${destination.coords.lat}&destination_lng=${destination.coords.lng}`)
      this.props.dispatch(booking.passengerSetValue({ fare: fare.Circle }))
      this.setState({ polyline: [] })
    }

    if (props.status === BOOKING_STATUS.PASSGENER_BOOKING_DRIVER_ON_THE_WAY && props.driver !== this.props.driver && ('latitude' in props.driver)) {
      const { driver, from } = props
      const driverCoords = [parseFloat(driver.longitude.toFixed(6)), parseFloat(driver.latitude.toFixed(6))]
      const passengerCoords = [from.coords.lng, from.coords.lat]

      const { data } = await Session.Lookup_CN.Get(`v1/map/calculate/route/polyline/${driverCoords.join(',')}/${passengerCoords.join(',')}`)
      const lnglat = data.map(pipe => {
        const coords = pipe.split(',')
        return { longitude: parseFloat(coords[0]), latitude: parseFloat(coords[1]) }
      })
      this.setState({ polyline: lnglat }) // 更新路径，30s刷新一次
      this.map.animateTo({ zoomLevel: 15, coordinate: { latitude: driverCoords[1], longitude: driverCoords[0] } }, 500)
    }
  }

  async componentDidMount() {
    await InteractionManager.runAfterInteractions()
    if (!this.props.booking_id) {
      this.props.dispatch(booking.passengerSetStatus(BOOKING_STATUS.PASSGENER_BOOKING_INIT))
    }
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
    this.props.dispatch(account.updateLocation({ lat: latitude, lng: longitude, latitude, longitude }))
    // try {
    //   await Session.Location.Put('v1', { latitude, longitude })
    // } catch (e) { /**/ }
  }

  onStatusChangeListener({ nativeEvent }) {
    const { longitude, latitude, rotation, zoomLevel, tilt } = nativeEvent
    if (this.props.status >= BOOKING_STATUS.PASSGENER_BOOKING_PICKED_ADDRESS) return
    /* Fix Offset */
    const OFFSET_RANGE = [1.5, .8, .4, .2, .1, .05, .025, .0125, .00625, .003125, .0015625, .00078125, .000390625, .0001953125, .00009765625]
    const maxValue = OFFSET_RANGE[Math.floor(zoomLevel) - 5]
    const minValue = OFFSET_RANGE[Math.ceil(zoomLevel) - 5]

    const dValue = maxValue - (maxValue - minValue) * (zoomLevel % 1)
    const _longitude = longitude
    const _latitude = latitude + dValue
    /* Fix Offset */

    if (!this.state.drag) {
      this.setState({ drag: true })
      this.props.dispatch(booking.passengerSetValue({ from: {} }))
      Animated.spring(this.pin, { toValue: 1, friction: 1.5 }).start()
      Animated.timing(this.board, { toValue: 1, duration: 100 }).start()
    }
    this.timer && clearTimeout(this.timer)
    this.timer = setTimeout(this.onLocationSearch.bind(this, _longitude, _latitude), 1000)
  }

  async onLocationSearch(longitude, latitude) {
    try {
      Animated.timing(this.pin, { toValue: 0, duration: 200 }).start()
      Animated.timing(this.board, { toValue: 0, duration: 200 }).start()

      const { data } = await Session.Lookup_CN.Get(`v1/map/search/geo/${latitude},${longitude}`)
      this.props.dispatch(booking.passengerSetValue({ from: data || {} }))
      this.setState({ drag: false })
    } catch (e) {
      this.props.dispatch(booking.passengerSetValue({
        from: {
          address: '自定义位置', name: '当前位置',
          coords: { lng: longitude, lat: latitude },
        }
      }))
      this.setState({ drag: false })
    }
  }
  wheelSubmit(time){
    this.setState({showTP:false})
  }
  wheelCancel(time){
    this.setState({showTP:false})
  }
  showTimerPicker(){
    this.setState({showTP:true})
  }
  showSelcetPay(){
    this.setState({showSP:true})
  }
  payCancel(){
    this.setState({showSP:false})
  }
  render() {
    const { drag, polyline } = this.state
    const { status, from, destination, driver } = this.props

    const MAP_SETTER = {
      style: { flex: 1 },
      locationEnabled: true,
      mapType: 'standard',
      locationInterval: 1000,
      onLocation: this.onLocationListener.bind(this),
      ref: (e) => this.map = e
    }

    const GOOGLE_MAP_SETTER = { followsUserLocation: true }

    if (status === BOOKING_STATUS.PASSGENER_BOOKING_INIT) {
      MAP_SETTER.onStatusChange = this.onStatusChangeListener.bind(this)
    }

    /** FIX ANDROID LOCATION SERVICE CRASH */

    // TODO: FIX
    let { from_coords, destination_coords } = { 
      from_coords: DEFAULT_COORDS, 
      destination_coords: DEFAULT_COORDS,
      // driver_coords: DEFAULT_COORDS
    }
    if (from.coords && destination.coords) {
      from_coords = from.coords
      destination_coords = destination.coords
    }
    // if (driver.latitude && driver.longitude) {
    //   driver_coords = { latitude: driver.latitude + .0002, longitude: driver.longitude }
    // }
    from_coords = { latitude: from_coords.lat, longitude: from_coords.lng }
    destination_coords = { latitude: destination_coords.lat, longitude: destination_coords.lng }
    /** FIX ANDROID LOCATION SERVICE CRASH */

    /* CAR POLYLINE */
    let direction = polyline.length === 0 ? 0 : UtilMath.carDirection(polyline[0].latitude, polyline[0].longitude, polyline[1].latitude, polyline[1].longitude)
    direction += 1
    /* CAR POLYLINE */

    return (
      <View style={{ flex: 1, width }}>
        <AMapView minZoomLevel={5} {...MAP_DEFINE} {...MAP_SETTER}>
          <Marker image={'rn_amap_startpoint'} coordinate={from_coords} />
          <Marker image={'rn_amap_endpoint'} coordinate={destination_coords} />
          <Marker image={`rn_car_${direction}`} coordinate={polyline[0]} />
          <Polyline coordinates={polyline} width={6} color={'#666'} />
        </AMapView>
        {/* <GoogleMap style={{ flex: 1 }}>

        </GoogleMap> */}

        {status === BOOKING_STATUS.PASSGENER_BOOKING_INIT && (<HeaderSection />)}

        {status === BOOKING_STATUS.PASSGENER_BOOKING_INIT && (<MapPin timing={this.pin} />)}

        {
          (
            status === BOOKING_STATUS.PASSGENER_BOOKING_INIT ||
            status === BOOKING_STATUS.PASSGENER_BOOKING_PICKED_ADDRESS
          ) && (<CircleBar init={true} />)
        }

        {status === BOOKING_STATUS.PASSGENER_BOOKING_INIT && (<PickerAddress timing={this.ui} drag={drag} />)}
        {status === BOOKING_STATUS.PASSGENER_BOOKING_PICKED_ADDRESS && (
          <PickerOptions
            showTP={this.state.showTP}
            showSP={this.state.showSP}
            payCancel={()=>this.payCancel()}
            showSelcetPay={()=>this.showSelcetPay()}
            showTimerPicker={()=>this.showTimerPicker()}
            wheelSubmit={(time)=>this.wheelSubmit(time)}
            wheelCancel={(time)=>this.wheelCancel(time)}
          />
        )}
        <ModalDriverRespond />
      </View>
    )
  }
})

const PickerOptions = connect(state => ({ status: state.booking.status, fare: state.booking.fare }))(class PickerOptions extends PureComponent {

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
            <TouchableOpacity onPress={() => this.props.showSelcetPay()}
              activeOpacity={.7} style={{ width: 128, height: 56, borderRadius: 8, backgroundColor: '#1ab2fd', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>现金</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.showTimerPicker()}
              activeOpacity={.7} style={{ width: 128, height: 56, borderRadius: 8, backgroundColor: '#1ab2fd', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>现在</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => {
            this.props.dispatch(booking.passengerSetStatus(BOOKING_STATUS.PASSGENER_BOOKING_WAIT_SERVER_RESPONSE))
          }} activeOpacity={.7} style={{ width: 276, height: 56, borderRadius: 28, backgroundColor: '#ffb639', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>{(this.props.fare === 0) ? '开始' : `开始 - 行程费用 ￥${parseInt(this.props.fare).toFixed(2)}`}</Text>
          </TouchableOpacity>
        </View>
        <TimePicker visible={this.props.showTP}
          wheelSubmit={(time)=>this.props.wheelSubmit(time)}
          wheelCancel={(time)=>this.props.wheelCancel(time)}/>
        <SelectPay visible={this.props.showSP} payCancel={()=>this.props.payCancel()}/>
      </Animated.View>
    )
  }
})

const PickerAddress = connect(state => ({ ...state.booking }))(class PickerAddress extends PureComponent {

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
            <Text ellipsizeMode={'middle'} numberOfLines={1} style={{ marginHorizontal: 48, textAlign: 'center', color: '#333', fontSize: 14, fontWeight: '600' }}>{from.name}</Text>
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
            <Text ellipsizeMode={'middle'} numberOfLines={1} style={{ marginHorizontal: 48, textAlign: 'center', color: destination.name ? '#333' : '#a2a2a2', fontSize: 14, fontWeight: '600', /* PositionFix */ top: -1 }}>{destination.name || '请输入目的地'}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    )
  }
})

class MapPinTip extends PureComponent {
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

class MapPin extends PureComponent {
  render() {
    const { timing } = this.props
    return (
      <View style={{ position: 'absolute', left: (Screen.window.width - 18) / 2 }}>
        <Animated.Image style={[
          { width: 18, height: 28 },
          { top: timing.interpolate({ inputRange: [0, 1], outputRange: [PIN_HEIGHT - 100, PIN_HEIGHT - 104] }) }
        ]} source={Resources.image.pin} />
      </View>
    )
  }
}
