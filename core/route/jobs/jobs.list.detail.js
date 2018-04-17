import React, { Component, PureComponent } from 'react'
import {
  Text, View, ActivityIndicator, StyleSheet, Platform, alert, Image, TouchableOpacity, ScrollView, Linking, Alert
} from 'react-native'
import { connect } from 'react-redux'
import moment from 'moment'
import { SafeAreaView } from 'react-navigation'

import { Screen, Icons, Redux, Define, System, Session,TextFont } from '../../utils'
import { MapView as AMapView, Marker as AMarker, Polyline as APolyline } from '../../native/AMap'
import GoogleMapView, { Marker as GoogleMarker, Polyline as GooglePolyline } from 'react-native-maps'
import { Button } from '../../components'
import Resources from '../../resources'
import { application, booking } from '../../redux/actions'
import { FormattedMessage } from 'react-intl'

const { height, width } = Screen.window

const MAP_DEFINE = {
  showsCompass: false,
  showsScale: false,
  tiltEnabled: false,
  rotateEnabled: false,
  showsTraffic: false,
  showsZoomControls: false, /* android fix */
}

/**
 * @desc bookingDetailButton 按钮
 */
const BookingDetailButton = (props) => {
  const { onPress, style,children} = props
  return(
    <TouchableOpacity
      onPress={onPress}
      style={[{ backgroundColor: '#eee', width: 46, height: 46, borderRadius: 23, justifyContent: 'center', alignItems: 'center'}, style]}>
      {children}
    </TouchableOpacity>
  )
}
/**
 * @desc bookingDetail 顶部View，用户信息，拨打电话，发送短信
 */
const BookingDetailHeaderView = (props) => {
  console.log(props)

  const { passenger_info } = props
  const { avatars = [], fullName, userId, phoneCountryCode, phoneNo } = passenger_info
  return(
    <View style={{height:80, flexDirection: 'row', alignItems:'center', justifyContent:'space-between', borderTopLeftRadius:20, borderTopRightRadius: 20,
      backgroundColor: 'white'
    }}>
      <View style={{flexDirection: 'row'}}>
        <Image
          source={{ uri: avatars.length === 0 ? 'https://storage.googleapis.com/dacsee-service-user/_shared/default-profile.jpg' : avatars[avatars.length - 1].url }}
          style={{ width: 54, height: 54 , borderRadius: 27, marginLeft: 14 }} />
        <View>
          <Text style={{ marginLeft: 10, marginTop: 5, fontSize: TextFont.TextSize(17), color: '#000', fontWeight: 'bold' }}>{ fullName }</Text>
          <Text style={{ marginLeft: 10, marginTop: 2, fontSize: TextFont.TextSize(14), color: 'rgba(0, 0, 0, 0.5)' }}>{ `User ID: ${userId}` }</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row'}}>
        <BookingDetailButton  style={{ marginRight: 10,}} onPress={()=>Linking.openURL(`sms:${phoneCountryCode}${phoneNo}`)}>
          <View>{ Icons.Generator.Awesome('comment', 24, '#666') }</View>
        </BookingDetailButton>
        <BookingDetailButton  style={{ marginRight: 10,}} onPress={()=>Linking.openURL(`tel:${phoneCountryCode}${phoneNo}`)}>
          <View>{ Icons.Generator.Material('phone-in-talk', 24, '#666') }</View>
        </BookingDetailButton>
      </View>
    </View>
  )
}
/**
 * @desc bookingDetail listItem
 */
const BookingDetailListItem = (props) => {
  const { style, icon, title, titleStyle, linkingIconName, linkingIconStyle, rightViewStyle, onPress ,hideLine } = props
  return(
    <View>
      <View style={[{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: 44, width, backgroundColor:'white'}, style]}>
        <View style={{flexDirection: 'row', alignItems: 'center',marginTop:8,marginBottom: 8}}>
          <View style={{width:40, alignItems:'flex-end'}}>
            {icon}
          </View>
          <Text style={[{fontSize: TextFont.TextSize(15), marginLeft: 12, width: width - 105, fontWeight:'bold'}, titleStyle]}>{title}</Text>
        </View>
        {
          linkingIconName
            ?
            <TouchableOpacity style={[{width: 40}, rightViewStyle]} onPress={onPress}>
              <Image style={[{height: 30, width: 30, marginTop: 4}, linkingIconStyle]} source={linkingIconName}/>
            </TouchableOpacity>
            :
            null
        }
      </View>
      {!hideLine&&<View style={{backgroundColor: '#eee', width, height: 0.8}}/>}
    </View>
  )
}

/**
 * @desc bookingDetail 详情View
 */
const BookingDetailView = (props) => {
  const { destination,fare, from, payment_method, booking_at, passenger_info, _id } = props.jobDetail
  const {optionObject,chineseStatus,i18n,getOption} = props
  const time = moment(booking_at).format('YYYY-MM-D HH:mm')
  return(
    <View style={{backgroundColor: 'transparent', height: height / 2  }}>
      <BookingDetailHeaderView passenger_info={passenger_info}/>
      <ScrollView style={{flex:1}}>
        <View style={{backgroundColor: '#eee', width, height: 0.8}}/>
        {/* <BookingDetailListItem
          title={time}
          titleStyle={{color:'#fff'}}
          icon={<Image style={{height:30,width:30}} source={Resources.image.booking_detail_bell}/>}
          style={{backgroundColor:'#ff2239'}}
        /> */}
        <BookingDetailListItem
          title={from.address}
          icon={<View style={{height: 10, width: 10, marginRight: 10, borderRadius:5, backgroundColor:'#1ab2fd'}}/>}
          linkingIconName={Resources.image.booking_detail_linking}
          onPress={() => {
            // getDirections({
            //   destination: { latitude: from.coords.lat, longitude: from.coords.lng },
            //   params: [
            //     { key: 'travelmode', value: 'driving' },
            //     { key: 'dir_action', value: 'navigate' }
            //   ]
            // })
          }}
        />
        <BookingDetailListItem
          title={destination.address}
          icon={<View style={{height: 10, width: 10, marginRight: 10, borderRadius:5, backgroundColor:'#ffb539'}}/>}
          linkingIconName={Resources.image.booking_detail_linking}
          onPress={() => {
            // getDirections({
            //   destination: { latitude: destination.coords.lat, longitude: destination.coords.lng },
            //   params: [
            //     { key: 'travelmode', value: 'driving' },
            //     { key: 'dir_action', value: 'navigate' }
            //   ]
            // })
          }}
        />
        <BookingDetailListItem
          title={<FormattedMessage id={'car_standard'}/>}
          icon={<Image style={{height:14,width:14, marginRight:8}} source={Resources.image.booking_detail_car}/>}
        />
        <BookingDetailListItem
          title={payment_method == 'Cash' ? <FormattedMessage id={'cash'}/> : payment_method}
          icon={<Image style={{height:18,width:14, marginRight:8}} resizeMode='contain' source={Resources.image.booking_detail_payment}/>}
        />
        <BookingDetailListItem
          title={ <FormattedMessage id={'note_to_driver'}/>}
          hideLine={true}
          icon={<Image style={{height:14,width:14, marginRight:8}} source={Resources.image.booking_detail_info}/>}
        />
      </ScrollView>
      <BookingDetailBottomView fare={fare} getOption={getOption} i18n={i18n} optionObject={optionObject} chineseStatus={chineseStatus}/>
    </View>
  )
}

/**
 * @desc bookingDetail 底部处理View
 */
const BookingDetailBottomView = (props) => {
  const fare  = props.fare

  const getOption = props.getOption

  const i18n = props.i18n
  const optionObject = props.optionObject
  const chineseStatus = props.chineseStatus

  return(
    <View style={[styles.JobDetailWrap,{ height: 61, width, backgroundColor:'#fff' }]}>
      <View style={{ height: 1, backgroundColor: '#d7d7d7' }} />
      <View style={{flexDirection: 'row',flex:1, justifyContent: 'space-between',alignItems:'center'}}>
        <View style={{ justifyContent:'center'}}>
          <Text style={{fontSize: 14, marginLeft:24, color: 'rgba(0,0,0,0.75)'}}>
            RM
            <Text style={{fontSize: 24 , fontWeight:'bold'}}>{` ${fare.toFixed(2)}`}</Text>
          </Text>
        </View>

        {
          getOption ?
            <View style={{ flexDirection: 'row', marginRight: 10,marginBottom:10}}>
              <Button style={{ borderRadius: 5, width: 100, height: 40, backgroundColor: '#E8969E', marginRight: 10 }} onPress={ optionObject.leftAction }>
                <Text style={{ fontSize: TextFont.TextSize(16), fontWeight: 'bold', color: 'white'}}>{ i18n[optionObject.left] }</Text>
              </Button>
              <Button style={{ borderRadius: 5, width: 100, height: 40, backgroundColor: '#7FCE34' }}>
                <Text style={{ fontSize: TextFont.TextSize(16), fontWeight: 'bold', color: 'white'}} onPress={ optionObject.rightAction }>{ i18n[optionObject.right] }</Text>
              </Button>
            </View> :
            <View style={{justifyContent:'center', alignItems: 'center', marginRight:20 }}>
              <Text style={{ fontSize: TextFont.TextSize(15) ,fontWeight: 'bold',  }}>{ chineseStatus}</Text>
            </View>
        }
      </View>
    </View>
  )
}

export default connect(state => ({
  i18n: state.intl.messages || {},
  working: state.driver.working,
  jobs: state.driver.jobs,
  map_mode: state.application.map_mode
}))(class JobsListDetailScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    const reducer = global.store.getState()
    const { jobDetail } = navigation.state.params

    const navMap = {
      drawerLockMode: 'locked-closed',
      title: reducer.intl.messages.job_detail
    }

    if (
      jobDetail.status === 'On_The_Way' ||
      jobDetail.status === 'Arrived' ||
      jobDetail.status === 'On_Board' ||
      jobDetail.status === 'Pending_Acceptance'
    ) {
      navMap.headerLeft = null
      navMap.gesturesEnabled = false
    }
    return navMap
  }

  constructor(props) {
    super(props)
    const { _id } = props.navigation.state.params.jobDetail
    this.state = {
      route: {
        routeBounds: {
          northEast: { longitude: 0, latitude: 0 },
          southWest: { longitude: 0, latitude: 0 }
        },
        routeCenterPoint: { longitude: 0, latitude: 0 },
        routeLength: 0,
        routeNaviPoint: [],
        routeTime: 0,
        routeTollCost: 0
      },

      detail: props.jobs.find(pipe => pipe._id === _id) ? props.jobs.find(pipe => pipe._id === _id) : props.navigation.state.params.jobDetail
    }
  }

  _getStatus(status) {
    const { _id } = this.props.navigation.state.params.jobDetail
    switch (status) {
    case 'Pending_Acceptance':
      return {left: 'reject', right: 'accept', leftAction: async () => {
        Alert.alert(this.props.i18n.reject_order, this.props.i18n.confirm_reject_order, [
          { text: this.props.i18n.cancel},
          { text: this.props.i18n.confirm, onPress: async () => {
            try {
              await Session.Booking.Put(`v1/${_id}`, { action: 'reject' })
              this.props.navigation.goBack()
            } catch (e) {
              this.props.dispatch(application.showMessage('无法连接到服务器，请稍后再试'))
            }
          } }
        ])
      }, rightAction: async () => {
        try {
          await Session.Booking.Put(`v1/${_id}`, { action: 'accept' })
        } catch (e) {
          this.props.dispatch(application.showMessage('无法连接到服务器，请稍后再试'))
        }
      } }
    case 'On_The_Way':
      return {left: 'cancel', right: 'on_the_way', leftAction: async () => {
        Alert.alert(this.props.i18n.cancel_trip, this.props.i18n.waiting_cancel_punish, [
          { text: this.props.i18n.cancel },
          { text: this.props.i18n.confirm, onPress: async () => {
            try {
              await Session.Booking.Put(`v1/${_id}`, { action: 'cancel' })
              this.props.navigation.goBack()
            } catch (e) {
              this.props.dispatch(application.showMessage('无法连接到服务器，请稍后再试'))
            }
          } }
        ])
      }, rightAction: async () => {
        Alert.alert(this.props.i18n.arrive_place, this.props.i18n.touch_continue_notice_passengers, [
          { text: this.props.i18n.cancel  },
          { text: this.props.i18n.continue_ , onPress: async () => {
            try {
              await Session.Booking.Put(`v1/${_id}`, { action: 'arrived' })
            } catch (e) {
              this.props.dispatch(application.showMessage('无法连接到服务器，请稍后再试'))
            }
          } }
        ])
      } }
    case 'Arrived':
      return {left: 'No_Show', right: 'On_Board', leftAction: () => {
        Alert.alert(this.props.i18n.cancel_order, this.props.i18n.unable_find_move_customer_service, [
          { text: this.props.i18n.cancel},
          { text: this.props.i18n.confirm, onPress: async () => {
            try {
              await Session.Booking.Put(`v1/${_id}`, { action: 'cancel' })
              this.props.navigation.goBack()
            } catch (e) {
              this.props.dispatch(application.showMessage('无法连接到服务器，请稍后再试'))
            }
          } }
        ])
      }, rightAction: () => {
        Alert.alert(this.props.i18n.start_trip, this.props.i18n.touch_continue_start_trip, [
          { text: this.props.i18n.cancel },
          { text: this.props.i18n.continue_ , onPress: async () => {
            try {
              await Session.Booking.Put(`v1/${_id}`, { action: 'on_board' })
            } catch (e) {
              this.props.dispatch(application.showMessage('无法连接到服务器，请稍后再试'))
            }
          } }
        ])
      } }
    case 'On_Board':
      return { left: 'cancel', right: 'Completed', leftAction: () => {
        Alert.alert(this.props.i18n.cancel_order, this.props.i18n.cancel_order_punish, [
          { text: this.props.i18n.cancel},
          { text: this.props.i18n.confirm, onPress: async () => {
            try {
              await Session.Booking.Put(`v1/${_id}`, { action: 'cancel' })
              this.props.navigation.goBack()
            } catch (e) {
              this.props.dispatch(application.showMessage('无法连接到服务器，请稍后再试'))
            }
          } }
        ])
      }, rightAction: () => {
        Alert.alert(this.props.i18n.finish_trip, this.props.i18n.arrive_touch_finish, [
          { text: this.props.i18n.cancel},
          { text: this.props.i18n.continue_, onPress: async () => {
            try {
              await Session.Booking.Put(`v1/${_id}`, { action: 'completed' })
              this.props.navigation.goBack()
            } catch (e) {
              this.props.dispatch(application.showMessage('无法连接到服务器，请稍后再试'))
            }
          } }
        ])
      } }
    default:
      return {}
    }
  }

  _getOptionable(status) {
    if (status == 'Pending_Acceptance' || status == 'On_The_Way' || status == 'Arrived' || status === 'On_Board') {
      return true
    }
    return false
  }

  _statusInChinese(str) {
    const { i18n} = this.props
    switch(str) {
    // case 'Pending_Passenger':
    //   return '等待乘客'
    // case 'Pending_Assignment':
    //   return ''
    case 'Pending_Acceptance':
      return i18n.Pending_Acceptance
    // case 'Confirmed':
    //   return ''
    case 'On_The_Way':
      return i18n.On_The_Way
    case 'Arrived':
      return i18n.Arrived
    case 'No_Show':
      return i18n.No_Show
    case 'On_Board':
      return i18n.On_Board
    case 'Completed':
      return i18n.Completed
    case 'Cancelled_by_Passenger':
      return i18n.Cancelled_by_Passenger
    case 'Cancelled_by_Driver':
      return i18n.Cancelled_by_Driver
    case 'Rejected_by_Driver':
      return i18n.Rejected_by_Driver
    case 'No_Taker':
      return i18n.No_Taker
    }
  }

  componentWillReceiveProps(props) {
    if (props.working && props.jobs !== this.props.jobs) {
      const { jobDetail } = props.navigation.state.params
      const { _id } = jobDetail
      const current = props.jobs.find(pipe => pipe._id === _id)
      if (!current) this.props.navigation.goBack()

      this.props.navigation.setParams({ jobDetail: current })
      this.setState({ detail: current })
    }
  }

  render() {
    const { i18n, map_mode, navigation } = this.props
    const { destination, from, fare } = navigation.state.params.jobDetail
    const { detail = {} } = this.state
    const { status = 'Pending_Acceptance' } = detail
    const optionObject = this._getStatus(status)
    const getOption = this._getOptionable(status)
    const chineseStatus = this._statusInChinese(status)

    return(
      <SafeAreaView style={{flex:1}}>
        {
          map_mode === '' && (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="small" color="#333" style={{ top: -64 }} />
            </View>
          )
        }
        {
          map_mode === 'AMAP' && (
            <AMapView mapType={'standard'} coordinate={{ latitude: from.coords.lat, longitude: from.coords.lng }} zoomLevel={ 10 } ref={e => this.map = e} style={{ height: height / 2  - 64 }} {...MAP_DEFINE}>
              <AMarker image={'rn_amap_startpoint'} coordinate={{ latitude: from.coords.lat, longitude: from.coords.lng }} title={from.name}/>
              <AMarker image={'rn_amap_endpoint'} coordinate={{ latitude: destination.coords.lat, longitude: destination.coords.lng }} title={destination.name}/>
            </AMapView>
          )
        }
        {
          map_mode === 'GOOGLEMAP' && (
            <GoogleMapView initialRegion={{ latitude: from.coords.lat, longitude: from.coords.lng, latitudeDelta: 0.05, longitudeDelta: 0.05 }} ref={e => this.map = e} style={{ height: height / 3  - 64 }} {...MAP_DEFINE}>
              <GoogleMarker coordinate={{ latitude: from.coords.lat, longitude: from.coords.lng }}>
                <Image source={Resources.image.map_from_pin} />
              </GoogleMarker>
              <GoogleMarker coordinate={{ latitude: destination.coords.lat, longitude: destination.coords.lng }}>
                <Image source={Resources.image.map_destination_pin} />
              </GoogleMarker>
            </GoogleMapView>
          )
        }
        <BookingDetailView jobDetail={this.props.navigation.state.params.jobDetail}
          i18n={i18n} detail={this.state.detail} 
          getOption={getOption}
          optionObject={optionObject} chineseStatus={chineseStatus}/>
       
      </SafeAreaView>
    )
  }
})

const styles = StyleSheet.create({
  JobDetailWrap: Platform.select({
    ios: { paddingBottom: Define.system.ios.x ? 20 : 0},
    android: {  paddingBottom: 0}
  }),
})
