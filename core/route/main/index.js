import React, { Component, PureComponent } from 'react'
import { Text, View, Animated, StyleSheet, StatusBar, Image, TouchableOpacity, DeviceEventEmitter } from 'react-native'
import InteractionManager from 'InteractionManager'
import { NavigationActions } from 'react-navigation'

import { MapView, Marker, Polyline } from '../../native/AMap'
import { Screen, Icons, Redux } from '../../utils'
import { ActApplication } from '../../redux/actions'
import  ScrollableTabView from 'react-native-scrollable-tab-view'

// Get Navigator Status
import { HomeNavigator } from '../../app.routes'

const MAP_DEFINE = {
  locationEnabled: true,
  showsCompass: false,
  showsScale: false,
  tiltEnabled: false,
  rotateEnabled: false,
  showsTraffic: true
}

export default Redux.connectAndBindAction(state => ({}), ActApplication)
(class MainScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      drawerLockMode: 'locked-closed',
      drawerWidth: Screen.Window.Width * 0.5,
      headerLeft: (
        <TouchableOpacity 
          activeOpacity={0.7} style={{ marginLeft: 5, width: 44, justifyContent: 'center', alignItems: 'center' }} 
          onPress={() => DeviceEventEmitter.emit('APPLICATION.LISTEN.EVENT.DRAWER.OPEN')}
        >
          { Icons.Generator.Octicons('three-bars', 23, '#666') }
        </TouchableOpacity>
      )
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

    // this.props.dispatch({ type: 'Navigation/NAVIGATE', routeName: 'DrawerClose' })

    return (
      <View style={{ flex: 1 }}>
        <MapView {...MAP_DEFINE} style={{ flex: 1 }}>
        </MapView>
        <ScrollableTabView>
          <View tabLabel="React" style={[
            { position: 'absolute', top: 0, left: 0, right: 0, height: 44, backgroundColor: 'white' },
            { shadowOffset: { width: 1, height: 1 }, shadowColor: '#666', shadowOpacity: .3, shadowRadius: 5 }
          ]}>
          </View>
          <View tabLabel="test2" style={[
            { position: 'absolute', top: 0, left: 0, right: 0, height: 44, backgroundColor: 'white' },
            { shadowOffset: { width: 1, height: 1 }, shadowColor: '#666', shadowOpacity: .3, shadowRadius: 5 }
          ]}>
          </View>
        </ScrollableTabView>
      </View>
    )
  }
})