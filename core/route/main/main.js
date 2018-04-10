/* global navigator */

import React, { Component, PureComponent } from 'react'
import { Text, View, Image, TouchableOpacity, DeviceEventEmitter, StatusBar, ScrollView, Linking } from 'react-native'
import InteractionManager from 'InteractionManager'
import { connect } from 'react-redux'
import OpenAppSettings from 'react-native-app-settings'

import NavigatorBarSwitcher from './components/navigator.bar.switcher'
import DriverComponent from './driver'
import PassengerComponent from './passenger'

import { Icons, Screen, System,TextFont } from '../../utils'
import { booking, application } from '../../redux/actions'
import { BOOKING_STATUS } from '.'

const { width } = Screen.window

export default connect(state => ({
  booking_status: state.booking.status,
  jobs_status: state.driver.status,
  app_status: state.application.application_status,
  gps_access: state.application.gps_access,
  i18n:state.intl.messages
}))(class MainScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    const reducer = global.store.getState()
    const { params = {} } = navigation.state
    const { status = BOOKING_STATUS.PASSGENER_BOOKING_INIT } = params

    const SETTER = {
      activeOpacity: .7,
      style: { top: 1, width: 54, paddingLeft: 8, justifyContent: 'center', alignItems: 'flex-start' },
      onPress: () => {
        if (status === BOOKING_STATUS.PASSGENER_BOOKING_INIT) {
          DeviceEventEmitter.emit('APPLICATION.LISTEN.EVENT.DRAWER.OPEN')
        } else if (status >= BOOKING_STATUS.PASSGENER_BOOKING_DRIVER_ON_THE_WAY) {
          // DO NOTHING
        } else {
          navigation.dispatch(booking.passengerSetStatus(BOOKING_STATUS.PASSGENER_BOOKING_INIT))
        }
      }
    }

    let title = 'DACSEE'
    switch(status) {
    case BOOKING_STATUS.PASSGENER_BOOKING_INIT:
      title = 'DACSEE'
      break
    case BOOKING_STATUS.PASSGENER_BOOKING_PICKED_ADDRESS:
      title = reducer.intl.messages.confirm_trip
      break
    case BOOKING_STATUS.PASSGENER_BOOKING_WAIT_SERVER_RESPONSE:
      title = reducer.intl.messages.order_sending
      break
    case BOOKING_STATUS.PASSGENER_BOOKING_WAIT_DRIVER_ACCEPT:
      title = reducer.intl.messages.Pending_Acceptance
      break
    case BOOKING_STATUS.PASSGENER_BOOKING_DRIVER_ON_THE_WAY:
      title = reducer.intl.messages.drive_in
      break
    case BOOKING_STATUS.PASSGENER_BOOKING_DRIVER_ARRIVED:
      title = reducer.intl.messages.Arrived
      break
    case BOOKING_STATUS.PASSGENER_BOOKING_ON_BOARD:
      title = reducer.intl.messages.driving
      break
    case BOOKING_STATUS.PASSGENER_BOOKING_ON_RATING:
      title = reducer.intl.messages.wait_comments
      break
    case BOOKING_STATUS.PASSGENER_BOOKING_HAVE_COMPLETE:
      title = reducer.intl.messages.trip_finish
      break
    default:
      title = 'DACSEE'
    }

    const maps = {
      drawerLockMode: 'locked-closed',
      headerStyle: {
        backgroundColor: '#1AB2FD',
        shadowColor: 'transparent',
        shadowOpacity: 0,
        borderBottomWidth: 0,
        borderBottomColor: 'transparent',
        elevation: 0,
      },
      title,
      headerLeft: (
        <TouchableOpacity {...SETTER}>
          {
            (status === BOOKING_STATUS.PASSGENER_BOOKING_INIT) && (Icons.Generator.Material('apps', 23, 'white', { style: { left: 8 } }))
          }
          {
            (
              status >= BOOKING_STATUS.PASSGENER_BOOKING_PICKED_ADDRESS &&
              status < BOOKING_STATUS.PASSGENER_BOOKING_DRIVER_ON_THE_WAY
            ) && (Icons.Generator.Material('keyboard-arrow-left', 30, 'white'))
          }
        </TouchableOpacity>
      )
    }

    return maps
  }

  async componentDidMount() {
    await InteractionManager.runAfterInteractions()
    this.subscription = DeviceEventEmitter.addListener('APPLICATION.LISTEN.EVENT.DRAWER.OPEN', () => this.props.navigation.navigate('DrawerOpen'))
  }

  componentWillUnmount() {
    this.subscription && this.subscription.remove()
  }

  async componentWillReceiveProps(props) {
    const { booking_status } = props
    if (this.props.booking_status !== booking_status) {
      this.props.navigation.setParams({ status: booking_status })
    }
  }

  render() {
    const { gps_access, i18n } = this.props
    return !gps_access ? (
      <View style={{ flex: 1, width, justifyContent: 'center', alignItems: 'center', top: -44 }}>
        <StatusBar animated={true} hidden={false} backgroundColor={'#1ab2fd'} barStyle={'light-content'} />
        <Image style={{ top: -22 }} source={ require('../../resources/images/location-error.png') } />
        <Text style={{ color: '#666', fontSize: TextFont.TextSize(14) }}>{i18n.pls_verify_location_open}</Text>
        <TouchableOpacity activeOpacity={0.7} style={{ marginTop: 20, height: 44, width: 150, backgroundColor: '#4fb2f9', justifyContent: 'center', alignItems: 'center', borderRadius: 22 }} onPress={ () => {
          this.props.dispatch(application.updateLocationStatus())
        }}>
          <Text style={{ fontSize: TextFont.TextSize(20), color: 'white' }}>{i18n.retry}</Text>
        </TouchableOpacity>
      </View>
    ) : (
      <View style={{ flex: 1, alignItems: 'center' }}>
        <StatusBar animated={true} hidden={false} backgroundColor={'#1ab2fd'} barStyle={'light-content'} />
        <NavigatorBarSwitcher />
        <BookingContainerSwitcher />
      </View>
    )
  }
})

const BookingContainerSwitcher = connect(state => ({ core_mode: state.application.core_mode }))(class BookingContainerSwitcher extends PureComponent {

  async componentDidMount() {
    await InteractionManager.runAfterInteractions()
    this.scrollView.scrollTo({ x: this.props.core_mode === 'driver' ? 0 : width, animated: false })

    // 修复Android初始化加载延迟问题, Tab页切换不对
    if (System.Platform.Android) {
      await new Promise((resolve) => setTimeout(() => resolve(), 200))
      this.scrollView.scrollTo({ x: this.props.core_mode === 'driver' ? 0 : width, animated: false })
    }
  }

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
