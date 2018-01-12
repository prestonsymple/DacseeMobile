import React, { Component, PureComponent } from 'react'
import { Text, View, Animated, StyleSheet, StatusBar, Image, TouchableOpacity, DeviceEventEmitter } from 'react-native'
import InteractionManager from 'InteractionManager'
import { NavigationActions } from 'react-navigation'

import { AMapView } from '../../native/AMap'
import { Screen, Icons, Redux } from '../../utils'
import { ActApplication } from '../../redux/actions'

// Get Navigator Status
import { HomeNavigator } from '../../app.routes'

const AMAP_DEFINE = {
  showsUserLocation: true,
  showsCompass: false,
  showsScale: false,
  rotateCameraEnabled: false,
  rotateEnabled: false
}

class DrawerComponent extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>

      </View>
    )
  }
}

export default Redux.connectAndBindAction(state => ({}), ActApplication)
(class MainScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      drawerLockMode: 'locked-closed',
      drawerWidth: Screen.Window.Width * 0.5,
      headerLeft: (
        <TouchableOpacity 
          activeOpacity={0.7} style={{ width: 44, justifyContent: 'center', alignItems: 'center' }} 
          onPress={() => DeviceEventEmitter.emit('APPLICATION.LISTEN.EVENT.DRAWER.OPEN')}
        >
          { Icons.Generator.Material('person', 23, '#333') }
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
    this.subscription = {}
    // TODO: Listener remove
    DeviceEventEmitter.addListener('APPLICATION.LISTEN.EVENT.DRAWER.OPEN', () => this.props.openDrawer())
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
      <View style={{ backgroundColor: 'green', flex: 1 }}>
        <AMapView 
          {...AMAP_DEFINE}
          style={{ flex: 1 }} 
          logoCenter={{ x: Screen.Window.Width / 2, y: Screen.Window.Height - 100 }}
          currentZoomLevel={zoomLevel}
        />
      </View>
    )
  }
})