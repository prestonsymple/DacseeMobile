import React, { Component, PureComponent } from 'react'
import { 
  Text, View, Animated, StyleSheet, StatusBar, Image, TouchableOpacity, TouchableHighlight, 
  DeviceEventEmitter, TextInput, Easing 
} from 'react-native'
import InteractionManager from 'InteractionManager'
import { NavigationActions } from 'react-navigation'

import { MapView, Marker, Polyline } from '../../native/AMap'
import { Screen, Icons, Redux } from '../../utils'
import Resources from '../../resources'
import { application } from '../../redux/actions'

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
    this.state = {
      ready: false
    }
    this.drag = false
    this.timer = null
    this.pin = new Animated.Value(0)
    this.board = new Animated.Value(0)
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
    if (!this.state.ready) {
      if (latitude === 0 || longitude === 0) return;
      this.map.animateTo({ zoomLevel: 16, coordinate: { latitude, longitude } }, 500)
      this.setState({ ready: true })
    }
  }

  onStatusChangeListener({ nativeEvent }) {
    const { longitude, latitude, rotation, zoomLevel, tilt } = nativeEvent
    if (!this.drag) {
      this.drag = true
      Animated.spring(this.pin, { toValue: 1, friction: 1.5 }).start()
      Animated.timing(this.board, { toValue: 1, duration: 100 }).start()
    }
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      Animated.timing(this.pin, { toValue: 0, duration: 200 }).start()
      Animated.timing(this.board, { toValue: 0, duration: 200 }).start()
      this.drag = false
    }, 1000)
  }

  render() {
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
          ref={e => this.map = e}>
        </MapView>
        <Animated.View style={[
          { position: 'absolute', backgroundColor: 'transparent', top: pinHeight - 107, left: (Screen.Window.Width - 140) / 2  },
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
            { top: this.pin.interpolate({ inputRange: [ 0, 1 ], outputRange: [ pinHeight - 64, pinHeight - 68 ] }) }
          ]} source={Resources.image.pin} />
        </View>
        <View style={[
          { position: 'absolute', top: 15, left: 12, right: 12, height: 89, backgroundColor: 'white', borderRadius: 4 },
          { shadowOffset: { width: 0, height: 2 }, shadowColor: '#666', shadowOpacity: .3, shadowRadius: 3 }
        ]}>
          {/* Current */}
          <View style={{ height: 44 }}>
            <TouchableOpacity activeOpacity={0.7} style={{ flex: 1, height: 44, justifyContent: 'center' }}>
              <View style={{ backgroundColor: '#52a732', height: 10, width: 10, borderRadius: 5, position: 'absolute', left: 20 }} />
              <Text style={{ textAlign: 'center', color: '#333', fontSize: 14, fontWeight: '600' }}>西藏南路-地铁站</Text>
            </TouchableOpacity>
          </View>
          <View style={{ backgroundColor: '#f2f2f2', height: 1, marginHorizontal: 18 }} />
          {/* Target */}
          <View style={{ height: 44 }}>
            <TouchableOpacity activeOpacity={0.7} style={{ flex: 1, height: 44, justifyContent: 'center' }}>
              <View style={{ backgroundColor: '#e54224', height: 10, width: 10, borderRadius: 5, position: 'absolute', left: 20 }} />
              <Text style={{ textAlign: 'center', color: '#a2a2a2', fontSize: 14, fontWeight: '600', /* PositionFix */ top: -1 }}>请输入目的地</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={[
          { width: 36, height: 36, backgroundColor: 'white', position: 'absolute', right: 20, bottom: 20 },
          { shadowOffset: { width: 0, height: 2 }, shadowColor: '#666', shadowOpacity: .3, shadowRadius: 3 },
          { borderRadius: 4, justifyContent: 'center', alignItems: 'center' }
        ]}>
          { Icons.Generator.Material('my-location', 22, '#666') }
        </View>
      </View>
    )
  }
})