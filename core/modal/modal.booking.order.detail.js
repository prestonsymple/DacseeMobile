/* eslint-disable */
import React, { Component, PureComponent } from 'react'
import { 
  View, TouchableOpacity, Modal, Text, Animated, Alert, AppState, TextInput, ScrollView, ListView,
  Image, Platform, DeviceEventEmitter
} from 'react-native'
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter'
import InteractionManager from 'InteractionManager'
import * as Progress from 'react-native-progress'
import CodePush from 'react-native-code-push'
import { connect } from 'react-redux'
import { NavigationActions, SafeAreaView } from 'react-navigation'

/*****************************************************************************************************/
import { System, Icons, Screen, Define, Session } from '../utils'
import { Button } from '../components'
import { jobs as Jobs } from '../redux/actions'
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
  visible: state.application.show_driver_order,
  jobs: state.jobs
}))(class BookingOrderDetailModal extends Component {

  constructor(props) {
    super(props)
    this.state = {
      ready: false,
      current: {}
    }
    this.timer = undefined
  }

  async componentDidMount() {
    this.eventListener = RCTDeviceEventEmitter.addListener('EVENT_AMAP_VIEW_ROUTE_SUCCESS', async (args) => {
      const { detail } = this.props.jobs
      if (!detail || !detail.destination || !detail.from || !this.props.visible) return undefined;
      const { from, destination } = detail
      // 初始化
      const route = Array.isArray(args) ? args[0] : args
      const distance = await Utils.distance(from.coords.lat, from.coords.lng, destination.coords.lat, destination.coords.lng)
      const km = distance / 1000

      let zoom = 16
      if (km >= 160) { zoom = 8 }
      else if (km >= 80) { zoom = 9 }
      else if (km >= 40) { zoom = 10 }
      else if (km >= 20) { zoom = 11 } 
      else if (km >= 10) { zoom = 12 }
      else if (km >= 5) { zoom = 13 }
      else if (km >= 2.5) { zoom = 14 }
      else { zoom = 15 }

      zoom -= 1

      const { routeCenterPoint, routeLength } = route

      this.map.animateTo({ zoomLevel: zoom, coordinate: { latitude: routeCenterPoint.latitude, longitude: routeCenterPoint.longitude } }, 500) 
      this.props.dispatch(Jobs.setJobs({ route }))
    })
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
    if (props.jobs && props.jobs.detail !== this.props.jobs.detail && props.jobs.detail.destination && props.jobs.detail.from) {
      await InteractionManager.runAfterInteractions()

      const { from, destination } = props.jobs.detail
      this.map.calculateDriveRouteWithStartPoints({
        latitude: from.coords.lat,
        longitude: from.coords.lng
      }, {
        latitude: destination.coords.lat,
        longitude: destination.coords.lng
      })
    }
  }

  render() {
    const { visible, jobs = {} } = this.props
    const { booking_id = '', detail = {} } = jobs
    const { destination, from, type, payment_method, notes, fare } = detail

    return (
      <Modal onRequestClose={() => {}} visible={visible} transparent={false} style={{ }}>
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          {/* NavBar */}
          <View style={[
            { height: Define.system.ios.x ? 88 : 64, backgroundColor: 'white' },
            { shadowOffset: { width: 0, height: 3 }, shadowColor: '#999', shadowOpacity: .5, shadowRadius: 3 },
            { borderColor: '#f2f2f2', borderBottomWidth: .8 }
          ]}>
            <View style={{ marginTop: Define.system.ios.x ? 44 : 20, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', height: 44 }}>
              <Text style={{ fontWeight: '600', fontSize: 16, color: '#333' }}>行程详情</Text>
            </View>
          </View>
          {/* Main */}
          <View style={{ flex: 1 }}>
            <MapView
              {...MAP_DEFINE}
              style={{ flex: 1 }}
              locationEnabled={true}
              mapType={'standard'}
              locationInterval={1000}
              locationStyle={{ }}
              onLocation={this.onLocationListener.bind(this)}
              ref={e => this.map = e}>

              { destination && (<Marker image={'rn_amap_endpoint'} coordinate={{ latitude: destination.coords.lat, longitude: destination.coords.lng }} />) }
              { from && (<Marker image={'rn_amap_startpoint'} coordinate={{ latitude: from.coords.lat, longitude: from.coords.lng }} />) }

            </MapView>
          </View>
          <View style={[
            { height: Define.system.ios.x ? 380 + 24 : 380 },
            { shadowOffset: { width: 0, height: 3 }, shadowColor: '#999', shadowOpacity: .5, shadowRadius: 3 }
          ]}>
            <ScrollView contentContainerStyle={{ paddingVertical: 26, paddingHorizontal: 22 }}>
              <View style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 14, color: '#999', fontWeight: '400', marginBottom: 6 }}>乘客位置</Text>
                { from && (<Text style={{ top: -1.5, fontSize: 14, color: '#333', fontWeight: '400' }}>{ from.address }</Text>) }
              </View>
              <View style={{ }}>
                <Text style={{ fontSize: 14, color: '#999', fontWeight: '400', marginBottom: 6 }}>目的地</Text>
                { destination && (<Text style={{ top: -1.5, fontSize: 14, color: '#333', fontWeight: '400' }}>{ destination.address } {destination.name}</Text>) }
              </View>
              <View style={{ height: Define.system.ios.plus ? 1 : .8, backgroundColor: '#f2f2f2', marginVertical: 12 }} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 14, color: '#999', fontWeight: '400', marginBottom: 12 }}>行程费用</Text>
                { from && (<Text style={{ top: -1.5, fontSize: 14, color: '#333', fontWeight: '400' }}>￥{ parseInt(fare).toFixed(2) }</Text>) }
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                <Text style={{ fontSize: 14, color: '#999', fontWeight: '400' }}>预约车辆</Text>
                { type && (<Text style={{ top: -1.5, fontSize: 14, color: '#333', fontWeight: '400' }}>{ type === 'now' ? '否' : '是' }</Text>) }
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 14, color: '#999', fontWeight: '400' }}>支付方式</Text>
                { payment_method && (<Text style={{ top: -1.5, fontSize: 14, color: '#333', fontWeight: '400' }}>{ payment_method }</Text>) }
              </View>
              <View style={{ height: Define.system.ios.plus ? 1 : .8, backgroundColor: '#f2f2f2', marginVertical: 12 }} />
              <View style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 14, color: '#999', fontWeight: '400', marginBottom: 12 }}>备注信息</Text>
                { typeof(notes) !== 'undefined' && (<Text style={{ top: -1.5, fontSize: 14, color: '#666', fontWeight: '400' }}>{notes.length === 0 ? '无' : notes}</Text>) }
              </View>
            </ScrollView>
            <View style={{ flexDirection: 'row', height: Define.system.ios.x ? 52 + 22 : 52 }}>
              <TouchableOpacity onPress={async () => {
                try {
                  const { data } = await Session.booking.put(`v1/${booking_id}`, { action: 'accept' })
                  const { isSuccess } = data
                  if (isSuccess) {
                    this.props.dispatch(Jobs.hideJobsDetail())
                    this.props.dispatch(Jobs.acceptJobs())
                  }
                } catch (e) {
                  console.log(e)
                } finally {
                }
              }} activeOpacity={.7} style={{ backgroundColor: '#70c040', paddingBottom: Define.system.ios.x ? 22 : 0, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, color: 'white', fontWeight: '400' }}>接受(30s)</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={async () => {
                try {
                  const { data } = await Session.booking.put(`v1/${booking_id}`, { action: 'reject' })
                  console.log(data)
                } catch (e) {
                  console.log(e)
                } finally {
                  this.props.dispatch(Jobs.hideJobsDetail())
                  this.props.dispatch(Jobs.setJobs({
                    booking_id: '',
                    detail: {},
                    route: {}
                  }))
                }
              }} activeOpacity={.7} style={{ backgroundColor: '#eee', paddingBottom: Define.system.ios.x ? 22 : 0, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, color: '#666', fontWeight: '400' }}>拒绝</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    )
  }
})