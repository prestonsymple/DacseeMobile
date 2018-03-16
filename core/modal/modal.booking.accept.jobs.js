/* eslint-disable */
import React, { Component, PureComponent } from 'react'
import { 
  View, TouchableOpacity, Modal, Text, Animated, Alert, AppState, TextInput, ScrollView, ListView,
  Image, Platform, DeviceEventEmitter, Linking
} from 'react-native'
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter'
import InteractionManager from 'InteractionManager'
import * as Progress from 'react-native-progress'
import CodePush from 'react-native-code-push'
import ActionSheet from 'react-native-actionsheet'
import { connect } from 'react-redux'
import { NavigationActions, SafeAreaView } from 'react-navigation'

/*****************************************************************************************************/
import { System, Icons, Screen, Define, Session } from '../utils'
import { Button } from '../components'
import { jobs as Jobs, application } from '../redux/actions'
import { MapView, Search, Marker, Polyline, Utils } from '../native/AMap'
/*****************************************************************************************************/

const MAP_DEFINE = {
  showsCompass: false,
  showsScale: false,
  tiltEnabled: false,
  rotateEnabled: false,
  showsTraffic: false,
  showsZoomControls: false, /* android fix */
}

export default connect(state => ({
  visible: state.jobs.working,
  jobs: state.jobs,
  account: state.account
}))(class BookingAcceptJobsModal extends Component {

  constructor(props) {
    super(props)
    this.state = {
      // ready: false,
      route: {},
      current: {}
    }
    this.timer = undefined
  }

  async componentDidMount() {
    await InteractionManager.runAfterInteractions()

    this.timer = setInterval(() => {
      const { status } = this.props.jobs
      if (status === '') {
        const { latitude, longitude } = this.state.current
        const { from } = this.props.jobs.detail
        if (!this.map || !from || !from.coords) return undefined
        this.map.animateTo({ zoomLevel: 17, coordinate: { latitude, longitude } }, 500)
        this.map.calculateDriveRouteWithStartPoints({ latitude, longitude }, {
          latitude: from.coords.lat,
          longitude: from.coords.lng
        })
      } else if (status === 'ARRIVED') {
        // NOTHING...
      } else if (status === 'ON_BOARD') {
        const { latitude, longitude } = this.state.current
        const { destination } = this.props.jobs.detail
        if (!this.map || !destination || !destination.coords) return undefined
        this.map.calculateDriveRouteWithStartPoints({ latitude, longitude }, {
          latitude: destination.coords.lat,
          longitude: destination.coords.lng
        })
      }
    }, 2000)
    this.eventListener = RCTDeviceEventEmitter.addListener('EVENT_AMAP_VIEW_ROUTE_SUCCESS', async (args) => {
      const { status } = this.props.jobs
      if (status === '') { // 前往乘客上车地点
        const { detail } = this.props.jobs
        if (!detail || !detail.from || !this.props.visible) return undefined;
        const route = Array.isArray(args) ? args[0] : args
        route.polylines = route.routeNaviPoint.map(pipe => ({
          latitude: pipe.lat, 
          longitude: pipe.lng
        }))
        this.setState({ route })
      } else if (status === 'ON_BOARD') { // 前往目的地
        const { detail } = this.props.jobs
        if (!detail || !detail.from || !this.props.visible) return undefined;
        const route = Array.isArray(args) ? args[0] : args
        route.polylines = route.routeNaviPoint.map(pipe => ({
          latitude: pipe.lat, 
          longitude: pipe.lng
        }))
        this.setState({ route })
      }
    })
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
  }

  async onLocationListener({ nativeEvent }) {
    const { latitude, longitude } = nativeEvent
    if (latitude === 0 || longitude === 0) return undefined
    this.setState({ current: { latitude, longitude } })

    try {
      if (this.props.jobs.status === 'ARRIVED') return undefined
      const reqUser_id = this.props.account.user.userId
      await Session.location.put('v1', { latitude, longitude, reqUser_id, logged: false })
    } catch (e) {
      console.log(e)
    }
  }

  async componentWillReceiveProps(props) {
    // if (props.jobs && props.jobs.working !== this.props.jobs.working) {
    //   const { latitude, longitude } = this.state.current
    //   if (latitude && latitude !== 0 && longitude && longitude !== 0) {
    //     await InteractionManager.runAfterInteractions()
    //     this.map.animateTo({ zoomLevel: 18, coordinate: { latitude, longitude } }, 500)
    //     const { from } = props.jobs.detail
    //     this.map.calculateDriveRouteWithStartPoints({ latitude, longitude }, {
    //       latitude: from.coords.lat,
    //       longitude: from.coords.lng
    //     })
    //   }
    // }
  }

  _pressActionSheet(index) {
    if (index === 0) {
      Alert.alert('取消订单', '接受订单后取消订单将影响您的综合评分', [
        { text: '取消该订单', onPress: async () => {
          const { visible, jobs = {} } = this.props
          const { booking_id = '' } = jobs
          try {
            await Session.booking.put(`v1/${booking_id}`, { action: 'reject' })
          } catch (e) { //
          } finally {
            this.props.dispatch(Jobs.cancelJobs())
          }
        }},
        { text: '继续接驾', onPress: () => {} }
      ])
    }

    if (index === 1) {
      this.props.dispatch(application.showMessage('无法请求该接口'))
    }
  }

  render() {
    const { visible, jobs = {} } = this.props
    const { route, current } = this.state
    const { booking_id = '', detail = {} } = jobs
    const { destination, from, type, payment_method, notes, fare, passenger_info } = detail
    var title = ''
    switch (this.props.jobs.status) {
      case 'ARRIVED':
        title = '等待乘客'
        break;
      case 'ON_BOARD':
        title = '行驶中'
        break;
      default:
        title = '接驾中'
        break;
    }

    return (
      <Modal onRequestClose={() => {}} visible={visible} transparent={false} style={{ }}>
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          {/* NavBar */}
          <View style={[
            { height: Define.system.ios.x ? 88 : 64, backgroundColor: 'white' },
            { shadowOffset: { width: 0, height: 3 }, shadowColor: '#999', shadowOpacity: .5, shadowRadius: 3 },
            { borderColor: '#f2f2f2', borderBottomWidth: .8 }
          ]}>
            <View style={{ marginTop: Define.system.ios.x ? 44 : 20, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', height: 44 }}>
              <View style={{ flex: 1 }}>

              </View>
              <Text style={{ fontWeight: '600', fontSize: 16, color: '#333' }}>{title}</Text>
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={{ top: 1, width: 54, paddingLeft: 8, justifyContent: 'center', alignItems: 'flex-start' }}
                  onPress={() => this.ActionSheet.show()}
                >
                  {Icons.Generator.Material('more-horiz', 28, '#2f2f2f', { style: { left: 8 } })}
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Main */}
          <View style={{ flex: 1 }}>
            <MapView
              {...MAP_DEFINE}
              style={{ flex: 1 }}
              locationEnabled={true}
              mapType={'standard'}
              locationInterval={2500}
              distanceFilter={100}
              locationStyle={{ image: 'rn_amap_blank' }}
              showsTraffic={true}
              onLocation={this.onLocationListener.bind(this)}
              ref={e => this.map = e}>

              { from && (<Marker image={'rn_amap_startpoint'} coordinate={{ latitude: from.coords.lat, longitude: from.coords.lng }} />) }
              {
                (this.props.jobs.status === '' && 'polylines' in route) && (
                  <Marker image={'rn_amap_car'} coordinate={{ latitude: route.polylines[0].latitude, longitude: route.polylines[0].longitude }} />
                )
              }
              {
                ('polylines' in route) && (
                  <Polyline 
                    coordinates={route.polylines}
                    width={6}
                    color={'#2d2a4a'}
                  />
                )
              }
            </MapView>
          </View>
          <View style={[
            { shadowOffset: { width: 0, height: 3 }, shadowColor: '#999', shadowOpacity: .5, shadowRadius: 3 }
          ]}>
            {
              (this.props.jobs.status !== 'ON_BOARD') && (
                <View style={{ marginVertical: 26, paddingHorizontal: 22 }}>
                  <View style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 14, color: '#999', fontWeight: '400', marginBottom: 16 }}>如遇问题，请主动与乘客进行联系</Text>
                    { passenger_info && (
                      <TouchableOpacity onPress={() => {
                        Linking.openURL(`tel:${passenger_info.phoneCountryCode}${passenger_info.phoneNo}`)
                      }} style={{ backgroundColor: '#eee', width: 48, height: 48, borderRadius: 19, justifyContent: 'center', alignItems: 'center' }}>
                        { Icons.Generator.Material('phone', 24, '#555') }
                      </TouchableOpacity>
                    ) }
                  </View>
                </View>
              )
            }
            <View style={{ height: Define.system.ios.x ? 52 + 22 : 52 }}>
              {
                (this.props.jobs.status === '') && (
                  <TouchableOpacity onPress={async () => {
                    Alert.alert('等待乘客上车', '立即通知乘客车辆已到达指定位置', [
                      { text: '确定', onPress: async () => {
                        try {
                          await Session.booking.put(`v1/${booking_id}`, { action: 'arrived' })
                          this.props.dispatch(Jobs.setJobs({ status: 'ARRIVED' }))
                          this.setState({ route: {} })
                        } catch (e) {
                          this.props.dispatch(application.showMessage('无法连接到服务器，请检查您的网络'))
                        }
                      } },
                      { text: '取消', onPress: () => {} }
                    ])
                  }} activeOpacity={.7} style={{ backgroundColor: '#f1af41', paddingBottom: Define.system.ios.x ? 22 : 0, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, color: 'white', fontWeight: '400' }}>已到达上车地点</Text>
                  </TouchableOpacity>
                )
              }
              {
                (this.props.jobs.status === 'ARRIVED') && (
                  <TouchableOpacity onPress={async () => {
                    Alert.alert('开始行程', '乘客已上车，立即开始行程？', [
                      { text: '是', onPress: async () => {
                        try {
                          await Session.booking.put(`v1/${booking_id}`, { action: 'on_board' })
                          this.props.dispatch(Jobs.setJobs({ status: 'ON_BOARD' }))
                          //TODO
                        } catch (e) {
                          this.props.dispatch(application.showMessage('无法连接到服务器，请检查您的网络'))
                        }
                      } },
                      { text: '否', onPress: () => {} }
                    ])
                  }} activeOpacity={.7} style={{ backgroundColor: '#f1af41', paddingBottom: Define.system.ios.x ? 22 : 0, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, color: 'white', fontWeight: '400' }}>乘客已上车</Text>
                  </TouchableOpacity>
                )
              }
              {
                (this.props.jobs.status === 'ON_BOARD') && (
                  <TouchableOpacity onPress={async () => {
                    Alert.alert('已到达目的地', '立即结束行程', [
                      { text: '确定', onPress: async () => {
                        try {
                          await Session.booking.put(`v1/${booking_id}`, { action: 'completed' })
                          this.props.dispatch(Jobs.setJobs({ status: '', working: false, route: {}, detail: {}, booking_id: '' }))
                          //TODO 
                        } catch (e) {
                          this.props.dispatch(application.showMessage('无法连接到服务器，请检查您的网络'))
                        }
                      } },
                      { text: '取消', onPress: () => {} }
                    ])
                  }} activeOpacity={.7} style={{ backgroundColor: '#f1af41', paddingBottom: Define.system.ios.x ? 22 : 0, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, color: 'white', fontWeight: '400' }}>完成行程</Text>
                  </TouchableOpacity>
                )
              }
            </View>
          </View>
        </View>
        {
          (!this.props.jobs.status || this.props.jobs.status === '') && (
            <ActionSheet
              ref={e => this.ActionSheet = e}
              title={'更多'}
              options={['取消订单', '投诉及反馈', '取消']}
              cancelButtonIndex={2}
              destructiveButtonIndex={0}
              onPress={this._pressActionSheet.bind(this)}
            />
          )
        }
        {
          (this.props.jobs.status === 'ARRIVED') && (
            <ActionSheet
              ref={e => this.ActionSheet = e}
              title={'更多'}
              options={['无法联系乘客', '投诉及反馈', '取消']}
              cancelButtonIndex={2}
              destructiveButtonIndex={0}
              onPress={this._pressActionSheet.bind(this)}
            />
          )
        }
        {
          (this.props.jobs.status === 'ON_BOARD') && (
            <ActionSheet
              ref={e => this.ActionSheet = e}
              title={'更多'}
              options={['投诉及反馈', '取消']}
              cancelButtonIndex={1}
              destructiveButtonIndex={0}
              onPress={this._pressActionSheet.bind(this)}
            />
          )
        }
      </Modal>
    )
  }
})