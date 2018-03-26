import React, { Component, PureComponent } from 'react'
import { Text, View, Animated, TouchableOpacity, Modal } from 'react-native'
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter'
import InteractionManager from 'InteractionManager'
import { NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'
import Lottie from 'lottie-react-native'

import Resources from '../../../resources'
import ModalDriverRespond from './passenger.modal.wait.driver'

import HeaderSection from '../components/navigator.header.selector'
import CircleBar from '../components/circle.bar'

import { MapView as AMapView, Search, Marker, Utils } from '../../../native/AMap'
// import GoogleMap from 'react-native-maps'
import { Screen, Icons, Define, Session } from '../../../utils'
import { booking } from '../../../redux/actions'
import { BOOKING_STATUS } from '..'
import Wheel from '../../../components/Wheel'
import _ from 'lodash'
const { height, width } = Screen.window

const MAP_DEFINE = {
  showsCompass: false,
  showsScale: false,
  tiltEnabled: false,
  rotateEnabled: false,
  showsTraffic: false,
  showsZoomControls: false, /* android fix */
}

const PIN_HEIGHT = ((height - 22) / 2)

export default connect(state => ({ ...state.booking }))(class PassengerComponent extends Component {

  constructor(props) {
    super(props)
    this.state = {
      drag: false,
      routeBounds: {}, routeCenterPoint: {}, routeLength: 0, routeNaviPoint: [], routeTime: 0, routeTollCost: 0
    }
    this.currentLoc = {}
    this.timer = null
    this.pin = new Animated.Value(0)
    this.board = new Animated.Value(0)
    this.ui = new Animated.Value(0)
    this.form = new Animated.Value(0)

    this.count = 0

    this.ready = false
  }

  async componentWillReceiveProps(props) {
    if (this.props.status !== props.status && props.status === BOOKING_STATUS.PASSGENER_BOOKING_INIT) {
      this.map.animateTo({ zoomLevel: 16, coordinate: this.state.current }, 500)
      this.setState({ ready: true })
    }

    if (this.props.status !== props.status && props.status === BOOKING_STATUS.PASSGENER_BOOKING_PICKED_ADDRESS) {
      const { destination, from } = props
      this.map.calculateDriveRouteWithStartPoints(
        { latitude: from.location.lat, longitude: from.location.lng },
        { latitude: destination.location.lat, longitude: destination.location.lng }
      )

      const { fare } = await Session.Booking.Get(`v1/fares?from_lat=${from.location.lat}&from_lng=${from.location.lng}&destination_lat=${destination.location.lat}&destination_lng=${destination.location.lng}`)
      this.props.dispatch(booking.passengerSetValue({ fare: fare.Circle }))
    }
  }

  async componentDidMount() {
    await InteractionManager.runAfterInteractions()
    this.eventListener = RCTDeviceEventEmitter.addListener('EVENT_AMAP_VIEW_ROUTE_SUCCESS', (args) => this.aMapMathRouteSuccess(args))
    this.props.dispatch(booking.passengerSetStatus(BOOKING_STATUS.PASSGENER_BOOKING_INIT))
  }

  componentWillUnmount() {
    this.eventListener && this.eventListener.remove()
  }

  async aMapMathRouteSuccess(args) {
    const route = Array.isArray(args) ? args[0] : args
    const { routeCenterPoint } = route
    let zoom = 15

    if (this.props.status === BOOKING_STATUS.PASSGENER_BOOKING_PICKED_ADDRESS) {
      const { destination, from } = this.props
      const distance = await Utils.distance(
        from.location.lat, from.location.lng,
        destination.location.lat, destination.location.lng
      )
      zoom = this.mathDistanceZoom(distance)
      this.setState({ ...route })
    }
    this.map.animateTo({ zoomLevel: zoom, coordinate: { latitude: routeCenterPoint.latitude, longitude: routeCenterPoint.longitude } }, 500)
  }

  mathDistanceZoom(distance) {
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
    return zoom
  }

  async onLocationListener({ nativeEvent }) {
    const { latitude, longitude } = nativeEvent

    if (latitude === 0 || longitude === 0) return
    if (!this.ready) {
      await InteractionManager.runAfterInteractions()
      this.map.animateTo({ zoomLevel: 16, coordinate: { latitude, longitude } }, 500)
      this.ready = true
    }
    this.setState({ current: { latitude, longitude } })
    // try {
    //   await Session.Location.Put('v1', { latitude, longitude })
    // } catch (e) { /**/ }
  }

  onStatusChangeListener({ nativeEvent }) {
    const { longitude, latitude, rotation, zoomLevel, tilt } = nativeEvent
    if (!this.state.drag) {
      this.setState({ drag: true })
      this.props.dispatch(booking.passengerSetValue({ from: {} }))
      Animated.spring(this.pin, { toValue: 1, friction: 1.5 }).start()
      Animated.timing(this.board, { toValue: 1, duration: 100 }).start()
    }
    this.timer && clearTimeout(this.timer)
    this.timer = setTimeout(this.onLocationSearch.bind(this, longitude, latitude), 1500)
  }

  async onLocationSearch(longitude, latitude) {
    try {
      Animated.timing(this.pin, { toValue: 0, duration: 200 }).start()
      Animated.timing(this.board, { toValue: 0, duration: 200 }).start()
      const { pois } = await Search.searchLocation(longitude, latitude)

      if (!this.state.city) {
        let city = pois[0].city
        city = city.length > 2 ? city.substr(0, 2) : city
        this.setState({ city })
      }

      const address = pois.find(pipe => {
        if (pipe.address.endsWith('米')) return pipe
        if (pipe.address.endsWith('站')) return pipe
        if (pipe.address.endsWith('号')) return pipe
        if (pipe.address.endsWith('弄')) return pipe
        return false
      })
      this.props.dispatch(booking.passengerSetValue({ from: address || {} }))
      this.setState({ drag: false })
    } catch (e) {
      return
    }
  }

  render() {
    const { drag } = this.state
    const { status, from, destination } = this.props

    const MAP_SETTER = {
      style: { flex: 1 },
      locationEnabled: true,
      mapType: 'standard',
      locationInterval: 1000,
      onLocation: this.onLocationListener.bind(this),
      ref: (e) => this.map = e
    }

    const GOOGLE_MAP_SETTER = {
      followsUserLocation: true,

    }

    if (status === BOOKING_STATUS.PASSGENER_BOOKING_INIT) {
      MAP_SETTER.onStatusChange = this.onStatusChangeListener.bind(this)
    }

    /** FIX ANDROID LOCATION SERVICE CRASH */
    let { from_loc, destination_loc } = { from_loc: { lat: 0, lng: 0 }, destination_loc: { lat: 0, lng: 0 } }
    if (from.location && destination.location) {
      from_loc = from.location
      destination_loc = destination.location
    }
    from_loc = { latitude: from_loc.lat, longitude: from_loc.lng }
    destination_loc = { latitude: destination_loc.lat, longitude: destination_loc.lng }
    /** FIX ANDROID LOCATION SERVICE CRASH */

    return (
      <View style={{ flex: 1, width }}>
        <AMapView {...MAP_DEFINE} {...MAP_SETTER}>
          <Marker image={'rn_amap_startpoint'} coordinate={from_loc} />
          <Marker image={'rn_amap_endpoint'} coordinate={destination_loc} />
        </AMapView>
        {/* <GoogleMap style={{ flex: 1 }}>

        </GoogleMap> */}

        {status === BOOKING_STATUS.PASSGENER_BOOKING_INIT && (<HeaderSection />)}

        {status === BOOKING_STATUS.PASSGENER_BOOKING_INIT && (<MapPin timing={this.pin} />)}
        {status === BOOKING_STATUS.PASSGENER_BOOKING_INIT && (<MapPinTip timing={this.board} />)}

        {
          (
            status === BOOKING_STATUS.PASSGENER_BOOKING_INIT ||
            status === BOOKING_STATUS.PASSGENER_BOOKING_PICKED_ADDRESS
          ) && (<CircleBar init={true} />)
        }

        {status === BOOKING_STATUS.PASSGENER_BOOKING_INIT && (<PickerAddress timing={this.ui} drag={drag} />)}
        {status === BOOKING_STATUS.PASSGENER_BOOKING_PICKED_ADDRESS && (<PickerOptions />)}

        <ModalDriverRespond />
      </View>
    )
  }
})

const PickerOptions = connect(state => ({ status: state.booking.status, fare: state.booking.fare }))(class PickerOptions extends PureComponent {
 
  render() {
    return (
      <Animated.View style={[
        { position: 'absolute', left: 0, right: 0, bottom: 0, height: Define.system.ios.x ? 160 + 22 : 160, justifyContent: 'center' },
        { shadowOffset: { width: 0, height: 2 }, shadowColor: '#999', shadowOpacity: .5 },
        { backgroundColor: 'white', paddingHorizontal: 23 },
        { borderTopLeftRadius: 28, borderTopRightRadius: 28 }
      ]}>
        <View style={{ alignItems: 'center' }}>
          <View style={{ width: 276, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <TouchableOpacity activeOpacity={.7} style={{ width: 128, height: 56, borderRadius: 8, backgroundColor: '#1ab2fd', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>现金</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setState({showTP:true})}
              activeOpacity={.7} style={{ width: 128, height: 56, borderRadius: 8, backgroundColor: '#1ab2fd', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>现在</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => {
            this.props.dispatch(booking.passengerSetStatus(BOOKING_STATUS.PASSGENER_BOOKING_WAIT_SERVER_RESPONSE))
          }} activeOpacity={.7} style={{ width: 276, height: 56, borderRadius: 28, backgroundColor: '#ffb639', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>{(this.props.fare === 0) ? '开始' : `开始 - 行程费用 ￥${parseInt(this.props.fare).toFixed(2)}`}</Text>
          </TouchableOpacity>
        </View>
       
      </Animated.View>
    )
  }
})

const PickerAddress = connect(state => ({ ...state.booking }))(class PickerAddress extends PureComponent {
  constructor(props) {
    super(props)
    this.animated = new Animated.Value(0)
    this.dates=[this.getDateStr(0),this.getDateStr(1),this.getDateStr(2)]
    // this.hours = ['0点', '1点', '2点', '3点','4点', '5点', '6点', '7点', '8点', '9点', '10点', '11点', '12点','13点','14点','15点','16点','17点','18点','19点','20点','21点','22点','23点'];
    // this.minutes = ['0分','10分','20分','30分','40分','50分'];
    this.hours = [0, 1, 2, 3,4, 5, 6, 7, 8, 9, 10, 11, 12,13,14,15,16,17,18,19,20,21,22,23];
    this.minutes = [0,10,20,30,40,50];
    this.date=this.getDateStr(0);
    this.hour=this.getDateStr()[0];
    this.minute=this.getDafultMinutes()[0];
    this.state = {
      showTP:false,
      hours:this.getDafultHours(),
      minutes:this.getDafultMinutes(),
      date:"",
    }
  }
  //获取今天前后n天的日期
   getDateStr(n) {     
    let date = new Date();    
    date.setDate(date.getDate()+n);//获取n天后的日期   
    let w='';
    let day=date.getDay();
    // let y = date.getFullYear();                  
    let m = (date.getMonth()+1)<10?"0"+(date.getMonth()+1):(date.getMonth()+1);//获取当前月份的日期，不足10补0    
    let d = date.getDate()<10?"0"+date.getDate():date.getDate();//获取当前几号，不足10补0   
    switch (day) {
      case 0:
        w = '星期日';
        break;
      case 1:
        w = '星期一';
        break;
      case 2:
        w = '星期二';
        break;
      case 3:
        w = '星期三';
        break;
      case 4:
        w = '星期四';
        break;
      case 5:
        w = '星期五';
        break;
        break;
      case 6:
        w = '星期六';
        break;
    } 
    return m+'月'+d+'日 '+w;     
  }  
  getDafultHours(){
    let HM=this.getNowHM();
    let nowHour=HM.hour;
    let nowMinute=HM.minute;
    let index = _.findIndex(this.hours, function (chr) {
      return chr == nowHour;
    });
    return _.drop(this.hours,index)
  }
  getDafultMinutes(){
    let HM=this.getNowHM();
    let nowHour=HM.hour;
    let nowMinute=HM.minute;
    let index = _.findIndex(this.minutes, function (chr) {
        return chr == nowMinute;
      });
      return _.drop(this.minutes,index)
  }
  getNowHM(key){
    let json={};
    let timestamp  = new Date().valueOf();  
    let date=new Date(timestamp+30*60*1000);
    let h=date.getHours();
    let m=date.getMinutes();
    
    if(m%10>0){
      m=(parseInt(m/10)+1)*10;
      if(m==60){
        h+=1;m=0
      }
    }else{ m=parseInt(m/10)*10}
    json.hour=h;
    json.minute=m;
    return json
  }
  onDateChange(index) {
    let date=this.dates[index];
    let HM=this.getNowHM();
    let nowHour=HM.hour;
    let nowMinute=HM.minute;
    if(date==this.dates[0]){
      let index = _.findIndex(this.hours, function (chr) {
        return chr == nowHour;
      });
      this.setState({hours:_.drop(this.hours,index)})
      if(this.hour==nowHour){
        let index = _.findIndex(this.minutes, function (chr) {
          return chr == nowMinute;
        });
        this.setState({minutes:_.drop(this.minutes,index)})
      }
    }
    if(this.date==this.dates[0]){
      this.setState({hours:this.hours})
    }
    this.date=date;
  }
  onHourChange(index){
    
    let hour=this.state.hours[index];
    let HM=this.getNowHM();
    let nowHour=HM.hour;
    let nowMinute=HM.minute;
    if(this.date==this.dates[0]&& hour==nowHour){
      let index = _.findIndex(this.minutes, function (chr) {
        return chr == nowMinute;
      });
      this.setState({minutes:_.drop(this.minutes,index)})
    }
    if(this.date==this.dates[0]&& this.hour==nowHour){
      this.setState({minutes:this.minutes})
    }
    this.hour=hour
  }
  onMinuteChange(index){
    this.hour=this.state.minutes[index];

  }
  componentWillReceiveProps(props) {
    if (props.drag) { Animated.loop(Animated.timing(this.animated, { toValue: 1, duration: 800, useNativeDriver: true })).start() }
    if (props.from.name) { this.animated.stopAnimation() }
  }

  render() {
    const { drag, from, destination } = this.props

    return (
      <Animated.View style={[
        { position: 'absolute', left: 0, right: 0, bottom: 0, height: Define.system.ios.x ? 142 : 120, justifyContent: 'center' },
        { shadowOffset: { width: 0, height: 2 }, shadowColor: '#999', shadowOpacity: .5 },
        { backgroundColor: 'white', paddingBottom: Define.system.ios.x ? 22 : 0, paddingHorizontal: 23 },
        { borderTopLeftRadius: 28, borderTopRightRadius: 28 }
      ]}>
        <View style={{ height: 79 }}>
          {/* From */}
          <TouchableOpacity onPress={() => {
            !drag && this.props.dispatch(NavigationActions.navigate({ routeName: 'PickerAddressModal', params: { type: 'from' } }))
          }} activeOpacity={0.7} style={{ flex: 1, height: 44, justifyContent: 'center' }}>
            <View style={{ backgroundColor: '#FEA81C', height: 10, width: 10, borderRadius: 5, position: 'absolute', left: 20 }} />
            <Text numberOfLines={1} style={{ marginHorizontal: 48, textAlign: 'center', color: '#333', fontSize: 14, fontWeight: '600' }}>{from.name}</Text>
            <View style={{ position: 'absolute', top: 0, bottom: 0, left: (Screen.window.width - 46 - 44) / 2, alignItems: 'center', justifyContent: 'center' }}>
              {
                (!from.name || drag) && (<Lottie progress={this.animated} style={{ width: 44, height: 44 }} source={Resources.animation.simpleLoader} />)
              }
            </View>
          </TouchableOpacity>
          <View style={{ backgroundColor: '#e8e8e8', height: .5, marginHorizontal: 18 }} />
          {/* To */}
          <TouchableOpacity onPress={() => {this.setState({showTP:true})
            //this.props.dispatch(NavigationActions.navigate({ routeName: 'PickerAddressModal', params: { type: 'destination' } }))
          }} activeOpacity={0.7} style={{ flex: 1, height: 44, justifyContent: 'center' }}>
            <View style={{ backgroundColor: '#7ED321', height: 10, width: 10, borderRadius: 5, position: 'absolute', left: 20 }} />
            <Text numberOfLines={1} style={{ marginHorizontal: 48, textAlign: 'center', color: destination.name ? '#333' : '#a2a2a2', fontSize: 14, fontWeight: '600', /* PositionFix */ top: -1 }}>{destination.name || '请输入目的地'}</Text>
          </TouchableOpacity>
        </View>
        <Modal
          animationType='fade'           //渐变
          transparent={true}             // 不透明
          visible={this.state.showTP}    // 根据isModal决定是否显示
          onRequestClose={() => this.setState({showTP:false})}  // android必须实现 安卓返回键调用
        >
          <View style={{ width: width, height: height, backgroundColor: 'rgba(57, 56, 67, 0.2)' }}>
            <TouchableOpacity style={{ width: width, height: height/2 }} onPress={() =>this.setState({showTP:false})} ></TouchableOpacity>
            <View style={{ height:height/2, backgroundColor: '#fff', paddingBottom: 10 }}>
              <View style={{flexDirection:'row',justifyContent:'space-around',alignItems:'center',width:width,height:50}}>
                <TouchableOpacity style={{ height: 50,paddingHorizontal:5 }} onPress={() =>this.setState({showTP:false})} >
                  <Text style={{color: '#1ab2fd' }}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ height: 50,paddingHorizontal:5 }} onPress={() =>this.setState({showTP:false})} >
                  <Text style={{color: '#1ab2fd' }}>确定</Text>
                </TouchableOpacity>
              </View>
              <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',width:width,}}>
                <Wheel
                  style={{height: (height/2)-80, width: width/2}}
                  itemStyle={{textAlign: 'center'}}
                  items={this.dates}
                  onChange={index => this.onDateChange(index)}
                  />
                <Wheel
                  style={{height: (height/2)-80, width: width/4}}
                  itemStyle={{textAlign: 'center'}}
                  type={'h'}
                  items={this.state.hours}
                  onChange={index => this.onHourChange(index)}
                  />
                <Wheel
                  style={{height: (height/2)-80, width: width/4}}
                  itemStyle={{textAlign: 'center'}}
                  type={'m'}
                  items={this.state.minutes}
                  onChange={index => this.onMinuteChange(index)}
                  />
              </View>
            </View>
          </View>
        </Modal>
      </Animated.View>
    )
  }
})

class MapPinTip extends PureComponent {
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

class MapPin extends PureComponent {
  render() {
    const { timing } = this.props
    return (
      <View style={{ position: 'absolute', left: (Screen.window.width - 18) / 2 }}>
        <Animated.Image style={[
          { width: 18, height: 28 },
          { top: timing.interpolate({ inputRange: [0, 1], outputRange: [PIN_HEIGHT - 56, PIN_HEIGHT - 60] }) }
        ]} source={Resources.image.pin} />
      </View>
    )
  }
}