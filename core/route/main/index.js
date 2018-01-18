import React, { Component, PureComponent } from 'react'
import { 
  Text, View, Animated, StyleSheet, StatusBar, Image, TouchableOpacity, TouchableHighlight, 
  DeviceEventEmitter, TextInput, Easing, ListView
} from 'react-native'
import InteractionManager from 'InteractionManager'
import { NavigationActions } from 'react-navigation'

import { MapView, Marker, Polyline, Utils } from '../../native/AMap'
import { Screen, Icons, Redux } from '../../utils'
import Resources from '../../resources'
import { application } from '../../redux/actions'
import ModalSelectAddress from '../../modal/modal.select.address'

// Get Navigator Status
import { HomeNavigator } from '../../app.routes'

const MAP_DEFINE = {
  showsCompass: false,
  showsScale: false,
  tiltEnabled: false,
  rotateEnabled: false,
  showsTraffic: false,
  showsZoomControls: false, /* android fix */
}

// TODO: Optimize the callback
const dataContrast = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

export default Redux.connectAndBindAction(state => ({}), application)
(class MainScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      drawerLockMode: 'locked-closed',
      drawerWidth: Screen.Window.Width * 0.5,
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
      fromAdr: { address: '', city: '', district: '', name: '' },
      toAdr: { address: '', city: '', district: '', name: '' },
      editAdr: false,
      drag: false,
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
  }

  async componentDidMount() {
    await InteractionManager.runAfterInteractions()
    this.subscription = DeviceEventEmitter.addListener('APPLICATION.LISTEN.EVENT.DRAWER.OPEN', () => this.props.openDrawer())
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
    if (!this.state.drag) {
      this.setState({ drag: true, fromAdr: { address: '', city: '', district: '', name: '' } })
      Animated.spring(this.pin, { toValue: 1, friction: 1.5 }).start()
      Animated.timing(this.board, { toValue: 1, duration: 100 }).start()
    }
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      Animated.timing(this.pin, { toValue: 0, duration: 200 }).start()
      Animated.timing(this.board, { toValue: 0, duration: 200 }).start()
      this.map.searchWithLocation(longitude, latitude)
      this.setState({ drag: false })
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
      this.setState({ fromAdr: address })
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

  async activeAdrEdit(field) {
    await new Promise((resolve) => Animated.timing(this.ui, { toValue: 1, duration: 200 }).start(() => resolve()))
    this.setState({ editAdr: true, field })
  }

  async cancelAdrEdit() {
    this.setState({ editAdr: false })
    await new Promise((resolve) => Animated.timing(this.ui, { toValue: 0, duration: 200 }).start(() => resolve()))
  }

  async onSelectAddress(address, field) {
    this.setState({ [`${field}Adr`]: address, editAdr: false })
    await new Promise((resolve) => Animated.timing(this.ui, { toValue: 0, duration: 200 }).start(() => resolve()))
  }

  render() {
    const { editAdr, drag, defaultData, data, field } = this.state
    const { Height } = Screen.Window
    const pinHeight = ((Height - 20) / 2)

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
        <Animated.View style={[
          { position: 'absolute', backgroundColor: 'transparent', top: pinHeight - 94, left: (Screen.Window.Width - 140) / 2  },
          { justifyContent: 'center', alignItems: 'center', paddingVertical: 6, width: 140 },
          { shadowOffset: { width: 0, height: 2 }, shadowColor: '#666', shadowOpacity: .3, shadowRadius: 3 },
          { opacity: this.board.interpolate({ inputRange: [ 0, 1 ], outputRange: [ 1, 0 ] }) }
        ]}>
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'white', flex: 1, borderRadius: 20 }} />
          <View style={{ position: 'absolute', bottom: -10 }}>
            { Icons.Generator.Material('network-wifi', 20, 'white') }
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontSize: 13, color: '#666', fontWeight: '600' }}>Board after </Text>
            <Text style={{ fontSize: 13, color: '#ffa81d', fontWeight: '600' }}>1min(s)</Text>
          </View>
        </Animated.View>
        <View style={{ position: 'absolute', left: (Screen.Window.Width - 18) / 2 }}>
          <Animated.Image style={[
            { width: 18, height: 28 },
            { top: this.pin.interpolate({ inputRange: [ 0, 1 ], outputRange: [ pinHeight - 48, pinHeight - 52 ] }) }
          ]} source={Resources.image.pin} />
        </View>
        <Animated.View style={[
          { position: 'absolute', top: 15, left: 15, right: 15, height: 89, backgroundColor: 'white', borderRadius: 4 },
          { shadowOffset: { width: 0, height: 2 }, shadowColor: '#666', shadowOpacity: .3, shadowRadius: 3 },
          { opacity: this.ui.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }
        ]}>
          {/* Current */}
          <View style={{ height: 44 }}>
            <TouchableOpacity onPress={() => this.activeAdrEdit('from')} activeOpacity={0.7} style={{ flex: 1, height: 44, justifyContent: 'center' }}>
              <View style={{ backgroundColor: '#52a732', height: 10, width: 10, borderRadius: 5, position: 'absolute', left: 20 }} />
              <Text style={{ textAlign: 'center', color: drag ? '#a2a2a2' : '#333', fontSize: 14, fontWeight: '600' }}>{ drag ? '请选择上车地点' : this.state.fromAdr.name }</Text>
            </TouchableOpacity>
          </View>
          <View style={{ backgroundColor: '#f2f2f2', height: 1, marginHorizontal: 18 }} />
          {/* Target */}
          <View style={{ height: 44 }}>
            <TouchableOpacity onPress={() => this.activeAdrEdit('to')} activeOpacity={0.7} style={{ flex: 1, height: 44, justifyContent: 'center' }}>
              <View style={{ backgroundColor: '#e54224', height: 10, width: 10, borderRadius: 5, position: 'absolute', left: 20 }} />
              <Text style={{ textAlign: 'center', color: this.state.toAdr.name ? '#333' : '#a2a2a2', fontSize: 14, fontWeight: '600', /* PositionFix */ top: -1 }}>{ this.state.toAdr.name || '请输入目的地' }</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
        <Animated.View style={[
          { width: 36, height: 36, backgroundColor: 'white', position: 'absolute', right: 20, bottom: 20 },
          { shadowOffset: { width: 0, height: 2 }, shadowColor: '#666', shadowOpacity: .3, shadowRadius: 3 },
          { borderRadius: 4, justifyContent: 'center', alignItems: 'center' },
          { opacity: this.ui.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }
        ]}>
          { Icons.Generator.Material('my-location', 22, '#666') }
        </Animated.View>

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
      </View>
    )
  }
})