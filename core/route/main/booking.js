import React, { Component, PureComponent } from 'react'
import { 
  Text, View, Animated, StyleSheet, StatusBar, Image, TouchableOpacity, TouchableHighlight, 
  DeviceEventEmitter, TextInput, Easing, ListView, ScrollView
} from 'react-native'
import InteractionManager from 'InteractionManager'
import { NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'

import { MapView, Marker, Polyline, Utils } from '../../native/AMap'
import { Screen, Icons, Redux, Define } from '../../utils'
import Resources from '../../resources'
import { application, booking } from '../../redux/actions'
import ModalSelectAddress from '../../modal/modal.select.address'
import ModalDriverRespond from '../../modal/modal.driver.respond'
import { Button, SelectCarType } from '../../components'

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
const BOTTOM_MARGIN = Define.system.ios.x ? 35 : 5

const DEMO_DATA = [[
  { value: 'SUV', title: 'SUV', key: 'suv', image: 'http://img.hb.aicdn.com/9087d7c3ee8a8d6e01e07a12d6ee3d0bb2fbda8656f6b-gdzrdR_fw658' },
  { value: '7座商务', title: '7座商务', key: 'business', image: 'http://img.hb.aicdn.com/9087d7c3ee8a8d6e01e07a12d6ee3d0bb2fbda8656f6b-gdzrdR_fw658' },
], [
  { value: '出租车', title: '出租车', key: 'taxi', image: 'http://img.hb.aicdn.com/1c215f103cbad1fe3ed429776d7fa8b739028df013249-yhmYe2_fw658' },
  { value: '优选', title: '优选', key: 'nearbest', image: 'http://img.hb.aicdn.com/1c215f103cbad1fe3ed429776d7fa8b739028df013249-yhmYe2_fw658' },
  { value: '豪华', title: '豪华', key: 'nearpremium', image: 'http://img.hb.aicdn.com/1c215f103cbad1fe3ed429776d7fa8b739028df013249-yhmYe2_fw658' }
], [
  { value: '朋友-Vito', title: 'Vito', key: 'uid-1', image: 'http://img.hb.aicdn.com/0bd774bc66f9719a438efaa3cbe11cf21d21ce93166f7-wBCvyo_fw658' },
  { value: '朋友-San', title: 'San', key: 'uid-2', image: 'http://img.hb.aicdn.com/219be644fe1a95fc979fefb0c233535c55c119321753a-JbXLGf_fw658' },
  { value: '朋友-Chim', title: 'Chim', key: 'uid-3', image: 'http://img.hb.aicdn.com/c2728cdc04a2b36f76538141de1332d2bc84672372692-Fvgu5H_fw658' }
]]

// TODO: Optimize the callback
const dataContrast = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

// export default connect(state => ({ data: state.booking })) // TEST
export default connect(state => ({ data: state.booking }))
(class MainScreen extends PureComponent {

  static navigationOptions = ({ navigation }) => {
    return {
      drawerLockMode: 'locked-closed',
      // contentComponent: () => (
      //   <View style={{ backgroundColor: '#333', flex: 1, height: 300, width: 400 }}></View>
      // ),
      headerLeft: (
        <TouchableOpacity 
          activeOpacity={0.7} style={{ marginLeft: 5, top: 1, width: 44, justifyContent: 'center', alignItems: 'center' }} 
          onPress={() => DeviceEventEmitter.emit('APPLICATION.LISTEN.EVENT.DRAWER.OPEN')}
        >
          { Icons.Generator.Octicons('three-bars', 23, '#2f2f2f') }
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
      data: undefined
    }
    this.currentLoc = {}
    this.timer = null
    this.pin = new Animated.Value(0)
    this.board = new Animated.Value(0)
    this.ui = new Animated.Value(0)
    this.form = new Animated.Value(0)

    this._dragLock = false
    this.count = 0
  }

  async componentDidMount() {
    await InteractionManager.runAfterInteractions()
    this.subscription = DeviceEventEmitter.addListener('APPLICATION.LISTEN.EVENT.DRAWER.OPEN', () => this.props.dispatch(application.openDrawer()))
  }

  componentWillUnmount() {
    if (this.subscription === undefined || this.subscription === null || !('remove' in this.subscription)) return
    this.subscription.remove()
  }

  onLocationListener({nativeEvent}) {
    const { latitude, longitude } = nativeEvent
    if (latitude === 0 || longitude === 0) return;
    if (!this.state.ready) {
      this.map.animateTo({ zoomLevel: 16, coordinate: { latitude, longitude } }, 500)
      this.setState({ ready: true })
    }
    this.currentLoc = { latitude, longitude }
  }

  onStatusChangeListener({ nativeEvent }) {
    const { longitude, latitude, rotation, zoomLevel, tilt } = nativeEvent
    if (!this.props.data.from) {
      this._dragLock = true // LOCK
      this.props.dispatch(booking.journeyUpdateData({ from: {} }))
      Animated.spring(this.pin, { toValue: 1, friction: 1.5 }).start()
      Animated.timing(this.board, { toValue: 1, duration: 100 }).start()
    }
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      Animated.timing(this.pin, { toValue: 0, duration: 200 }).start()
      Animated.timing(this.board, { toValue: 0, duration: 200 }).start()
      this.map.searchWithLocation(longitude, latitude)
      this._dragLock = false
    }, 1000)
  }

  onPOISearchResponse({ nativeEvent }) {
    const { count, pois, type } = nativeEvent
  
    if (type === 'near') {
      // TODO: 优化位置算法
      const address = pois.find(pipe => {
        if (pipe.address.endsWith('米')) return pipe
        if (pipe.address.endsWith('站')) return pipe
        if (pipe.address.endsWith('号')) return pipe
        if (pipe.address.endsWith('弄')) return pipe
        return false
      })
      this.props.dispatch(booking.journeyUpdateData({ from: address || {} }))
    } else if (type === 'keywords') {
      const args = pois.map(pipe => ({
        address: pipe.address,
        location: pipe.location,
        name: pipe.name,
        type: 'keywords'
      }))
      this.setState({ data: dataContrast.cloneWithRows(args) })
    }
  }

  onEnterKeywords(keywords) {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.map.searchWithKeywords(keywords, '上海')
    }, 250)
  }

  async componentWillReceiveProps(props) {
    const { schedule } = props.data
  
    if (schedule === 1) {
      await new Promise((resolve) => Animated.timing(this.ui, { toValue: 1, duration: 200 }).start(() => resolve()))
    }

    if (schedule === 3) {
      await new Promise((resolve) => Animated.timing(this.ui, { toValue: 2, duration: 200 }).start(() => resolve()))
    }

  }

  async activeAdrEdit(field) {
    await new Promise((resolve) => Animated.timing(this.ui, { toValue: 1, duration: 200 }).start(() => resolve()))
    this.setState({ editAdr: true, field })
  }

  async cancelAdrEdit() {
    this.setState({ editAdr: false })
    await new Promise((resolve) => Animated.timing(this.ui, { toValue: 0, duration: 200 }).start(() => resolve()))
  }

  async onSelectAddress(address, field) {
    this.props.dispatch(booking.journeyUpdateData({ [field]: address }))
    // this.setState({ editAdr: false })
    await new Promise((resolve) => Animated.timing(this.ui, { toValue: 0, duration: 200 }).start(() => resolve()))
  }

  changeFormAnimated(value, duration = 200) {
    return new Promise((resolve) => Animated.timing(this.form, { toValue: value, duration }).start(() => resolve()))
  }

  render() {
    const { editAdr, drag, defaultData, data, field } = this.state
    const { schedule } = this.props.data

    return (
      <View style={{ flex: 1 }}>
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
          onPOISearchResponse={this.onPOISearchResponse.bind(this)}
          ref={e => this.map = e}>
        </MapView>

        <MapPin timing={this.pin} />
        <MapPinTip timing={this.board} />

        <PickerAddress 
          timing={this.ui} 
          drag={drag}
          to={this.props.data.to}
          from={this.props.data.from}
          onPressTo={() => this.activeAdrEdit('to')} 
          onPressFrom={() => this.activeAdrEdit('from')} 
        />
        <SelectBookingOption 
          onPressChangeCarType={() => this.changeFormAnimated(1)}
          onPressBack={() => this.changeFormAnimated(0)}
          onPressBooking={() => this.props.dispatch(booking.journeyUserStart())}
          data={this.props.data}
          timing={[this.form, this.ui]} 
        />
        <BookingInfo 
          timing={this.ui}
        />

        {/* Modal - Where u? */}
        <ModalSelectAddress 
          onPressCancel={() => this.cancelAdrEdit()} 
          onSelectAddress={(props, field) => this.onSelectAddress(props, field)}
          onRequestClose={() => {}}
          onChangeKeywords={this.onEnterKeywords.bind(this)}
          field={field}
          animationType={'slide'} 
          transparent={true} 
          visible={editAdr}
          defaultData={defaultData}
          data={data}
        />

        <ModalDriverRespond visible={schedule === 2} />
      </View>
    )
  }
})

class PickerAddress extends Component {
  render() {
    const { 
      timing, 
      onPressTo = () => {}, 
      onPressFrom = () => {},
      drag,
      from,
      to
    } = this.props
    return (
      <Animated.View style={[
        { position: 'absolute', top: 15, left: 15, right: 15, height: 89, backgroundColor: 'white', borderRadius: 3, borderColor: '#ccc', borderWidth: Screen.window.width <= 375 ? .5 : 1 },
        { shadowOffset: { width: 0, height: 2 }, shadowColor: '#999', shadowOpacity: .5, shadowRadius: 3 },
        { opacity: timing.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }
      ]}>
        {/* From */}
        <View style={{ height: 44 }}>
          <TouchableOpacity onPress={() => onPressTo()} activeOpacity={0.7} style={{ flex: 1, height: 44, justifyContent: 'center' }}>
            <View style={{ backgroundColor: '#52a732', height: 10, width: 10, borderRadius: 5, position: 'absolute', left: 20 }} />
            <Text style={{ textAlign: 'center', color: drag ? '#a2a2a2' : '#333', fontSize: 14, fontWeight: '600' }}>{ drag ? '请选择上车地点' : from.name }</Text>
          </TouchableOpacity>
        </View>
        <View style={{ backgroundColor: '#ccc', height: .5, marginHorizontal: 18 }} />
        {/* To */}
        <View style={{ height: 44 }}>
          <TouchableOpacity onPress={() => onPressFrom()} activeOpacity={0.7} style={{ flex: 1, height: 44, justifyContent: 'center' }}>
            <View style={{ backgroundColor: '#e54224', height: 10, width: 10, borderRadius: 5, position: 'absolute', left: 20 }} />
            <Text style={{ textAlign: 'center', color: to.name ? '#333' : '#a2a2a2', fontSize: 14, fontWeight: '600', /* PositionFix */ top: -1 }}>{ to.name || '请输入目的地' }</Text>
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
        { position: 'absolute', backgroundColor: 'transparent', top: PIN_HEIGHT - 94, left: (Screen.window.width - 140) / 2  },
        { justifyContent: 'center', alignItems: 'center', paddingVertical: 6, width: 140 },
        { shadowOffset: { width: 0, height: 2 }, shadowColor: '#666', shadowOpacity: .3, shadowRadius: 3 },
        { opacity: timing.interpolate({ inputRange: [ 0, 1 ], outputRange: [ 1, 0 ] }) }
      ]}>
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'white', flex: 1, borderRadius: 20 }} />
        <View style={{ position: 'absolute', bottom: -10 }}>
          { Icons.Generator.Material('network-wifi', 20, 'white') }
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
          { top: timing.interpolate({ inputRange: [ 0, 1 ], outputRange: [ PIN_HEIGHT - 48, PIN_HEIGHT - 52 ] }) }
        ]} source={Resources.image.pin} />
      </View>
    )
  }
}

class MoveToCurrentLocation extends Component {
  render() {
    const { } = this.props
    return (
      <Animated.View style={[
        { width: 36, height: 36, backgroundColor: 'white', position: 'absolute', right: 15, borderRadius: 3, borderColor: '#ccc', borderWidth: Screen.window.width <= 375 ? .5 : 1 },
        { shadowOffset: { width: 0, height: 2 }, shadowColor: '#666', shadowOpacity: .3, shadowRadius: 3 },
        { justifyContent: 'center', alignItems: 'center' },
        { top: this.form.interpolate({ inputRange: [0, 1], outputRange: [Screen.window.height - 155 - 64 - 15 - 19 - BOTTOM_MARGIN, Screen.window.height - 135 - 64 - 15 - 89 - BOTTOM_MARGIN] }) },
        { opacity: this.ui.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }
      ]}>
        { Icons.Generator.Material('my-location', 22, '#666') }
      </Animated.View>
    )
  }
}

class SelectBookingOption extends Component {
  render() {
    const { timing, onPressChangeCarType, onPressBack, onPressBooking } = this.props
    return (
      <Animated.View style={[
        { position: 'absolute', left: 15, right: 15, backgroundColor: 'white', borderRadius: 3 },
        { shadowOffset: { width: 0, height: 2 }, shadowColor: '#999', shadowOpacity: .5, shadowRadius: 3 },
        { top: timing[0].interpolate({ inputRange: [0, 1], outputRange: [Screen.window.height - 130 - 64 - 15 - BOTTOM_MARGIN, Screen.window.height - 180 - 64 - 15 - BOTTOM_MARGIN] }) },
        { opacity: timing[1].interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }
      ]}>
        <View style={{ flex: 1 }}>
          <Animated.View style={[
            { left: timing[0].interpolate({ inputRange: [0, .7], outputRange: [0, width], extrapolate: 'clamp' }) },
            { opacity: timing[0].interpolate({ inputRange: [0, .2], outputRange: [1, 0], extrapolate: 'clamp' }) }
          ]}>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Button underlayColor={'#f2f2f299'} onPress={() => onPressChangeCarType()} style={{ backgroundColor: 'transparent', height: 44, flex: 1 }}>
                <Text style={{ fontSize: 14, color: '#444', fontWeight: '600' }}>优选</Text>
              </Button>
            </View>
            <Animated.View style={{ height: timing[0].interpolate({ inputRange: [0, 1], outputRange: [0, 50] }) }} />
          </Animated.View>

          <Animated.View style={[
            { backgroundColor: '#ccc', height: .5, marginHorizontal: 18 },
            { top: timing[0].interpolate({ inputRange: [0, .3, .9], outputRange: [0, 0, 44], extrapolate: 'clamp' }) },
            { opacity: timing[0].interpolate({ inputRange: [0, .7], outputRange: [1, 0], extrapolate: 'clamp' }) }
          ]} />

          {/* Payment */}
          <Animated.View style={[
            { flexDirection: 'row', backgroundColor: 'transparent' },
            { left: timing[0].interpolate({ inputRange: [0, .7], outputRange: [0, width], extrapolate: 'clamp' }) },
            { opacity: timing[0].interpolate({ inputRange: [0, .2], outputRange: [1, 0], extrapolate: 'clamp' }) }
          ]}> 
            <Button underlayColor={'#f2f2f299'} style={{ backgroundColor: 'transparent', height: 44, flex: 1 }}>
              <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                { Icons.Generator.Material('attach-money', 18, '#666', { style: { marginRight: 6, top: .5 } }) }
                <Text style={{ fontSize: 14, color: '#444', fontWeight: '600' }}>现金支付</Text>
              </View>
            </Button>
            <View style={{ backgroundColor: '#ccc', marginVertical: 8, width: .5 }} />
            <Button underlayColor={'#f2f2f299'} style={{ backgroundColor: 'transparent', height: 44, flex: 1 }}>
              <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                { Icons.Generator.Material('query-builder', 18, '#666', { style: { marginRight: 6, top: .5 } }) }
                <Text style={{ fontSize: 14, color: '#444', fontWeight: '600' }}>现在</Text>
              </View>
            </Button>
          </Animated.View>
        </View>

        <SelectCarType style={[
          { left: timing[0].interpolate({ inputRange: [.6, 1], outputRange: [width, 0], extrapolate: 'clamp' }) },
          { opacity: timing[0].interpolate({ inputRange: [.8, 1], outputRange: [0, 1], extrapolate: 'clamp' }) }
        ]} data={DEMO_DATA} onSelected={value => console.log(value)} />
        {/* Button Groups */}
        <View style={{ overflow: 'hidden', flex: 1 }}>
          <Animated.View style={[
            { height: 44, width: (width - 30) * 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
            { left: timing[0].interpolate({ inputRange: [0, 1], outputRange: [0, -(width - 30)], extrapolate: 'clamp' }) },
            {  }
          ]}>
            <Button onPress={() => onPressBooking()} style={{ flex: 1, left: 0, height: 44, backgroundColor: '#FEA81C', borderBottomLeftRadius: 3, borderBottomRightRadius: 3 }}>
              <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>开始</Text>
            </Button>
            <Button onPress={() => onPressBack()} style={{ flex: 1, height: 44, backgroundColor: '#FEA81C', borderBottomLeftRadius: 3, borderBottomRightRadius: 3 }}>
              { Icons.Generator.Material('arrow-back', 28, 'white') }
            </Button>
          </Animated.View>
        </View>
      </Animated.View>
    )
  }
}

class BookingInfo extends Component {
  render() {
    const { timing } = this.props
    return (
      <Animated.View style={[
        { position: 'absolute', left: 0, right: 0 },
        { shadowOffset: { width: 0, height: 2 }, shadowColor: '#999', shadowOpacity: .5, shadowRadius: 3 },
        { top: 0 },
        { opacity: timing.interpolate({ inputRange: [0, 1, 2], outputRange: [0, 0, 1] }) }
      ]}>
        <View style={{ height: 88, backgroundColor: 'white', flexDirection: 'row', paddingHorizontal: 14, alignItems: 'center' }}>
          <View style={{ justifyContent: 'center', marginRight: 10 }}>
            <Image style={{ width: 54, height: 54, borderRadius: 27 }} source={require('../../resources/images/test.jpg')} />
          </View>
          <View style={{ justifyContent: 'space-between', height: 54, top: 2, flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#333' }}>陈师傅</Text>
            <Text style={{ fontSize: 12, fontWeight: '400', color: '#666' }}>沪A23N78</Text>
            <View style={{ flexDirection: 'row' }}>
              { Icons.Generator.Material('star', 13, '#FEA81C') }
              { Icons.Generator.Material('star', 13, '#FEA81C') }
              { Icons.Generator.Material('star', 13, '#FEA81C') }
              { Icons.Generator.Material('star', 13, '#FEA81C') }
              { Icons.Generator.Material('star-half', 13, '#FEA81C') }
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: 120, paddingHorizontal: 10 }}>
            <Button underlayColor={'#ddd'} style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#FEA81C' }}>
              { Icons.Generator.Material('mail-outline', 24, 'white') }
            </Button>
            <Button underlayColor={'#ddd'} style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#FEA81C' }}>
              { Icons.Generator.Material('phone', 24, 'white') }
            </Button>
          </View>
        </View>
      </Animated.View>
    )
  }
}