import React, { Component, PureComponent } from 'react'
import {
  Text, View, Animated, StyleSheet, Platform, StatusBar, Image, TouchableOpacity, ScrollView, Linking, Alert
} from 'react-native'
import { connect } from 'react-redux'
import moment from 'moment'
import { SafeAreaView } from 'react-navigation';

import { MapView, Marker, Utils } from '../../native/AMap'
import { Screen, Icons, Redux, Define, System, Session,TextFont } from '../../utils'
import { Button } from '../../components'
import Resources from '../../resources'
import { application, booking } from '../../redux/actions'
import WalletTransactionListScreen from '../wallet/wallet.transaction.list'
import IncomeList from '../income/income.list'
import { FormattedMessage } from 'react-intl';

const { height, width } = Screen.window

const MAP_DEFINE = {
  showsCompass: false,
  showsScale: false,
  tiltEnabled: false,
  rotateEnabled: false,
  showsTraffic: false,
  showsZoomControls: false, /* android fix */
}

// const styles = StyleSheet.create({
//   pageWrap: { width: width, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white' },
//   itemWrap: { alignItems: 'center', justifyContent: 'center' },
//   itemTitle: { color: '#666', fontSize: 14, fontWeight: '100', marginBottom: 8 },
//   itemImageContent: { marginHorizontal: 6, width: 68, height: 68, borderRadius: 33, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderWidth: 3 },
//   itemImage: { opacity: 0.7, width: 66, height: 66, borderRadius: 33, borderWidth: 1.5, borderColor: 'white', resizeMode: 'cover' }
// })

/**
 * @desc bookingDetailButton 按钮
 */
const BookingDetailButton = (props) => {
  const { onPress, iconName, style } = props;
  return(
    <TouchableOpacity onPress={onPress}
                      style={[{ backgroundColor: '#eee', width: 58, height: 58, borderRadius: 29, justifyContent: 'center', alignItems: 'center'}, style]}>
      <Image source={iconName} style={{width:58, height:58}}/>
    </TouchableOpacity>
  )
};
/**
 * @desc bookingDetail 顶部View，用户信息，拨打电话，发送短信
 */
const BookingDetailHeaderView = (props) => {
  const { avatars, fullName, userId, phoneCountryCode, phoneNo } = props.passenger_info;
  return(
    <View style={{height:80, flexDirection: 'row', alignItems:'center', justifyContent:'space-between', borderTopLeftRadius:20, borderTopRightRadius: 20,
      backgroundColor: 'white'
    }}>
      <View style={{flexDirection: 'row'}}>
        <Image source={{ uri: avatars === undefined ? 'https://storage.googleapis.com/dacsee-service-user/_shared/default-profile.jpg' : avatars[avatars.length - 1].url }}
               style={{ width: 54, height: 54 , borderRadius: 27, marginLeft: 14 }} />
        <View>
          <Text style={{ marginLeft: 10, marginTop: 5, fontSize: TextFont.TextSize(17), color: '#000', fontWeight: 'bold' }}>{ fullName }</Text>
          <Text style={{ marginLeft: 10, marginTop: 2, fontSize: TextFont.TextSize(14), color: 'rgba(0, 0, 0, 0.5)' }}>{ `User ID: ${userId}` }</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row'}}>
        <BookingDetailButton iconName={Resources.image.booking_detail_message} style={{ marginRight: 10,}} onPress={()=>Linking.openURL(`sms:${phoneCountryCode}${phoneNo}`)}/>
        <BookingDetailButton iconName={Resources.image.booking_detail_phone} style={{ marginRight: 10,}} onPress={()=>Linking.openURL(`tel:${phoneCountryCode}${phoneNo}`)}/>
      </View>
    </View>
  )
};
/**
 * @desc bookingDetail listItem
 */
const BookingDetailListItem = (props) => {
  const { style, icon, title, titleStyle, linkingIconName, linkingIconStyle, rightViewStyle, onPress } = props;
  return(
    <View>
    <View style={[{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: 38, width, backgroundColor:'white'}, style]}>
      <View style={{flexDirection: 'row', alignItems: 'center',marginTop:8,marginBottom: 8}}>
        <View style={{width:40, alignItems:'flex-end'}}>
        {icon}
        </View>
        <Text style={[{fontSize: TextFont.TextSize(17), marginLeft: 12, width: width - 105, fontWeight:'bold'}, titleStyle]}>{title}</Text>
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
      <View style={{backgroundColor: '#d7d7d7', width, height: 0.5}}/>

    </View>
  )
};

/**
 * @desc bookingDetail 详情View
 */
const BookingDetailView = (props) => {
  const { destination, from, payment_method, fare, booking_at, passenger_info, _id } = props.jobDetail;
  const time = moment(booking_at).format('YYYY-MM-D HH:mm');
  return(
    <View style={{backgroundColor: 'transparent', height: height / 3 * 2 }}>
      <BookingDetailHeaderView passenger_info={passenger_info}/>
      <ScrollView>
        <BookingDetailListItem title={time}
                               titleStyle={{color:'#fff'}}
                               icon={<Image style={{height:30,width:30}}
                                            source={Resources.image.booking_detail_bell}/>}
                               style={{backgroundColor:'#ff2239'}}
        />
        <BookingDetailListItem title={from.address}
                               icon={<View style={{height: 10, width: 10, marginRight: 10, borderRadius:5, backgroundColor:'#1ab2fd'}}/>}
                               linkingIconName={Resources.image.booking_detail_linking}
                               onPress={_ => alert('from')}
        />
        <BookingDetailListItem title={destination.address}
                               icon={<View style={{height: 10, width: 10, marginRight: 10, borderRadius:5, backgroundColor:'#ffb539'}}/>}
                               linkingIconName={Resources.image.booking_detail_linking}
                               onPress={_ => alert('destination')}
        />
        <BookingDetailListItem title={<FormattedMessage id={'car_standard'}/>}
                               icon={<Image style={{height:14,width:14, marginRight:8}}
                                            source={Resources.image.booking_detail_car}/>}
        />
        <BookingDetailListItem title={payment_method == 'Cash' ? '现金' : payment_method}
                               icon={<Image style={{height:14,width:14, marginRight:8}}
                                            source={Resources.image.booking_detail_payment}/>}
        />
        <BookingDetailListItem title={ <FormattedMessage id={'note_to_driver'}/>}
                               icon={<Image style={{height:14,width:14, marginRight:8}}
                                            source={Resources.image.booking_detail_info}/>}
        />
      </ScrollView>
    </View>
  )
};

/**
 * @desc bookingDetail 底部处理View
 */
const BookingDetailBottomView = (props) => {
  const fare  = props.fare;

  const getOption = props.getOption;

  const i18n = props.i18n;
  const optionObject = props.optionObject;
  const chineseStatus = props.chineseStatus;

  return(
    <View style={[styles.JobDetailWrap,{ height: 61, width, backgroundColor:'white' }]}>
      <View style={{ height: 1, backgroundColor: '#d7d7d7' }} />
      <View style={{flexDirection: 'row', flex:1, justifyContent: 'space-between'}}>
        <View style={{ justifyContent:'center'}}>
          <Text style={{fontSize: 15, marginLeft:24, color: 'rgba(0,0,0,0.75)'}}>
            RM
            <Text style={{fontSize: 27, fontWeight:'bold'}}>{` ${fare.toFixed(2)}`}</Text>
          </Text>
        </View>

        {
          !getOption ?
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10}}>
              <Button style={{ borderRadius: 5, width: 100, height: 40, backgroundColor: '#E8969E', marginRight: 10 }} onPress={ optionObject.leftAction }>
                <Text style={{ fontSize: TextFont.TextSize(18), fontWeight: 'bold', color: 'white'}}>{ i18n[optionObject.left] }</Text>
              </Button>
              <Button style={{ borderRadius: 5, width: 100, height: 40, backgroundColor: '#7FCE34' }}>
                <Text style={{ fontSize: TextFont.TextSize(18), fontWeight: 'bold', color: 'white'}} onPress={ optionObject.rightAction }>{ i18n[optionObject.right] }</Text>
              </Button>
            </View> :
            <View style={{justifyContent:'center', alignItems: 'center', marginRight:20 }}>
              <Text style={{ fontSize: TextFont.TextSize(15) ,fontWeight: 'bold',  }}>{ chineseStatus}</Text>
            </View>
        }
      </View>
    </View>
  )
};

export default connect(state => ({
  i18n: state.intl.messages || {},
  working: state.driver.working,
  jobs: state.driver.jobs
}))(class JobsListDetailScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      drawerLockMode: 'locked-closed',
      title: '订单详情'
    }
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
        Alert.alert('拒绝该订单', '确认拒绝该订单吗?', [
          { text: '取消' },
          { text: '确认', onPress: async () => {
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
        Alert.alert('取消行程', '乘客正等待接驾中，取消订单将会影响您的信用，继续吗?', [
          { text: '放弃' },
          { text: '确认取消', onPress: async () => {
            try {
              await Session.Booking.Put(`v1/${_id}`, { action: 'cancel' })
              this.props.navigation.goBack()
            } catch (e) {
              this.props.dispatch(application.showMessage('无法连接到服务器，请稍后再试'))
            }
          } }
        ])
      }, rightAction: async () => {
        Alert.alert('已到达上车地点', '点击继续将通知乘客已到达', [
          { text: '取消' },
          { text: '继续', onPress: async () => {
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
        Alert.alert('取消订单', '无法找到乘客?该订单将转至人工处理', [
          { text: '放弃' },
          { text: '确认取消', onPress: async () => {
            try {
              await Session.Booking.Put(`v1/${_id}`, { action: 'cancel' })
              this.props.navigation.goBack()
            } catch (e) {
              this.props.dispatch(application.showMessage('无法连接到服务器，请稍后再试'))
            }
          } }
        ])
      }, rightAction: () => {
        Alert.alert('开始行程', '点击继续将开始行程', [
          { text: '取消' },
          { text: '继续', onPress: async () => {
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
        Alert.alert('取消订单', '取消订单后，您将会受到处罚', [
          { text: '放弃' },
          { text: '确认取消', onPress: async () => {
            try {
              await Session.Booking.Put(`v1/${_id}`, { action: 'cancel' })
              this.props.navigation.goBack()
            } catch (e) {
              this.props.dispatch(application.showMessage('无法连接到服务器，请稍后再试'))
            }
          } }
        ])
      }, rightAction: () => {
        Alert.alert('结束行程', '已到达乘客目的地，点击确认完成行程', [
          { text: '取消' },
          { text: '继续', onPress: async () => {
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
    switch(str) {
    // case 'Pending_Passenger':
    //   return '等待乘客'
    // case 'Pending_Assignment':
    //   return ''
    case 'Pending_Acceptance':
      return '等待接单'
    // case 'Confirmed':
    //   return ''
    case 'On_The_Way':
      return '司机即将到达'
    case 'Arrived':
      return '司机已到达'
    case 'No_Show':
      return '乘客未抵达'
    case 'On_Board':
      return '完成订单'
    case 'Completed':
      return '订单完成'
    case 'Cancelled_by_Passenger':
      return '乘客已取消'
    case 'Cancelled_by_Driver':
      return '司机已取消'
    case 'Rejected_by_Driver':
      return '司机已拒绝'
    case 'No_Taker':
      return '订单无人应答'
    }
  }

  componentWillReceiveProps(props) {
    if (props.working && props.jobs !== this.props.jobs) {
      const { _id } = props.navigation.state.params.jobDetail
      this.setState({
        detail : props.jobs.find(pipe => pipe._id === _id)
      })
      if (!this.state.detail) {
        this.props.navigation.goBack()
      }
    }
  }

  render() {
    const { destination, from, fare } = this.props.navigation.state.params.jobDetail;
    const { i18n } = this.props;
    const { status } = this.state.detail
    const optionObject = this._getStatus(status);
    const getOption = this._getOptionable(status);
    const chineseStatus = this._statusInChinese(status);

    return(
      <SafeAreaView style={{flex:1}}>
        <MapView
          {...MAP_DEFINE}
          style={{ height: height / 3  - 64 }}
          mapType={'standard'}
          coordinate={{ latitude: from.coords.lat, longitude: from.coords.lng }}
          zoomLevel={ 10 }
          // region={{ latitude: from.coords.lat, longitude: from.coords.lng, latitudeDelta: destination.coords.lat, longitudeDelta: destination.coords.lng }}
          ref={e => this.map = e}
        >
          <Marker image={'rn_amap_startpoint'} coordinate={{ latitude: from.coords.lat, longitude: from.coords.lng }} title={from.name}/>
          <Marker image={'rn_amap_endpoint'} coordinate={{ latitude: destination.coords.lat, longitude: destination.coords.lng }} title={destination.name}/>
        </MapView>
        <BookingDetailView jobDetail={this.props.navigation.state.params.jobDetail} i18n={i18n} detail={this.state.detail} optionObject={optionObject}/>
        <BookingDetailBottomView fare={fare} getOption={getOption} i18n={i18n} optionObject={optionObject} chineseStatus={chineseStatus}/>
      </SafeAreaView>
    )
  }
})

const styles = StyleSheet.create({
  JobDetailWrap: Platform.select({
    ios: { position: 'absolute', bottom: Define.system.ios.x ? 20 : 0, left: 0, right: 0},
    android: { position: 'absolute', bottom: 0, left: 0, right: 0 }
  }),
})
