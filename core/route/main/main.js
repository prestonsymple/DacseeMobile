/* global navigator */

import React, { Component, PureComponent } from 'react'
import { Text, View, Image, TouchableOpacity, DeviceEventEmitter, StatusBar, ScrollView } from 'react-native'
import InteractionManager from 'InteractionManager'
import { connect } from 'react-redux'

import NavigatorBarSwitcher from './components/navigator.bar.switcher'
import DriverComponent from './driver'
import PassengerComponent from './passenger'

import { Icons, Screen, System } from '../../utils'
import { booking } from '../../redux/actions'
import { BOOKING_STATUS } from '.'

const { width } = Screen.window

export default connect(state => ({
  booking_status: state.booking.status,
  jobs_status: state.driver.status,
  app_status: state.application.application_status
}))(class MainScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state
    const { status = BOOKING_STATUS.PASSGENER_BOOKING_INIT } = params

    const SETTER = {
      activeOpacity: .7,
      style: { top: 1, width: 54, paddingLeft: 8, justifyContent: 'center', alignItems: 'flex-start' },
      onPress: () => {
        if (status === BOOKING_STATUS.PASSGENER_BOOKING_INIT) {
          DeviceEventEmitter.emit('APPLICATION.LISTEN.EVENT.DRAWER.OPEN') 
        } else {
          navigation.dispatch(booking.passengerSetStatus(BOOKING_STATUS.PASSGENER_BOOKING_INIT))
        }
      }
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
      title: (status >= BOOKING_STATUS.PASSGENER_BOOKING_INIT) ? 'DACSEE' : '确认行程',
      headerLeft: (
        <TouchableOpacity {...SETTER}>
          {
            (status === BOOKING_STATUS.PASSGENER_BOOKING_INIT) && (Icons.Generator.Octicons('three-bars', 23, 'white', { style: { left: 8 } }))
          }
          {
            (status >= BOOKING_STATUS.PASSGENER_BOOKING_PICKED_ADDRESS) && (Icons.Generator.Material('keyboard-arrow-left', 30, 'white'))
          }
        </TouchableOpacity>
      )
    }

    return maps
  }

  constructor(props) {
    super(props)
    this.state = {
      deniedAccessLocation: false
    }
  }

  async componentDidMount() {
    await InteractionManager.runAfterInteractions()
    this.subscription = DeviceEventEmitter.addListener('APPLICATION.LISTEN.EVENT.DRAWER.OPEN', () => this.props.navigation.navigate('DrawerOpen'))
    this.checkLocationPermission()
  }

  componentWillUnmount() {
    this.subscription && this.subscription.remove()
  }

  async componentWillReceiveProps(props) {
    const { booking_status } = props
    if (this.props.booking_status !== booking_status) {
      this.props.navigation.setParams({ status: booking_status })
    }

    if (this.props.app_status !== props.app_status && props.app_status === 'active') {
      this.checkLocationPermission()
    }
  }

  checkLocationPermission() {
    navigator.geolocation.getCurrentPosition(() => this.setState({ deniedAccessLocation: false }), (e) => {
      if (e.code === 1 || e.code === 2) this.setState({ deniedAccessLocation: true })
    }, { timeout: 1000 })
  }

  render() {
    const { deniedAccessLocation } = this.state
    return deniedAccessLocation ? (
      <View style={{ flex: 1, width, justifyContent: 'center', alignItems: 'center', top: -44 }}>
        <StatusBar animated={true} hidden={false} backgroundColor={'#1ab2fd'} barStyle={'light-content'} />
        <Image style={{ top: -22 }} source={ require('../../resources/images/location-error.png') } />
        <Text style={{ color: '#666', fontSize: 14 }}>请确认您的位置权限是否打开</Text>
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