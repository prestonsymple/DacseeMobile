import React, { Component, PureComponent } from 'react'
import {
  Text, View, Animated, StyleSheet, Image, TouchableOpacity,
  DeviceEventEmitter, ListView, Platform, ScrollView, StatusBar
} from 'react-native'
import InteractionManager from 'InteractionManager'
// import { NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'
import Lottie from 'lottie-react-native'
import PropTypes from 'prop-types'

import Resources from '../../resources'
import BaseScreenComponent from '../_base'

import HeaderSection from './booking.header.section'
import BookingSelectCircle from './booking.select.circle'

import { MapView, Search } from '../../native/AMap'
import { Screen, Icons, Define } from '../../utils'
import { application, booking } from '../../redux/actions'
import { Button, SelectCarType } from '../../components'

import ModalSelectAddress from '../../modal/modal.select.address'
import ModalDriverRespond from '../../modal/modal.driver.respond'

// Get Navigator Status
import { HomeNavigator } from '../../app.routes'

const { height, width } = Screen.window

const MAP_DEFINE = {
  showsCompass: false,
  showsScale: false,
  tiltEnabled: false,
  rotateEnabled: false,
  showsTraffic: false,
  showsZoomControls: false, /* android fix */
}

const PIN_HEIGHT = ((height - 20) / 2)
const BOTTOM_MARGIN = Platform.select({
  ios: Define.system.ios.x ? 35 : 5,
  android: 25
}) 

const DEMO_DATA = [
  { value: '朋友圈', title: '朋友圈', key: 'uid-3', image: 'http://img.hb.aicdn.com/c2728cdc04a2b36f76538141de1332d2bc84672372692-Fvgu5H_fw658' },
  { value: 'SUV', title: 'SUV', key: 'suv', image: 'http://img.hb.aicdn.com/9087d7c3ee8a8d6e01e07a12d6ee3d0bb2fbda8656f6b-gdzrdR_fw658' },
  { value: '7座商务', title: '7座商务', key: 'business', image: 'http://img.hb.aicdn.com/9087d7c3ee8a8d6e01e07a12d6ee3d0bb2fbda8656f6b-gdzrdR_fw658' },
  { value: '出租车', title: '出租车', key: 'taxi', image: 'http://img.hb.aicdn.com/1c215f103cbad1fe3ed429776d7fa8b739028df013249-yhmYe2_fw658' },
  { value: '优选', title: '优选', key: 'nearbest', image: 'http://img.hb.aicdn.com/1c215f103cbad1fe3ed429776d7fa8b739028df013249-yhmYe2_fw658' },
  { value: '豪华', title: '豪华', key: 'nearpremium', image: 'http://img.hb.aicdn.com/1c215f103cbad1fe3ed429776d7fa8b739028df013249-yhmYe2_fw658' }
]

// TODO: Optimize the callback
const dataContrast = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

// export default connect(state => ({ data: state.booking })) // TEST
export default connect(state => ({ data: state.booking }))(class MainScreen extends BaseScreenComponent {

  static navigationOptions = ({ navigation }) => {
    return {
      drawerLockMode: 'locked-closed',
      // contentComponent: () => (
      //   <View style={{ backgroundColor: '#333', flex: 1, height: 300, width: 400 }}></View>
      // ),
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

  constructor(props) {
    super(props)

    // TODO: MOVE TO REDUX
    this.state = {
      ready: false,
      editAdr: false,
      field: 'to',
      city: '',
      drag: false,
      defaultData: dataContrast.cloneWithRows([{
        type: 'favorite',
        address: '浦东新区xxx',
        name: '浦东国际机场 T2航站楼'
      }, {
        type: 'favorite',
        address: 'xxx',
        name: '丰盛创建大厦'
      }, {
        type: 'favorite',
        address: 'xxx',
        name: '虹桥机场 T1航站楼'
      }, {
        type: 'history',
        address: 'xxx',
        name: 'PFCC'
      }, {
        type: 'history',
        address: 'xxx',
        name: 'Limrrkokwin,Cyberjaya'
      }, {
        type: 'history',
        address: 'xxx',
        name: 'Raub,Pahang'
      }]),
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

  async componentDidMount() {
    await InteractionManager.runAfterInteractions()
    this.subscription = DeviceEventEmitter.addListener('APPLICATION.LISTEN.EVENT.DRAWER.OPEN', () => this.props.navigation.navigate('DrawerOpen'))
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
    this.subscription && this.subscription.remove()
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

  onKeywordsSearch(keywords) {
    return async () => {
      try {
        const { count, type, pois } = await Search.searchKeywords(keywords, this.state.city)
        const args = pois.map(pipe => ({
          address: pipe.address,
          location: pipe.location,
          name: pipe.name,
          type: 'keywords'
        }))
        this.setState({ data: dataContrast.cloneWithRows(args) })
      } catch (e) {
        // Reject
        return
      }
    }
  }

  onStatusChangeListener({ nativeEvent }) {
    const { longitude, latitude, rotation, zoomLevel, tilt } = nativeEvent
    if (!this.state.drag) {
      this.setState({ drag: true })
      this.props.dispatch(booking.journeyUpdateData({ from: {} }))
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
      this.props.dispatch(booking.journeyUpdateData({ from: address || {} }))
      this.setState({ drag: false })
    } catch (e) {
      return
    }
  }

  onEnterKeywords(keywords) {
    this.timer && clearTimeout(this.timer)
    this.timer = setTimeout(this.onKeywordsSearch(keywords), 400)
  }

  async componentWillReceiveProps(props) {
    const { schedule, to } = props.data

    if (schedule === 1) {
      await new Promise((resolve) => Animated.timing(this.ui, { toValue: 1, duration: 200 }).start(() => resolve()))
    }

    if (schedule === 3) {
      await new Promise((resolve) => Animated.timing(this.ui, { toValue: 2, duration: 200 }).start(() => resolve()))
    }

    if (('location' in to) && (to.address !== this.props.data.to.address) && (to.location.lat !== 0) && (to.location.lng !== 0)) {
      this.props.navigation.navigate('BookingOptions')
    }
  }

  async activeAdrEdit(field) {
    await new Promise((resolve) => Animated.timing(this.ui, { toValue: 1, duration: 200 }).start(() => resolve()))
    this.setState({ editAdr: true, field })
  }

  async cancelAdrEdit() {
    this.setState({ editAdr: false, data: undefined })
    await new Promise((resolve) => Animated.timing(this.ui, { toValue: 0, duration: 200 }).start(() => resolve()))
  }

  async onSelectAddress(address, field) {
    this.props.dispatch(booking.journeyUpdateData({ [field]: address }))
    this.setState({ editAdr: false, data: undefined })
    await new Promise((resolve) => Animated.timing(this.ui, { toValue: 0, duration: 200 }).start(() => resolve()))
  }

  changeFormAnimated(value, duration = 200) {
    return new Promise((resolve) => Animated.timing(this.form, { toValue: value, duration }).start(() => resolve()))
  }

  render() {
    const { editAdr, drag, defaultData, data, field, carArgs } = this.state
    const { schedule, type } = this.props.data

    return (
      <View style={{ flex: 1 }}>
        <StatusBar animated={true} hidden={false} backgroundColor={'#1ab2fd'} barStyle={'light-content'} />
        <MapView
          {...MAP_DEFINE}
          style={{ flex: 1 }}
          locationEnabled={true}
          mapType={'standard'}
          locationInterval={1000}
          locationStyle={{

          }}
          onStatusChange={this.onStatusChangeListener.bind(this)}
          onLocation={this.onLocationListener.bind(this)}
          ref={e => this.map = e}>
        </MapView>

        <HeaderSection type={this.props.data.type} dispatch={this.props.dispatch} />

        <MapPin timing={this.pin} />
        <MapPinTip timing={this.board} />

        <BookingSelectCircle />

        <PickerAddress
          timing={this.ui} drag={drag} to={this.props.data.to} from={this.props.data.from}
          onPressTo={() => this.activeAdrEdit('to')}
          onPressFrom={() => this.activeAdrEdit('from')}
        />

        {/* Modal - Where u? */}
        <ModalSelectAddress
          onPressCancel={() => this.cancelAdrEdit()}
          onSelectAddress={(props, field) => this.onSelectAddress(props, field)}
          onRequestClose={() => { }}
          onChangeKeywords={this.onEnterKeywords.bind(this)}
          field={field}
          animationType={'slide'}
          transparent={false}
          visible={editAdr}
          defaultData={defaultData}
          data={data}
        />
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

class PickerAddress extends Component {

  static propTypes = {
    timing: PropTypes.any,
    onPressTo: PropTypes.func,
    onPressFrom: PropTypes.func,
    drag: PropTypes.bool,
    from: PropTypes.object,
    to: PropTypes.object
  }

  constructor(props) {
    super(props)
    this.animated = new Animated.Value(0)
  }

  componentWillReceiveProps(props) {
    if (props.drag) {
      Animated.loop(Animated.timing(this.animated, { toValue: 1, duration: 800, useNativeDriver: true })).start()
    }
    if (props.from.name) {
      this.animated.stopAnimation()
    }
  }

  render() {
    const {
      timing,
      onPressTo,
      onPressFrom,
      drag,
      from,
      to
    } = this.props

    return (
      <Animated.View style={[
        { position: 'absolute', left: 0, right: 0, bottom: 0, height: Define.system.ios.x ? 142 : 120, justifyContent: 'center' },
        { shadowOffset: { width: 0, height: 2 }, shadowColor: '#999', shadowOpacity: .5 },
        { backgroundColor: 'white', paddingBottom: Define.system.ios.x ? 22 : 0, paddingHorizontal: 23 },
        { borderTopLeftRadius: 28, borderTopRightRadius: 28 }
      ]}>
        <View style={{ height: 79 }}>
          {/* From */}
          <TouchableOpacity onPress={drag ? () => { } : onPressFrom} activeOpacity={0.7} style={{ flex: 1, height: 44, justifyContent: 'center' }}>
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
          <TouchableOpacity onPress={onPressTo} activeOpacity={0.7} style={{ flex: 1, height: 44, justifyContent: 'center' }}>
            <View style={{ backgroundColor: '#7ED321', height: 10, width: 10, borderRadius: 5, position: 'absolute', left: 20 }} />
            <Text numberOfLines={1} style={{ marginHorizontal: 48, textAlign: 'center', color: to.name ? '#333' : '#a2a2a2', fontSize: 14, fontWeight: '600', /* PositionFix */ top: -1 }}>{to.name || '请输入目的地'}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    )
  }
}

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
          { top: timing.interpolate({ inputRange: [0, 1], outputRange: [PIN_HEIGHT - 48, PIN_HEIGHT - 52] }) }
        ]} source={Resources.image.pin} />
      </View>
    )
  }
}

class MoveToCurrentLocation extends Component {
  render() {
    // const { } = this.props
    return (
      <Animated.View style={[
        { width: 36, height: 36, backgroundColor: 'white', position: 'absolute', right: 15, borderRadius: 3, borderColor: '#ccc', borderWidth: Screen.window.width <= 375 ? .5 : 1 },
        { shadowOffset: { width: 0, height: 2 }, shadowColor: '#666', shadowOpacity: .3, shadowRadius: 3 },
        { justifyContent: 'center', alignItems: 'center' },
        { top: this.form.interpolate({ inputRange: [0, 1], outputRange: [Screen.window.height - 155 - 64 - 15 - 19 - BOTTOM_MARGIN, Screen.window.height - 135 - 64 - 15 - 89 - BOTTOM_MARGIN] }) },
        { opacity: this.ui.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }
      ]}>
        {Icons.Generator.Material('my-location', 22, '#666')}
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  SelectBookingWrap: Platform.select({
    ios: { position: 'absolute', left: 15, right: 15, backgroundColor: 'white', borderRadius: 3 },
    android: { position: 'absolute', left: 15, right: 15, backgroundColor: 'white', borderRadius: 3, borderColor: '#ccc', borderWidth: .8 }
  }),
  PickAddressWrap: Platform.select({
    ios: { position: 'absolute', bottom: Define.system.ios.x ? 45 : 30, left: 15, right: 15, height: 89, backgroundColor: 'white', borderRadius: 3 },
    android: { position: 'absolute', bottom: 15, left: 15, right: 15, height: 89, backgroundColor: 'white', borderRadius: 3, borderColor: '#ccc', borderWidth: .6 }
  })
})