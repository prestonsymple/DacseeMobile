import React, { Component } from 'react'
import {
  Text, View, TouchableOpacity, ScrollView
} from 'react-native'
import { connect } from 'react-redux'
import InteractionManager from 'InteractionManager'
import { NavigationActions } from 'react-navigation'

import { Screen, Icons, Define, Session ,TextFont} from '../../../utils'
import { application } from '../../../redux/actions'

const { height, width } = Screen.window

const MAP_DEFINE = {
  showsCompass: false,
  showsScale: false,
  tiltEnabled: false,
  rotateEnabled: false,
  showsTraffic: false,
  showsZoomControls: false /* android fix */
}

export default connect(state => ({ booking: state.booking }))(class BookingCompleteScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      drawerLockMode: 'locked-closed',
      title: '支付及评价',
      headerLeft: (
        <TouchableOpacity
          activeOpacity={0.7}
          style={{ top: 1, width: 54, paddingLeft: 8, justifyContent: 'center', alignItems: 'flex-start' }}
          onPress={() => {
            navigation.dispatch(NavigationActions.reset({
              index: 0,
              actions: [NavigationActions.navigate({ routeName: 'Main' })]
            }))
          }}
        >
          { Icons.Generator.Material('keyboard-arrow-left', 30, '#2f2f2f') }
        </TouchableOpacity>
      )
    }
  }

  constructor(props) {
    super(props)
    this.state = {
    }
    this.tick = 0
  }

  async componentDidMount() {
    await InteractionManager.runAfterInteractions()
    this.fetchOrderDetail()
  }

  componentWillUnmount() {
    this.subscription && this.subscription.remove()
    this.trackTimer && clearTimeout(this.trackTimer)
  }

  componentWillReceiveProps(props) {
  }

  async fetchOrderDetail() {
    try {
      const { booking_id } = this.props.navigation.state.params
      const { driver_info, driver_id, from, destination, fare, payment_method } = await Session.Booking.Get(`v1/bookings/${booking_id}?fields=fare,driver_info,driver_id,from,destination,payment_method`)
      this.setState({ driver_info, driver_id, from, destination, fare, payment_method })
    } catch (e) {
      this.tick += 1
      if (this.tick >= 4) {
        this.props.dispatch(application.showMessage('无法获取订单信息，请检查您的网络环境'))
        // TODO:
      } else {
        this.props.dispatch(application.showMessage('订单信息获取超时，正在重试'))
        this.fetchOrderDetail()
      }
    }
  }

  render() {
    const { driver_info, driver_id, from, destination, fare, payment_method } = this.state

    return !from ? (
      <View style={{ flex: 1, backgroundColor: 'white' }}></View>
    ) : (
      <ScrollView contentContainerStyle={{ paddingVertical: 20, paddingHorizontal: 15 }} style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: TextFont.TextSize(14), color: '#999', fontWeight: '400', marginBottom: 6 }}>乘客位置</Text>
          { from && (<Text style={{ top: -1.5, fontSize: TextFont.TextSize(14), color: '#333', fontWeight: '400' }}>{ from.address }</Text>) }
        </View>
        <View style={{ }}>
          <Text style={{ fontSize: TextFont.TextSize(14), color: '#999', fontWeight: '400', marginBottom: 6 }}>目的地</Text>
          { destination && (<Text style={{ top: -1.5, fontSize: TextFont.TextSize(14), color: '#333', fontWeight: '400' }}>{ destination.address } {destination.name}</Text>) }
        </View>
        <View style={{ height: Define.system.ios.plus ? 1 : .8, backgroundColor: '#f2f2f2', marginVertical: 12 }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: TextFont.TextSize(14), color: '#999', fontWeight: '400', marginBottom: 12 }}>行程费用</Text>
          { from && (<Text style={{ top: -1.5, fontSize: TextFont.TextSize(14), color: '#333', fontWeight: '400' }}>￥{ parseInt(fare).toFixed(2) }</Text>) }
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: TextFont.TextSize(14), color: '#999', fontWeight: '400' }}>支付方式</Text>
          { payment_method && (<Text style={{ top: -1.5, fontSize: TextFont.TextSize(14), color: '#333', fontWeight: '400' }}>{ payment_method == 'Cash' ? '现金' : payment_method }</Text>) }
        </View>
        <View style={{ height: Define.system.ios.plus ? 1 : .8, backgroundColor: '#f2f2f2', marginVertical: 12 }} />
      </ScrollView>
    )
  }
})
