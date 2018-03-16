import React, { Component, PureComponent } from 'react'
import {
  Text, View, Animated, StyleSheet, Image, TouchableOpacity,
  DeviceEventEmitter, ListView, Platform, ScrollView, StatusBar
} from 'react-native'
import InteractionManager from 'InteractionManager'
import { NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'
import Lottie from 'lottie-react-native'

import Resources from '../../resources'
import BaseScreenComponent from '../_base'

import HeaderSection from './booking.header.section'
import BookingSelectCircle from './booking.select.circle'
import BookingNavigationBarSwipe from './booking.navigation.bar.swipe'

import { MapView, Search, Marker } from '../../native/AMap'
import { Screen, Icons, Define } from '../../utils'
import { application, booking } from '../../redux/actions'
import { Button, SelectCarType } from '../../components'
import { JobsListScreen } from '../jobs'
import { BOOKING_STATUS } from '.';

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
export default connect(state => ({}))(class MainScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      drawerLockMode: 'locked-closed',
      headerStyle: {
        backgroundColor: '#1AB2FD',
        shadowColor: 'transparent',
        shadowOpacity: 0,
        borderBottomWidth: 0,
        borderBottomColor: 'transparent',
        elevation: 0,
      },
      headerLeft: (
        <TouchableOpacity
          activeOpacity={0.7}
          style={{ top: 1, width: 54, paddingLeft: 8, justifyContent: 'center', alignItems: 'flex-start' }}
          onPress={() => DeviceEventEmitter.emit('APPLICATION.LISTEN.EVENT.DRAWER.OPEN')}
        >
          {Icons.Generator.Octicons('three-bars', 23, 'white', { style: { left: 8 } })}
        </TouchableOpacity>
      ),
      title: 'DACSEE'
    }
  }

  async componentDidMount() {
    await InteractionManager.runAfterInteractions()
    this.subscription = DeviceEventEmitter.addListener('APPLICATION.LISTEN.EVENT.DRAWER.OPEN', () => this.props.navigation.navigate('DrawerOpen'))
  }

  componentWillUnmount() {
    this.subscription && this.subscription.remove()
  }

  async componentWillReceiveProps(props) { }

  render() {
    return (
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

  componentDidMount() { this.scrollView.scrollTo({ x: this.props.core_mode === 'driver' ? 0 : width, animated: false }) }

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

const PassengerComponent = connect(state => ({ data: state.booking }))(class PassengerComponent extends Component {

  constructor(props) {
    super(props)
    this.state = {
      ready: false,
      editAdr: false,
      drag: false,
      data: undefined,
      carArgs: []
    }
    this.currentLoc = {}
    this.timer = null
    this.pin = new Animated.Value(0)
    this.board = new Animated.Value(0)
    this.ui = new Animated.Value(0)
    this.form = new Animated.Value(0)

    this.count = 0
  }

  async onLocationListener({ nativeEvent }) {
    const { latitude, longitude } = nativeEvent
    if (latitude === 0 || longitude === 0) return
    if (!this.state.ready) {
      await InteractionManager.runAfterInteractions()
      this.map.animateTo({ zoomLevel: 16, coordinate: { latitude, longitude } }, 500)
      this.setState({ ready: true })
    }
    this.currentLoc = { latitude, longitude }
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
      const { count, type, pois } = await Search.searchLocation(longitude, latitude)

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
    const { editAdr, drag, defaultData } = this.state

    const MAP_SETTER = {
      style: { flex: 1 },
      locationEnabled: true,
      mapType: 'standard',
      locationInterval: 1000,
      onStatusChange: this.onStatusChangeListener.bind(this),
      onLocation: this.onLocationListener.bind(this),
      ref: (e) => this.map = e
    }

    return (
      <View style={{ flex: 1, width }}>
        <MapView {...MAP_DEFINE} {...MAP_SETTER}>
          {/* TODO */}
        </MapView>

        <HeaderSection />

        <MapPin timing={this.pin} />
        <MapPinTip timing={this.board} />

        <BookingSelectCircle init={true} />

        <PickerAddress timing={this.ui} drag={drag} />
      </View>
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