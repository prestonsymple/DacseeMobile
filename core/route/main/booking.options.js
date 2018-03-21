import React, { Component } from 'react'
import {
  Text, View, Animated, StyleSheet, Image, ListView, Platform, ScrollView, DatePickerIOS, Modal, TouchableOpacity,
  DeviceEventEmitter
} from 'react-native'
import InteractionManager from 'InteractionManager'
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter'
import DatePicker from 'react-native-datepicker'
import Picker from 'react-native-picker'

import { connect } from 'react-redux'
import Lottie from 'lottie-react-native'
import moment from 'moment'

import Resources from '../../resources'

import HeaderSection from './booking.header.section'
import BookingSelectCircle from './booking.select.circle'

import { MapView, Marker, Utils } from '../../native/AMap'
import { Screen, Icons, Define, System } from '../../utils'
import { booking } from '../../redux/actions'
import { Button } from '../../components'

import ModalDriverRespond from '../../modal/modal.driver.respond'

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

// TODO: Optimize the callback
const dataContrast = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

// BaseScreenComponent
export default connect(state => ({ data: state.booking }))(class BookingSchedule_1 extends Component {

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
      title: '确认行程'
    }
  }

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>

      </View>
    )
  }
})