import React, { Component } from 'react'
import {
  Text, View, Animated, StyleSheet, Image, ListView, Platform, ScrollView, DatePickerIOS, Modal, TouchableOpacity
} from 'react-native'
import InteractionManager from 'InteractionManager'
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter'
import DatePicker from 'react-native-datepicker'
import Picker from 'react-native-picker'

import { connect } from 'react-redux'
import Lottie from 'lottie-react-native'
import moment from 'moment'

import Resources from '../../resources'

import HeaderSection from './com.header.section'

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
      // contentComponent: () => (
      //   <View style={{ backgroundColor: '#333', flex: 1, height: 300, width: 400 }}></View>
      // ),
      headerStyle: {
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
      ready: false,
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
      carArgs: [],
      selectTime: new Date(),
      selectTimeShow: false,
      selectPayTypeShow: false
    }
    this.indicator = new Animated.Value(0)
  }

  async componentDidMount() {
    const { from, to } = this.props.data
    await InteractionManager.runAfterInteractions()
    this.eventListener = RCTDeviceEventEmitter.addListener('EVENT_AMAP_VIEW_ROUTE_SUCCESS', async (args) => {
      // 初始化
      const route = Array.isArray(args) ? args[0] : args
      const distance = await Utils.distance(from.location.lat, from.location.lng, to.location.lat, to.location.lng)
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

      if (System.Platform.Android) { // TODO: Android 中心点存在偏移
        this.map.animateTo({ zoomLevel: zoom, coordinate: { latitude: routeCenterPoint.latitude, longitude: routeCenterPoint.longitude } }, 500) 
      } else {
        this.map.animateTo({ zoomLevel: zoom, coordinate: { latitude: routeCenterPoint.latitude, longitude: routeCenterPoint.longitude } }, 500)
      }
      this.setState({ route })

      Animated.loop(Animated.timing(this.indicator, { toValue: 1, duration: 800, useNativeDriver: true })).start()
      this.selectCarType(this.props.data.type, routeLength)
    })

    this.map.calculateDriveRouteWithStartPoints({
      latitude: from.location.lat,
      longitude: from.location.lng
    }, {
      latitude: to.location.lat,
      longitude: to.location.lng
    })
  }

  componentWillUnmount() {
    this.eventListener && this.eventListener.remove()
  }

  componentWillReceiveProps(props) {
    if (props.data.type !== this.props.data.type) {
      this.setState({ carArgs: [] })
      Animated.loop(Animated.timing(this.indicator, { toValue: 1, duration: 800, useNativeDriver: true })).start()
      this.selectCarType(props.data.type, this.state.route.routeLength)
    }
  }

  async selectCarType(key, length) {
    const DEMO_DATA = {
      standard: [
        { price: `${((length / 1000) * 1.6).toFixed(1)}0`, title: '优选', key: 'standard-1', image: require('../../resources/images/Slice_Lux_Car.png') }
      ],
      circle: [
        { title: 'Vito', key: 'circle-1', circle: true, image: { uri: 'https://hbimg.b0.upaiyun.com/42c4da5880d187c52d5b5f4ed96fd13de57d48d1126e3-NxtDwz_fw658' } },
        { title: 'San', key: 'circle-2', circle: true, image: { uri: 'https://hbimg.b0.upaiyun.com/1bce054ced7a13eb4eff8218f7a6b36c554b9b3125617-19o1EY_fw658' } },
        { title: 'Chim', key: 'circle-3', circle: true, image: { uri: 'https://hbimg.b0.upaiyun.com/a476c4d19408c077bd6f0985827772ff6ebb677314bec-UNqdPS_fw658' } },
        { title: 'Jacky', key: 'circle-4', circle: true, image: { uri: 'https://hbimg.b0.upaiyun.com/bb5c6a527ba21dcad49bf515a1f851d294809a0917064-rkFyzP_fw658' } },
        { title: 'More', key: 'circle-5', circle: true, icon: Icons.Generator.Material('more-horiz', 34, '#666'), onPress: () => this.props.navigation.navigate('FriendsCircle') }
      ], 
      taxi: [
        { label: '打表计费', title: '出租车', key: 'taxi-1', image: require('../../resources/images/Slice_Taxi_Car.png') }
      ],
      eco: [
        { price: `${((length / 1000) * 1.3).toFixed(1)}0`, title: '经济型', key: 'eco-1', image: require('../../resources/images/Slice_Lux_Car.png') }
      ],
      lux: [
        { price: `${((length / 1000) * 2.2).toFixed(1)}0`, title: '舒适型', key: 'lux-1', image: require('../../resources/images/Slice_Lux_Car.png') },
        { price: `${((length / 1000) * 2.8).toFixed(1)}0`, title: '7座商务', key: 'lux-2', image: require('../../resources/images/Slice_Bussines_Car.png') },
        { price: `${((length / 1000) * 3.8).toFixed(1)}0`, title: '豪华型', key: 'lux-3', image: require('../../resources/images/Slice_Adv_Car.png') }
      ]
    }

    await (new Promise(resolve => setTimeout(() => resolve(), 1500)))
    this.indicator && this.indicator.stopAnimation()
    this.setState({ carArgs: DEMO_DATA[key] })
  }

  render() {
    const { route, carArgs } = this.state
    const { schedule, to, from, payment, type } = this.props.data

    // 计算到达时间
    const reachTime = moment(Date.now()).add(route.routeTime, 'seconds').format('HH:mm')

    return (
      <View style={{ flex: 1 }}>
        <MapView
          {...MAP_DEFINE}
          style={{ flex: 1 }}
          mapType={'standard'}
          ref={e => this.map = e}
        >
          <Marker image={'rn_amap_startpoint'} coordinate={{ latitude: from.location.lat, longitude: from.location.lng }} />
          <Marker image={'rn_amap_endpoint'} coordinate={{ latitude: to.location.lat, longitude: to.location.lng }} />
        </MapView>
        <HeaderSection type={this.props.data.type} dispatch={this.props.dispatch} />

        <View style={[
          styles.SelectBookingWrap
        ]}>
          <View style={[
            { marginBottom: 6, backgroundColor: 'white' }, 
            { borderColor: '#ccc', borderWidth: .8 },
            { shadowOffset: { width: 0, height: 2 }, shadowColor: '#999', shadowOpacity: .5, shadowRadius: 3 },
          ]}>
            <View style={{ height: 116, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              {
                (carArgs.length === 0) ? (
                  <View style={Platform.select({
                    android: { position: 'absolute', height: 116, top: 0, bottom: 0, left: (Screen.window.width - 30 - 66) / 2, alignItems: 'center', justifyContent: 'center' },
                    ios: { position: 'absolute', height: 96, top: 0, bottom: 0, left: (Screen.window.width - 30 - 66) / 2, alignItems: 'center', justifyContent: 'center' }
                  })}>
                    <Lottie progress={this.indicator} style={{ width: 66, height: 66 }} source={Resources.animation.simpleLoader} />
                  </View>
                ) : (
                  <ScrollView
                    pagingEnabled={type !== 'circle'}
                    horizontal={true} 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ 
                      height: 116, 
                      justifyContent: 'center', 
                      alignItems: 'center' 
                    }}
                    style={{ width: width - 30 }}
                  >
                    { (type === 'circle') ? 
                      carArgs.map((pipe, index) => (
                        <SelectButton key={index} data={pipe} />
                      )) : 
                      carArgs.map((pipe, index) => (
                        <View key={index} style={{ width: width - 30 }}>
                          <SelectButton key={index} data={pipe} />
                        </View>
                      ))
                    }
                  </ScrollView>
                )
              }
            </View>
          </View>
          <SelectBookingOption
            onPressSubscribe={() => this.setState({ selectTimeShow: true })}
            onPressSelectPay={() => {
              Picker.init({
                pickerData: ['支付宝', '微信支付', '现金支付', '信用卡'],
                selectedValue: [payment],
                pickerFontSize: 18,
                pickerFontColor: [51, 51, 51, 1], // #333
                pickerRowHeight: 34,
                pickerBg: [255, 255, 255, 1],
                pickerToolBarBg: [255, 255, 255, 1],
                pickerConfirmBtnText: '确定',
                pickerConfirmBtnColor: [51, 51, 51, 1],
                pickerCancelBtnText: '取消',
                pickerCancelBtnColor: [51, 51, 51, 1],
                pickerTitleText: ' ',
                onPickerConfirm: data => {
                  this.props.dispatch(booking.journeyUpdateData({ payment: data[0] }))
                }
              })
              Picker.show()
            }}
            style={[
              { shadowOffset: { width: 0, height: 2 }, shadowColor: '#999', shadowOpacity: .5, shadowRadius: 3 },
              { borderColor: '#ccc', borderWidth: .8 },
              { backgroundColor: 'white' }
            ]}
            reachTime={reachTime}
            onPressBooking={() => {
              this.map.animateTo({ zoomLevel: 14, coordinate: { latitude: 31.04510555, longitude: 121.16909333 } }, 500)
              // this.props.dispatch(booking.journeyUserStart())
            }}
            data={this.props.data}
          />
        </View>

        <Modal onRequestClose={() => this.setState({ selectTimeShow: false })} animationType={'slide'} transparent={true} visible={this.state.selectPayTypeShow}>
          {
            Platform.select({
              ios: (
                <TouchableOpacity activeOpacity={1} onPress={() => this.setState({ selectTimeShow: false })} style={[
                  { flex: 1 },
                  { shadowOffset: { width: 0, height: 0 }, shadowColor: '#999', shadowOpacity: .5, shadowRadius: 3 },
                ]}>
                  <View style={{ flex: 1 }} />
                  <View style={{ backgroundColor: '#fff' }}>
                    <View style={{ height: 44, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 0.8, borderColor: '#f2f2f2' }}>
                      <TouchableOpacity 
                        activeOpacity={.7} 
                        onPress={() => {
                          this.setState({ selectTimeShow: false })
                          this.props.dispatch(booking.journeyUpdateData({ time: 'now' }))
                        }} 
                        style={{ }}
                      >
                        <Text style={{ fontSize: 16, color: '#333', fontWeight: '400' }}>取消</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        activeOpacity={.7} 
                        onPress={() => {
                          this.setState({ selectTimeShow: false })
                          this.props.dispatch(booking.journeyUpdateData({ time: this.state.selectTime }))
                        }} 
                        style={{ }}
                      >
                        <Text style={{ fontSize: 16, color: '#333', fontWeight: '400' }}>确定</Text>
                      </TouchableOpacity>
                    </View>
                    <DatePickerIOS
                      date={this.state.selectTime}
                      mode={'datetime'}
                      minuteInterval={15}
                      onDateChange={(selectTime) => this.setState({ selectTime })}
                      minimumDate={new Date()}
                      maximumDate={moment(new Date()).add(7, 'days').toDate()}
                    />
                  </View>
                </TouchableOpacity>
              ),
              android: (
                <DatePicker
                  style={{width: 200}}
                  date={'2016-05-15'}
                  mode="date"
                  placeholder="select date"
                  format="YYYY-MM-DD"
                  minDate="2016-05-01"
                  maxDate="2016-06-01"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateIcon: {
                      position: 'absolute',
                      left: 0,
                      top: 4,
                      marginLeft: 0
                    },
                    dateInput: {
                      marginLeft: 36
                    }
                  }}
                  onDateChange={(date) => {this.setState({date: date})}}
                />     
              )
            })
          }
        </Modal>
        <Modal onRequestClose={() => this.setState({ selectTimeShow: false })} animationType={'slide'} transparent={true} visible={this.state.selectTimeShow}>
          {
            Platform.select({
              ios: (
                <TouchableOpacity activeOpacity={1} onPress={() => this.setState({ selectTimeShow: false })} style={[
                  { flex: 1 },
                  { shadowOffset: { width: 0, height: 0 }, shadowColor: '#999', shadowOpacity: .5, shadowRadius: 3 },
                ]}>
                  <View style={{ flex: 1 }} />
                  <View style={{ backgroundColor: '#fff' }}>
                    <View style={{ height: 44, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 0.8, borderColor: '#f2f2f2' }}>
                      <TouchableOpacity 
                        activeOpacity={.7} 
                        onPress={() => {
                          this.setState({ selectTimeShow: false })
                          this.props.dispatch(booking.journeyUpdateData({ time: 'now' }))
                        }} 
                        style={{ }}
                      >
                        <Text style={{ fontSize: 16, color: '#333', fontWeight: '400' }}>取消</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        activeOpacity={.7} 
                        onPress={() => {
                          this.setState({ selectTimeShow: false })
                          this.props.dispatch(booking.journeyUpdateData({ time: this.state.selectTime }))
                        }} 
                        style={{ }}
                      >
                        <Text style={{ fontSize: 16, color: '#333', fontWeight: '400' }}>确定</Text>
                      </TouchableOpacity>
                    </View>
                    <DatePickerIOS
                      date={this.state.selectTime}
                      mode={'datetime'}
                      minuteInterval={15}
                      onDateChange={(selectTime) => this.setState({ selectTime })}
                      minimumDate={new Date()}
                      maximumDate={moment(new Date()).add(7, 'days').toDate()}
                    />
                  </View>
                </TouchableOpacity>
              ),
              android: (
                <DatePicker
                  style={{width: 200}}
                  date={'2016-05-15'}
                  mode="date"
                  placeholder="select date"
                  format="YYYY-MM-DD"
                  minDate="2016-05-01"
                  maxDate="2016-06-01"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateIcon: {
                      position: 'absolute',
                      left: 0,
                      top: 4,
                      marginLeft: 0
                    },
                    dateInput: {
                      marginLeft: 36
                    }
                    // ... You can check the source to find the other keys.
                  }}
                  onDateChange={(date) => {this.setState({date: date})}}
                />     
              )
            })
          }
        </Modal>
        <ModalDriverRespond visible={schedule === 2} />
      </View>
    )
  }
})

class SelectButton extends Component {
  constructor(props) {
    super(props) 
  }

  render() {
    const { data = {} } = this.props
    const { image, title, price, circle, label, key, icon, onPress = () => {} } = data
    return !circle ? (
      <Button onPress={() => {}} key={key} style={{ alignItems: 'center', justifyContent: 'center', marginHorizontal: 15, top: 3 }}>
        <Text style={{ color: '#333', fontSize: 14, fontWeight: '400', marginBottom: 4 }}>{ title }</Text>
        <Animated.Image 
          style={{ opacity: 0.7, width: 125, height: 45, resizeMode: 'cover' }} 
          source={image}
        />
        {
          label ? (
            <View style={{ marginTop: 8, flexDirection: 'row' }}>
              <Text style={{ color: '#333', fontSize: 13, fontWeight: '400' }}>{ label }</Text>
            </View>
          ) : (
            <View style={{ marginTop: 8, flexDirection: 'row' }}>
              { price && <Text style={{ color: '#333', fontSize: 13, fontWeight: '400' }}>约 </Text> }
              { price && <Text style={{ color: '#333', fontSize: 18, fontWeight: '600', top: -4 }}>{ price }</Text> }
              { price && <Text style={{ color: '#333', fontSize: 13, fontWeight: '400' }}> 元</Text> }
            </View>
          )
        }
      </Button>
    ) : (
      <Button onPress={onPress} key={key} style={{ alignItems: 'center', justifyContent: 'center', marginHorizontal: 12, top: 3 }}>
        <Animated.View style={[
          { width: 68, height: 68, borderRadius: 33, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#fff' }
        ]}>
          {
            icon ? (
              <View style={{ backgroundColor: '#f2f2f2', width: 66, height: 66, borderRadius: 33, justifyContent: 'center', alignItems: 'center' }}>
                { icon }
              </View>
            ) : (
              <Animated.Image 
                style={{ opacity: 0.7, width: 66, height: 66, borderRadius: 33, borderWidth: 1.5, borderColor: 'white', resizeMode: 'cover' }} 
                source={image}
              />
            )
          }
        </Animated.View>
        <Text style={{ color: '#666', fontSize: 14, fontWeight: '400', marginTop: 4 }}>{ title }</Text>
      </Button>
    )
  }
}

class MapPinTip extends Component {
  render() {
    const { timing } = this.props
    return (
      <Animated.View style={[
        { position: 'absolute', backgroundColor: 'transparent', top: PIN_HEIGHT - 94, left: (Screen.window.width - 140) / 2 },
        { justifyContent: 'center', alignItems: 'center', paddingVertical: 6, width: 140 },
        { shadowOffset: { width: 0, height: 2 }, shadowColor: '#666', shadowOpacity: .3, shadowRadius: 3 },
        { opacity: timing.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }
      ]}>
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'white', flex: 1, borderRadius: 20 }} />
        <View style={{ position: 'absolute', bottom: -10 }}>
          {Icons.Generator.Material('network-wifi', 20, 'white')}
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ fontSize: 13, color: '#666', fontWeight: '600' }}>Board after </Text>
          <Text style={{ fontSize: 13, color: '#ffa81d', fontWeight: '600' }}>1 min(s)</Text>
        </View>
      </Animated.View>
    )
  }
}

class MapPin extends Component {
  render() {
    const { timing } = this.props
    return (
      <View style={{ position: 'absolute', left: (Screen.window.width - 18) / 2 }}>
        <Animated.Image style={[
          { width: 18, height: 28 },
          { top: PIN_HEIGHT - 48 }
        ]} source={Resources.image.pin} />
      </View>
    )
  }
}

class SelectBookingOption extends Component {
  render() {
    const { reachTime, onPressBooking, onPressSubscribe, onPressSelectPay, data } = this.props
    const { time, payment } = data
    return (
      <Animated.View style={this.props.style}>
        <View style={{ flex: 1 }}>
          {/* Payment */}
          <Animated.View style={[
            { flexDirection: 'row', backgroundColor: 'transparent' },
            { left: 0 }, { opacity: 1 }
          ]}>
            <Button onPress={onPressSelectPay} underlayColor={'#f2f2f299'} style={{ backgroundColor: 'transparent', height: 44, flex: 1 }}>
              <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {Icons.Generator.Material('attach-money', 18, '#666', { style: { marginRight: 6, top: .5 } })}
                <Text style={{ fontSize: 14, color: '#444', fontWeight: '600' }}>{ payment }</Text>
              </View>
            </Button>
            <View style={{ backgroundColor: '#ccc', marginVertical: 8, width: .5 }} />
            <Button onPress={onPressSubscribe} underlayColor={'#f2f2f299'} style={{ backgroundColor: 'transparent', height: 44, flex: 1 }}>
              <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {Icons.Generator.Material('query-builder', 18, '#666', { style: { marginRight: 6, top: .5 } })}
                <Text style={{ fontSize: 14, color: '#444', fontWeight: '600' }}>{ time === 'now' ? '现在' : moment(time).format('MM/DD HH:mm') }</Text>
              </View>
            </Button>
          </Animated.View>
        </View>
        {/* Button Groups */}
        <View style={{ overflow: 'hidden', flex: 1 }}>
          <View style={[
            { height: 44, width: (width - 30), flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
            { left: 0 }
          ]}>
            <Button onPress={onPressBooking} style={{ flex: 1, left: 0, height: 44, backgroundColor: '#FEA81C' }}>
              <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>开始 - 预计到达{reachTime}</Text>
            </Button>
          </View>
        </View>
      </Animated.View>
    )
  }
}

class BookingInfo extends Component {
  render() {
    const { timing } = this.props
    return (
      <Animated.View style={[
        { position: 'absolute', left: 0, right: 0 },
        { shadowOffset: { width: 0, height: 2 }, shadowColor: '#999', shadowOpacity: .5, shadowRadius: 3 },
        { top: -100 },
        { opacity: 1 }
      ]}>
        <View style={{ height: 88, backgroundColor: 'white', flexDirection: 'row', paddingHorizontal: 14, alignItems: 'center' }}>
          <View style={{ justifyContent: 'center', marginRight: 10 }}>
            <Image style={{ width: 54, height: 54, borderRadius: 27 }} source={require('../../resources/images/test.jpg')} />
          </View>
          <View style={{ justifyContent: 'space-between', height: 54, top: 2, flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#333' }}>陈师傅</Text>
            <Text style={{ fontSize: 12, fontWeight: '400', color: '#666' }}>沪A23N78</Text>
            <View style={{ flexDirection: 'row' }}>
              {Icons.Generator.Material('star', 13, '#FEA81C')}
              {Icons.Generator.Material('star', 13, '#FEA81C')}
              {Icons.Generator.Material('star', 13, '#FEA81C')}
              {Icons.Generator.Material('star', 13, '#FEA81C')}
              {Icons.Generator.Material('star-half', 13, '#FEA81C')}
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: 120, paddingHorizontal: 10 }}>
            <Button underlayColor={'#ddd'} style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#FEA81C' }}>
              {Icons.Generator.Material('mail-outline', 24, 'white')}
            </Button>
            <Button underlayColor={'#ddd'} style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#FEA81C' }}>
              {Icons.Generator.Material('phone', 24, 'white')}
            </Button>
          </View>
        </View>
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  SelectBookingWrap: Platform.select({
    ios: { position: 'absolute', bottom: Define.system.ios.x ? 40 : 30, left: 15, right: 15, borderRadius: 3 },
    android: { position: 'absolute', bottom: 15, left: 15, right: 15, borderRadius: 3 }
  }),
  PickAddressWrap: Platform.select({
    ios: { position: 'absolute', bottom: 30, left: 15, right: 15, height: 89, backgroundColor: 'white', borderRadius: 3 },
    android: { position: 'absolute', bottom: 30, left: 15, right: 15, height: 89, backgroundColor: 'white', borderRadius: 3, borderColor: '#ccc', borderWidth: .6 }
  })
})