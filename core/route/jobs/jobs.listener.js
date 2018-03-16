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

import { MapView, Search } from '../../native/AMap'
import { Screen, Icons, Define } from '../../utils'
import { application, booking } from '../../redux/actions'
import { Button, SelectCarType } from '../../components'

const { height, width } = Screen.window

const MAP_DEFINE = {
  showsCompass: false,
  showsScale: false,
  tiltEnabled: false,
  rotateEnabled: false,
  showsTraffic: false,
  showsZoomControls: false, /* android fix */
}

// export default connect(state => ({ data: state.booking })) // TEST
export default connect(state => ({ }))(class JobsListenerScreen extends BaseScreenComponent {

  static navigationOptions = ({ navigation }) => {
    return {
      drawerLockMode: 'locked-closed',
      // contentComponent: () => (
      //   <View style={{ backgroundColor: '#333', flex: 1, height: 300, width: 400 }}></View>
      // ),
      // headerStyle: {
      //   shadowColor: 'transparent',
      //   shadowOpacity: 0,
      //   borderBottomWidth: 0,
      //   borderBottomColor: 'transparent',
      //   elevation: 0,
      // },
      // headerLeft: (
      //   <TouchableOpacity
      //     activeOpacity={0.7}
      //     style={{ top: 1, width: 54, paddingLeft: 8, justifyContent: 'center', alignItems: 'flex-start' }}
      //     onPress={() => DeviceEventEmitter.emit('APPLICATION.LISTEN.EVENT.DRAWER.OPEN')}
      //   >
      //     {Icons.Generator.Octicons('three-bars', 23, '#2f2f2f', { style: { left: 8 } })}
      //   </TouchableOpacity>
      // ),
      title: '开始接单'
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      current: {}
    }
  }

  async componentDidMount() {
    await InteractionManager.runAfterInteractions()
  }

  componentWillUnmount() {
  }

  onLocationListener({ nativeEvent }) {
    const { latitude, longitude } = nativeEvent
    if (latitude === 0 || longitude === 0) return
    if (!this.state.ready) {
      this.map.animateTo({ zoomLevel: 16, coordinate: { latitude, longitude } }, 500)
      this.setState({ ready: true })
    }
    this.setState({ current: { latitude, longitude } })
  }

  async componentWillReceiveProps(props) {
  }

  render() {
    const { abc } = this.state
    // const { dev } = this.props.data

    return (
      <View style={{ flex: 1 }}>
        {/* <StatusBar animated={true} hidden={false} backgroundColor={'white'} barStyle={'dark-content'} /> */}
        {/* <MapView
          {...MAP_DEFINE}
          style={{ flex: 1 }}
          locationEnabled={true}
          mapType={'standard'}
          locationInterval={1000}
          locationStyle={{

          }}
          // onStatusChange={this.onStatusChangeListener.bind(this)}
          onLocation={this.onLocationListener.bind(this)}
          ref={e => this.map = e}>

        </MapView> */}
        <View style={{ backgroundColor: 'white' }}>
          <View style={{ backgroundColor: '#' }}>

          </View>
        </View>
      </View>
    )
  }
})