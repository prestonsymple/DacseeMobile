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
      const { latitude, longitude } = this.state.current
      const { from } = this.props.jobs.detail
      if (!this.map) return undefined
      this.map.animateTo({ zoomLevel: 17, coordinate: { latitude, longitude } }, 500)
      this.map.calculateDriveRouteWithStartPoints({ latitude, longitude }, {
        latitude: from.coords.lat,
        longitude: from.coords.lng
      })
    }, 5000)
    this.eventListener = RCTDeviceEventEmitter.addListener('EVENT_AMAP_VIEW_ROUTE_SUCCESS', async (args) => {
      const { detail } = this.props.jobs
      if (!detail || !detail.from || !this.props.visible) return undefined;
      const { from, destination } = detail
      const route = Array.isArray(args) ? args[0] : args
      route.polylines = route.routeNaviPoint.map(pipe => ({
        latitude: pipe.lat, 
        longitude: pipe.lng
      }))
      this.setState({ route })
    })
  }

  componentWillUnmount() {
    console.log(this.timer)
    this.timer && this.timer.remove()
  }

  async onLocationListener({ nativeEvent }) {
    const { latitude, longitude } = nativeEvent
    if (latitude === 0 || longitude === 0) return undefined
    this.setState({ current: { latitude, longitude } })

    try {
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
        { text: '取消该订单', onPress: () => {
          this.props.dispatch(Jobs.cancelJobs()),
          this.props.dispatch(application.showMessage('无法请求该接口'))
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
    const { route } = this.state
    const { booking_id = '', detail = {} } = jobs
    const { destination, from, type, payment_method, notes, fare, passenger_info } = detail

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
              <Text style={{ fontWeight: '600', fontSize: 16, color: '#333' }}>接驾中</Text>
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
              locationInterval={5000}
              distanceFilter={100}
              locationStyle={{ }}
              onLocation={this.onLocationListener.bind(this)}
              ref={e => this.map = e}>

              { from && (<Marker image={'rn_amap_startpoint'} coordinate={{ latitude: from.coords.lat, longitude: from.coords.lng }} />) }
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
            <View style={{ height: Define.system.ios.x ? 52 + 22 : 52 }}>
              <TouchableOpacity onPress={async () => {
                Alert.alert('已到达', '立即通知乘客车辆已到达指定位置，确认后无法取消', [
                  { text: '确定', onPress: async () => {
                    // await Session.
                  } },
                  { text: '取消', onPress: () => {} }
                ])
              }} activeOpacity={.7} style={{ backgroundColor: '#f1af41', paddingBottom: Define.system.ios.x ? 22 : 0, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, color: 'white', fontWeight: '400' }}>通知乘客已到达</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <ActionSheet
          ref={e => this.ActionSheet = e}
          title={'更多'}
          options={['取消订单', '投诉及反馈', '取消']}
          cancelButtonIndex={2}
          destructiveButtonIndex={0}
          onPress={this._pressActionSheet.bind(this)}
        />
      </Modal>
    )
  }
})