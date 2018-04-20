/* global navigator */

import React, { Component, PureComponent } from 'react'
import { Text, View, Animated, TouchableOpacity, ActivityIndicator, Linking,StyleSheet, Image } from 'react-native'
import InteractionManager from 'InteractionManager'
import { NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'
import Lottie from 'lottie-react-native'
import axios from 'axios'
import moment from 'moment'
import Resources from '../../../resources'
import ModalDriverRespond from './passenger.modal.wait.driver'

import HeaderSection from '../components/navigator.header.selector'
import CircleBar from '../components/circle.bar'

import { MapView as AMapView, Marker as AMarker, Polyline as APolyline } from '../../../native/AMap'
import GoogleMapView, { Marker as GoogleMarker, Polyline as GooglePolyline } from 'react-native-maps'
import { Screen, Icons, Define, Session, UtilMath, TextFont } from '../../../utils'
import { booking, account, application } from '../../../redux/actions'
import { BOOKING_STATUS } from '..'
import TimePicker from '../../../components/timePicker'
import SelectPay from '../../../components/selectPay'
const { height, width } = Screen.window

const DEFAULT_COORDS = { lat: 84.764846, lng: 44.138130, latitude: 84.764846, longitude: 44.138130 }

const PIN_HEIGHT = ((height - 22) / 2)

export default connect(state => ({
  ...state.booking,
  country: state.account.country,
  booking_id: state.storage.booking_id,
  map_mode: state.application.map_mode,
  vehicleGroups: state.booking.vehicleGroups,
  friends_location: state.circle.friends_location,
  location: state.account.location,
  i18n: state.intl.messages
}))(class PassengerComponent extends Component {

  constructor(props) {
    super(props)
    this.state = {
      drag: false,
      timePickerShow: false,
      selectPayShow: false,
      routeBounds: {}, routeCenterPoint: {}, routeLength: 0, routeNaviPoint: [], routeTime: 0, routeTollCost: 0,
      polyline: [],

    }
    this.timer = null
    this.pin = new Animated.Value(0)
    this.board = new Animated.Value(0)
    this.ui = new Animated.Value(0)
    this.form = new Animated.Value(0)

    this.count = 0

    this.ready = false
    this.geoWatch = undefined
  }

  async componentWillReceiveProps(props) {
    const { map_mode } = props

    if (props.status === BOOKING_STATUS.PASSGENER_BOOKING_INIT && this.props.map_mode !== map_mode && map_mode === 'GOOGLEMAP') {
      this.geoWatch = navigator.geolocation.watchPosition(this.geoWatchFunction.bind(this), (e) => console.log(e), { timeout: 1000 })
    }

    if (props.status === BOOKING_STATUS.PASSGENER_BOOKING_INIT && this.props.map_mode !== map_mode && map_mode === 'AMAP') {
      this.geoWatch && navigator.geolocation.clearWatch(this.geoWatch)
      this.geoWatch = undefined
    }

    // 选择地址时，如果为手动输入起点的位置，将地图中心点移动到新的起点
    if (props.status === BOOKING_STATUS.PASSGENER_BOOKING_INIT && props.from.coords !== this.props.from.coords) {
      try {
        const prevCoords = this.props.from.coords
        const nextCoords = props.from.coords
        if (!prevCoords.lng || !prevCoords.lat) throw new Error()
        // const distance = UtilMath.distance(prevCoords.lng, prevCoords.lat, nextCoords.lng, nextCoords.lat)
        if (this.map.animateTo) {
          this.map.animateTo({ zoomLevel: 16, coordinate: { latitude: nextCoords.lat, longitude: nextCoords.lng } }, 500)
        } else {
          let region = Object.assign({}, { latitude: nextCoords.lat, longitude: nextCoords.lng }, { latitudeDelta: 0.025, longitudeDelta: 0.025 * (width / height) })
          this.map.animateToRegion(region, 500)
        }
      } catch (e) {/* */}
    }

    if (props.status === BOOKING_STATUS.PASSGENER_BOOKING_INIT && this.props.status !== props.status) {
      const { lat, lng } = props.from.coords
      if (this.map.animateTo) {
        this.map.animateTo({ zoomLevel: 16, coordinate: { latitude: lat, longitude: lng } }, 500)
      } else {
        let region = Object.assign({}, { latitude: lat, longitude: lng }, { latitudeDelta: 0.5, longitudeDelta: 0.5 * (width / height) })
        this.map.animateToRegion(region, 500)
      }
      this.setState({ polyline: [] })
    }

    if (props.status === BOOKING_STATUS.PASSGENER_BOOKING_PICKED_ADDRESS && this.props.status !== props.status) {
      const { destination, from } = props

      const mLat = ((from.coords.lat + destination.coords.lat) / 2) - 0.035
      const mLng = ((from.coords.lng + destination.coords.lng) / 2)

      const distance = UtilMath.distance(from.coords.lng, from.coords.lat, destination.coords.lng, destination.coords.lat)

      if (this.map.animateTo) {
        const zoom = this.mathDistanceZoom(distance)
        this.map.animateTo({ zoomLevel: zoom, coordinate: { latitude: mLat, longitude: mLng } }, 500)
      } else {
        let region = Object.assign({}, { latitude: mLat, longitude: mLng }, { latitudeDelta: 0.5, longitudeDelta: 0.5 * (width / height) })
        this.map.animateToRegion(region, 500)
      }

      const vehicleGroupsId = props.vehicleGroups.find(pipe => pipe.name === 'My Circle' || pipe.name === '朋友圈')._id
      const { fare } = await Session.Booking.Get(`v1/fares?from_lat=${from.coords.lat}&from_lng=${from.coords.lng}&destination_lat=${destination.coords.lat}&destination_lng=${destination.coords.lng}&vehicle_group_id=${vehicleGroupsId}`)
      const amount = fare.find(pipe => pipe.name === 'My Circle' || pipe.name === '朋友圈').amount
      this.props.dispatch(booking.passengerSetValue({ fare: amount }))
      this.setState({ polyline: [] })
    }

    if (props.status === BOOKING_STATUS.PASSGENER_BOOKING_DRIVER_ON_THE_WAY && props.driver !== this.props.driver && ('latitude' in props.driver)) {
      const { driver, from } = props
      const driverCoords = [parseFloat(driver.longitude.toFixed(6)), parseFloat(driver.latitude.toFixed(6))]
      const passengerCoords = [from.coords.lng, from.coords.lat]
      
      if (passengerCoords[0] === 0 || passengerCoords[1] === 0.05) return

      if (this.map.animateTo) {
        const { data } = await Session.Lookup_CN.Get(`v1/map/calculate/route/polyline/${driverCoords.join(',')}/${passengerCoords.join(',')}`)
        const lnglat = data.map(pipe => {
          const coords = pipe.split(',')
          return { longitude: parseFloat(coords[0]), latitude: parseFloat(coords[1]) }
        })
        this.setState({ polyline: lnglat }) // 更新路径，30s刷新一次
        this.map.animateTo({ zoomLevel: 15, coordinate: { latitude: driverCoords[1], longitude: driverCoords[0] } }, 500)
      } else {
        this.map.animateToCoordinate({ latitude: driverCoords[1], longitude: driverCoords[0] }, 500)
      }
    }

    if (props.status === BOOKING_STATUS.PASSGENER_BOOKING_DRIVER_ARRIVED && this.props.status !== props.status) {
      this.setState({ polyline: [] })
    }

    if (props.status === BOOKING_STATUS.PASSGENER_BOOKING_ON_BOARD && props.driver !== this.props.driver && ('latitude' in props.driver)) {
      const { driver, destination } = props
      const driverCoords = [parseFloat(driver.longitude.toFixed(6)), parseFloat(driver.latitude.toFixed(6))]
      const destinationCoords = [destination.coords.lng, destination.coords.lat]

      if (this.map.animateTo) {
        const { data } = await Session.Lookup_CN.Get(`v1/map/calculate/route/polyline/${driverCoords.join(',')}/${destinationCoords.join(',')}`)
        const lnglat = data.map(pipe => {
          const coords = pipe.split(',')
          return { longitude: parseFloat(coords[0]), latitude: parseFloat(coords[1]) }
        })
        this.setState({ polyline: lnglat }) // 更新路径，30s刷新一次
        this.map.animateTo({ zoomLevel: 16, coordinate: { latitude: driverCoords[1], longitude: driverCoords[0] } }, 500)
      } else {
        this.map.animateToCoordinate({ latitude: driverCoords[1], longitude: driverCoords[0] }, 500)
      }
    }

    if (props.status === BOOKING_STATUS.PASSGENER_BOOKING_HAVE_COMPLETE && this.props.status !== props.status) {
      this.setState({ polyline: [] })
    }
  }

  async componentDidMount() {
    await InteractionManager.runAfterInteractions()

    if (!this.props.booking_id) {
      this.props.dispatch(booking.passengerSetStatus(BOOKING_STATUS.PASSGENER_BOOKING_INIT))
    }

    if (this.props.status === BOOKING_STATUS.PASSGENER_BOOKING_INIT && this.props.map_mode === 'GOOGLEMAP') {
      this.geoWatch = navigator.geolocation.watchPosition(this.geoWatchFunction.bind(this), (e) => console.log(e), { timeout: 1000 })
    }
  }

  geoWatchFunction(position) {
    const { coords: { latitude, longitude } } = position
    this.onLocationListener({ nativeEvent: { latitude, longitude } })
  }

  componentWillUnmount() {
    this.geoWatch && navigator.geolocation.clearWatch(this.geoWatch)
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
    const {
      latitude = nativeEvent.coordinate.latitude,
      longitude = nativeEvent.coordinate.longitude
    } = nativeEvent

    if (latitude === 0 || longitude === 0) return
    if (!this.ready && this.props.map_mode.length > 0) {
      await InteractionManager.runAfterInteractions()
      if (this.map.animateTo) {
        this.map.animateTo({ zoomLevel: 16, coordinate: { latitude, longitude } }, 500)
      } else {
        this.onStatusChangeListener({ nativeEvent: { longitude, latitude } })
      }
      this.ready = true
    }
    this.props.dispatch(account.updateLocation({ lat: latitude, lng: longitude, latitude, longitude }))
    // try {
    //   await Session.Location.Put('v1', { latitude, longitude })
    // } catch (e) { /**/ }
  }


  onMapDragEvent() {
  }

  onMapLocationEvent() {
    
  }


  onStatusChangeListener(region) {
    const { nativeEvent = {} } = region
    const {
      longitude = region.longitude,
      latitude = region.latitude,
      zoomLevel
    } = nativeEvent

    if (this.props.status >= BOOKING_STATUS.PASSGENER_BOOKING_PICKED_ADDRESS) return
    let _longitude = longitude
    let _latitude = latitude

    if (zoomLevel) {
      /* Fix Offset */
      const OFFSET_RANGE = [1.5, .8, .4, .2, .1, .05, .025, .0125, .00625, .003125, .0015625, .00078125, .000390625, .0001953125, .00009765625]
      const maxValue = OFFSET_RANGE[Math.floor(zoomLevel) - 5]
      const minValue = OFFSET_RANGE[Math.ceil(zoomLevel) - 5]

      const dValue = maxValue - (maxValue - minValue) * (zoomLevel % 1)
      _latitude = latitude + dValue
      /* Fix Offset */
    }

    if (!this.state.drag) {
      this.setState({ drag: true })
      this.props.dispatch(booking.passengerSetValue({ from: {} }))
      Animated.spring(this.pin, { toValue: 1, friction: 1.5 }).start()
      Animated.timing(this.board, { toValue: 1, duration: 100 }).start()
    }
    this.timer && clearTimeout(this.timer)
    this.timer = setTimeout(() => this.onLocationSearch(_longitude, _latitude), 1000)
  }

  async onLocationSearch(longitude, latitude) {
    try {
      Animated.timing(this.pin, { toValue: 0, duration: 200 }).start()
      Animated.timing(this.board, { toValue: 0, duration: 200 }).start()

      let place = {}
      if (this.props.map_mode === 'GOOGLEMAP') {
        // TODO: 不要动 - 仅马来西亚测试用，API会上移至服务端
        const { data: { results } } = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyA5BPIUMN2CkQq9dpgzBr6XYOAtSdHsYb0`)
        const { formatted_address = '', address_components, place_id, geometry } = results[0]

        const street_number = address_components.find(pipe => pipe.types.find(sub => sub === 'street_number')) || { long_name: '' }
        const political = address_components.find(pipe => pipe.types.find(sub => sub === 'political')) || { long_name: '' }
        const route = address_components.find(pipe => pipe.types.find(sub => sub === 'route')) || { long_name: '' }
        const combine_name = `${street_number.long_name} ${route.long_name} ${political.long_name}`.trim()

        if (combine_name.length === 0) {
          throw new Error('UNKNOW_GEO')
        }
        place = {
          placeId: place_id,
          coords: {
            lng: geometry.location.lng,
            lat: geometry.location.lat
          },
          name: combine_name,
          address: formatted_address
        }
      } else {
        if (latitude < 1 && longitude < 1) throw new Error()
        const resp = await Session.Lookup_CN.Get(`v1/map/search/geo/${latitude},${longitude}`)
        place = resp.data
      }

      this.props.dispatch(booking.passengerSetValue({ from: place || {} }))
    } catch (e) {
      this.props.dispatch(booking.passengerSetValue({
        from: { address: '自定义位置', name: this.props.i18n.location, coords: { lng: longitude, lat: latitude } }
      }))
    } finally {
      this.setState({ drag: false })
    }
  }

  render() {
    const { drag, polyline } = this.state
    const { status, from, destination, map_mode, location, driver_info, friends_location } = this.props
    
    const MAP_SETTER = {
      /* A MAP */
      tiltEnabled: false,
      showsTraffic: false,
      showsZoomControls: false, /* android fix */
      mapType: 'standard',
      locationEnabled: true, // TODO: REDUX
      locationInterval: 1000,
      onLocation: this.onLocationListener.bind(this),

      /* GOOGLE MAPS */
      pitchEnabled: false,
      provider: 'google',
      showsMyLocationButton: false,
      initialRegion: {
        latitude: location.lat, longitude: location.lng,
        latitudeDelta: 0.005, longitudeDelta: 0.005 * (width / height)
      },

      /* GLOBAL */
      minZoomLevel: 4,
      showsScale: false,
      showsCompass: false,
      rotateEnabled: false,
      ref: (e) => this.map = e
    }

    if (status === BOOKING_STATUS.PASSGENER_BOOKING_INIT) {
      MAP_SETTER.showsUserLocation = true
      MAP_SETTER.onStatusChange = this.onStatusChangeListener.bind(this)
      MAP_SETTER.onRegionChange = this.onStatusChangeListener.bind(this)
    } else {
      MAP_SETTER.onStatusChange = null
      MAP_SETTER.onRegionChange = null
    }

    /** FIX ANDROID LOCATION SERVICE CRASH */

    // TODO: FIX
    let { from_coords, destination_coords } = {
      from_coords: DEFAULT_COORDS,
      destination_coords: DEFAULT_COORDS
    }
    if (from.coords && destination.coords) {
      from_coords = from.coords
      destination_coords = destination.coords
    }
    // if (driver.latitude && driver.longitude) {
    //   driver_coords = { latitude: driver.latitude + .0002, longitude: driver.longitude }
    // }
    from_coords = { latitude: parseFloat(from_coords.lat), longitude: parseFloat(from_coords.lng) }
    destination_coords = { latitude: destination_coords.lat, longitude: destination_coords.lng }
    /** FIX ANDROID LOCATION SERVICE CRASH */

    /* CAR POLYLINE */
    let _polyline = polyline.length === 0 ? [DEFAULT_COORDS, DEFAULT_COORDS] : polyline
    let direction = _polyline.length === 0 ? 0 : UtilMath.carDirection(_polyline[0].latitude, _polyline[0].longitude, _polyline[1].latitude, _polyline[1].longitude)
    direction += 1
    /* CAR POLYLINE */

    return (
      <View style={{
        flex: 1, width
      }}>
        {
          map_mode === '' && (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="small" color="#333" style={{ top: -64 }} />
            </View>
          )
        }
        {
          map_mode === 'AMAP' && (
            <AMapView style={{ flex: 1 }} {...MAP_SETTER}>
              <AMarker image={'rn_amap_startpoint'} coordinate={from_coords} />
              <AMarker image={'rn_amap_endpoint'} coordinate={destination_coords} />
              <AMarker image={`rn_car_${direction}`} coordinate={_polyline[0]} />
              <APolyline coordinates={_polyline} width={6} color={'#666'} />
              {
                friends_location.length > 0 && (
                  friends_location.map((pipe, index) => (
                    <AMarker key={index} image={'rn_car_rookie'} coordinate={{ latitude: pipe.latitude, longitude: pipe.longitude }} />
                  ))
                )
              }
            </AMapView>
          )
        }
        {
          map_mode === 'GOOGLEMAP' && (
            <GoogleMapView style={{ flex: 1 }} {...MAP_SETTER}>
              <GoogleMarker coordinate={from_coords}>
                <Image source={Resources.image.map_from_pin} />
              </GoogleMarker>
              <GoogleMarker coordinate={destination_coords}>
                <Image source={Resources.image.map_destination_pin} />
              </GoogleMarker>
              <GoogleMarker coordinate={_polyline[0]}>
                <Image source={Resources.image.map_car_pin} />
              </GoogleMarker>
              <GooglePolyline coordinates={_polyline} width={6} color={'#666'} />
              {
                friends_location.length > 0 && (
                  friends_location.map((pipe, index) => (
                    <GoogleMarker key={index} coordinate={{ latitude: pipe.latitude, longitude: pipe.longitude }}>
                      <Image source={Resources.image.car_rookie} />
                    </GoogleMarker>
                  ))
                )
              }
            </GoogleMapView>
          )
        }

        {status === BOOKING_STATUS.PASSGENER_BOOKING_INIT && (<HeaderSection />)}

        {
          (
            status === BOOKING_STATUS.PASSGENER_BOOKING_INIT &&
            map_mode.length > 0
          ) && (<MapPin timing={this.pin} />)
        }

        {
          (
            status === BOOKING_STATUS.PASSGENER_BOOKING_INIT ||
            status === BOOKING_STATUS.PASSGENER_BOOKING_PICKED_ADDRESS
          ) && (<CircleBar init={true} />)
        }

        {status === BOOKING_STATUS.PASSGENER_BOOKING_INIT && (<PickerAddress timing={this.ui} drag={drag} />)}
        {status === BOOKING_STATUS.PASSGENER_BOOKING_PICKED_ADDRESS && (
          <PickerOptions
            selectPayShow={this.state.selectPayShow}
            timePickerShow={this.state.timePickerShow}
            showSelcetPay={() => this.setState({ selectPayShow: true })}
            showTimerPicker={() => this.setState({ timePickerShow: true })}
            payChange={(pay) => this.payChange(pay)}
            dateChange={(time) => this.dateChange(time)}
          />
        )}

        {status >= BOOKING_STATUS.PASSGENER_BOOKING_DRIVER_ON_THE_WAY && (
          <BookingDetailView status={status} onPress={async () => {
            try {
              await Session.Booking.Put(`v1/${this.props.booking_id}`, { action: 'cancel' })
              this.props.dispatch(booking.passengerSetStatus(BOOKING_STATUS.PASSGENER_BOOKING_PICKED_ADDRESS))
            } catch(e) {
              this.props.dispatch(application.showMessage('无法连接到服务器'))
            }
          }} driver={driver_info} i18n={this.props.i18n} />
        )}
        <ModalDriverRespond />
      </View>
    )
  }
})

const PickerOptions = connect(state => ({ status: state.booking.status, fare: state.booking.fare, i18n: state.intl.messages }))(class PickerOptions extends PureComponent {

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
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>{this.props.i18n.cash}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.showTimerPicker()}
              activeOpacity={.7} style={{ width: 128, height: 56, borderRadius: 8, backgroundColor: '#1ab2fd', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>{this.props.i18n.now}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => {
            this.props.dispatch(booking.passengerSetStatus(BOOKING_STATUS.PASSGENER_BOOKING_WAIT_SERVER_RESPONSE))
          }} activeOpacity={.7} style={{ width: 276, height: 56, borderRadius: 28, backgroundColor: '#ffb639', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>{(this.props.fare === 0) ? this.props.i18n.start : `${this.props.i18n.start} - ${this.props.i18n.start.startsWith('Start') ? 'RM ' : '行程费用 ￥'}${parseInt(this.props.fare).toFixed(2)}`}</Text>
          </TouchableOpacity>
        </View>
        <TimePicker visible={this.props.timePickerShow}
          i18n={this.props.i18n}
          dateChange={(time) => this.props.dateChange(time)} />
        <SelectPay visible={this.props.selectPayShow} i18n={this.props.i18n} payChange={(pay) => this.props.payChange(pay)} />
      </Animated.View>
    )
  }
})

const PickerAddress = connect(state => ({ ...state.booking,i18n: state.intl.messages}))(class PickerAddress extends PureComponent {

  constructor(props) {
    super(props)
    this.animated = new Animated.Value(0)
  }

  componentWillReceiveProps(props) {
    if (props.drag) { Animated.loop(Animated.timing(this.animated, { toValue: 1, duration: 800, useNativeDriver: true })).start() }
    if (props.from.name) { this.animated.stopAnimation() }
  }

  render() {
    const { drag, from, destination,i18n} = this.props

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
            <Text ellipsizeMode={'middle'} numberOfLines={1} style={{ marginHorizontal: 48, textAlign: 'center', color: destination.name ? '#333' : '#a2a2a2', fontSize: 14, fontWeight: '600', /* PositionFix */ top: -1 }}>{destination.name || i18n.pls_enter_destination}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    )
  }
})

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
/**
 * @desc bookingDetail 详情View
 */
const BookingDetailView = (props) => {
  const { onPress = () => {}, driver, i18n, status } = props

  return (
    <View style={{ backgroundColor: 'transparent', height: 294 }}>
      <BookingDetailHeaderView driver={driver} />
      <DrvierCarDetail car_info={''}/>
      <View style={{ backgroundColor: '#fff', alignItems: 'center', paddingBottom: 22, height: Define.system.ios.x ? 60 + 22 : 60 }}>
        <TouchableOpacity 
          activeOpacity={status >= BOOKING_STATUS.PASSGENER_BOOKING_ON_BOARD ? 1 : .7} 
          onPress={status >= BOOKING_STATUS.PASSGENER_BOOKING_ON_BOARD ? () => {} : onPress} 
          style={{ backgroundColor: status >= BOOKING_STATUS.PASSGENER_BOOKING_ON_BOARD ? '#999' : 'red', borderRadius: 6, marginTop: 8, height: 44, width: width - 40, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ color: '#fff', fontSize: TextFont.TextSize(16) }}>{i18n.cancel_trip}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

/**
 * @desc bookingDetail 顶部View，用户信息，拨打电话，发送短信
 */
const BookingDetailHeaderView = (props) => {
  const { driver } = props
  const { phoneNo, phoneCountryCode, fullName, avatars = [{
    url: 'https://storage.googleapis.com/dacsee-service-user/_shared/default-profile.jpg'
  }] } = driver

  return (
    <View style={{
      height: 80, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopLeftRadius: 20, borderTopRightRadius: 20,
      backgroundColor: 'white'
    }}>
      <View style={{ flexDirection: 'row' }}>
        <Image
          source={{ uri: avatars[avatars.length - 1].url }}
          style={{ width: 54, height: 54, borderRadius: 27, marginLeft: 14 }} />
        <View style={{ justifyContent: 'center' }}>
          <Text style={{ marginLeft: 10, marginTop: 5, fontSize: TextFont.TextSize(17), color: '#000', fontWeight: 'bold' }}>{fullName}</Text>
          {/* <Text style={{ marginLeft: 10, marginTop: 2, fontSize: TextFont.TextSize(14), color: 'rgba(0, 0, 0, 0.5)' }}>{`User ID: ${userId}`}</Text> */}
        </View>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <BookingDetailButton style={{ marginRight: 10, }} onPress={() => Linking.openURL(`sms:${phoneCountryCode}${phoneNo}`)}>
          <View>{Icons.Generator.Awesome('comment', 24, '#666')}</View>
        </BookingDetailButton>
        <BookingDetailButton style={{ marginRight: 10, }} onPress={() => Linking.openURL(`tel:${phoneCountryCode}${phoneNo}`)}>
          <View>{Icons.Generator.Material('phone-in-talk', 24, '#666')}</View>
        </BookingDetailButton>
      </View>
    </View>
  )
}
/**
 * @desc bookingDetailButton 按钮
 */
const BookingDetailButton = (props) => {
  const { onPress, style, children } = props
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[{ backgroundColor: '#eee', width: 46, height: 46, borderRadius: 23, justifyContent: 'center', alignItems: 'center' }, style]}>
      {children}
    </TouchableOpacity>
  )
}
/**
 * @desc DrvierCarDetail 车详情
 */
const DrvierCarDetail = (props) => {
  const { ...car_info } = props.car_info
  return (
    <View style={{ backgroundColor: 'white', flexDirection: 'row', flex: 1, paddingHorizontal: 20, alignItems: 'center' }}>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={{ color: '#333', fontSize: TextFont.TextSize(15), marginVertical: 5 }}>{'Standard'}</Text>
        {/* <Text style={styles.car_cell}>{'沪A-98556656'}</Text>
        <Text style={styles.car_cell}>{'颜色-白色'}</Text>
        <Text style={styles.car_cell}>{'豪华跑车'}</Text> */}
      </View>
      <Image style={{ flex: 1 }} source={Resources.image.slice_adv_car} />
    </View>
  )
}
const styles = StyleSheet.create({
  car_cell:{
    color: '#9e9e9e', fontSize: TextFont.TextSize(15), marginBottom: 5
  }
})
