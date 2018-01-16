import React, { Component, PureComponent } from 'react'
import { Text, View, Animated, StyleSheet, StatusBar, Image, TouchableOpacity, TouchableHighlight, DeviceEventEmitter, TextInput } from 'react-native'
import InteractionManager from 'InteractionManager'
import { NavigationActions } from 'react-navigation'

import { MapView, Marker, Polyline } from '../../native/AMap'
import { Screen, Icons, Redux } from '../../utils'
import { application } from '../../redux/actions'

// Get Navigator Status
import { HomeNavigator } from '../../app.routes'

const MAP_DEFINE = {
  locationEnabled: true,
  showsCompass: false,
  showsScale: false,
  tiltEnabled: false,
  rotateEnabled: false,
  showsTraffic: false,
  showsZoomControls: false /* android fix */
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
      zoomLevel: 1
    }
  }

  async componentDidMount() {
    await InteractionManager.runAfterInteractions()
    this.subscription = DeviceEventEmitter.addListener('APPLICATION.LISTEN.EVENT.DRAWER.OPEN', () => this.props.openDrawer())
    this.setState({ zoomLevel: 14 })
  }

  componentWillUnmount() {
    if (this.subscription === undefined || this.subscription === null || !('remove' in this.subscription)) return
    this.subscription.remove()
  }

  render() {
    const { zoomLevel } = this.state

    return (
      <View style={{ flex: 1 }}>
        <MapView {...MAP_DEFINE} style={{ flex: 1 }}>
        </MapView>
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