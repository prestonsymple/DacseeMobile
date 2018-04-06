import React, { Component } from 'react'
import {
  Text, View, Image, TouchableOpacity, ListView, Animated, PanResponder, StyleSheet
} from 'react-native'
import moment from 'moment'
import { Screen, Icons, Session, TextFont } from '../../../utils'
import OrderSlider from './order.slider'
const { height, width } = Screen.window

export default class OfflineListItem extends Component {
  constructor(props) {
    super(props)
    this.sliderWidth = 0
    this.currentPosition=new Animated.Value(0)
    this.createPanResponder()
    this.minX=0
    this.maxX=0
  }
  componentWillMount() {
    if (!this.positionListenerId) {
      this.positionListenerId = this.currentPosition.addListener(e => this.handlePositionChange(e.value))
    }
  }

  componentWillUnmount() {
    if (this.positionListenerId) {
      this.currentPosition.removeListener(this.positionListenerId)
      this.positionListenerId = null
    }
  }
  onLayout(e) {
    this.sliderWidth = e.nativeEvent.layout.width
    this.minX=width / 2-this.sliderWidth / 2+25
    this.maxX=width / 2+this.sliderWidth / 2-25
  }
  createPanResponder() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gestureState) => true,
      onStartShouldSetPanResponderCapture: (e, gestureState) => false,
      onMoveShouldSetPanResponder: (e, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (e, gestureState) => false,
      onPanResponderGrant: (e, gestureState) => this.onPanResponderGrant(e, gestureState),
      onPanResponderMove: (e, gestureState) => this.onPanResponderMove(e, gestureState),
      onPanResponderTerminationRequest: (e, gestureState) => true,
      onPanResponderRelease: (e, gestureState) => this.onPanResponderRelease(e, gestureState),
      onPanResponderTerminate: (e, gestureState) => null,
      onShouldBlockNativeResponder: (e, gestureState) => true,
    })
  }
  onPanResponderGrant(e, gestureState) {
    this.currentPosition.stopAnimation()
    this.prevTouches = e.nativeEvent.touches
    this.firstTouche = e.nativeEvent.touches
  }
  getIsOut(x){
    let minX=this.minX
    let maxX=this.maxX
    let type=x<=minX?minX:x>=maxX?maxX:0
    return type
  }
  getIsMid(x){
    let minX=width / 2-this.sliderWidth / 4
    let maxX=width / 2+this.sliderWidth  /  4
    return minX<=x&&x<=maxX
  }
  onPanResponderMove(e, gestureState) {
    let { touches } = e.nativeEvent
    let prevTouches = this.prevTouches
    this.prevTouches = touches
    if (touches.length != 1 || touches[0].identifier != prevTouches[0].identifier) {
      return
    }
    if(this.getIsOut(touches[0].pageX)!==0&&this.getIsOut(prevTouches[0].pageX)===0){
      let scaleX=this.currentPosition._value<0?-130:130
      this.currentPosition.setValue(scaleX)
      this.prevTouches[0].pageX=this.getIsOut(touches[0].pageX)
      return
    }else if(this.getIsOut(touches[0].pageX)!==0&&this.getIsOut(prevTouches[0].pageX!==0)){
      return
    }
    let dy = touches[0].pageX - prevTouches[0].pageX
    let pos = this.currentPosition._value + dy
    this.currentPosition.setValue(pos)
  }
  onPanResponderRelease(e, gestureState) {
    let minX =this.minX
    let maxX =this.maxX
    let status= this.prevTouches[0].pageX <= minX ? -1 : this.prevTouches[0].pageX >= maxX ? 1 : 0;
    if (status != 0) {

      this.props.sliderChange(status)
    }
    if(this.getIsMid(this.prevTouches[0].pageX)){
      this.currentPosition.setValue(0)
    }
  }
  handlePositionChange(value){
  }
  _statusInChinese(str) {
    switch (str) {
    case 'Pending_Acceptance':
      return '等待接单'
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
  render() {
    const { itemData, itemDay, onPress = () => { } } = this.props
    const { from, destination, booking_at, payment_method, fare, status } = itemData

    return (
      <View style={styles.container}>
        <View style={[styles.text_cell, { justifyContent: 'space-between' }]}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.orderDate}>{moment(booking_at).format('MM-DD HH:mm')}</Text>
            <Text style={styles.order_status}>{'~ 15km'}</Text>
          </View>
          <Text style={styles.fare}>{fare}</Text>
        </View>
        <View style={styles.text_cell}>
          <View style={[styles.dot, { backgroundColor: '#FEA81C' }]} />
          <Text style={styles.adress}>{from.name}</Text>
        </View>
        <View style={styles.text_cell}>
          <View style={[styles.dot, { backgroundColor: '#7ED321' }]} />
          <Text style={styles.adress}>{destination.name}</Text>
        </View>
        {
          status === 'Pending_Acceptance' ?
            <View onLayout={e => this.onLayout(e)} {...this.panResponder.panHandlers}>
              <OrderSlider currentPosition={this.currentPosition} sliderChange={this.props.sliderChange} />
            </View> : null
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: width - 20, marginLeft: 10, marginBottom: 15, backgroundColor: '#fff', flex: 1, paddingTop: 15, paddingHorizontal: 15
  },
  info_cell: {
    flexDirection: 'row', justifyContent: 'space-between', flex: 1
  },
  text_cell: {
    flexDirection: 'row', flex: 1, alignItems: 'center', paddingBottom: 15
  },
  orderDate: {
    fontSize: TextFont.TextSize(14), fontWeight: 'bold', color: '#aaaaaa'
  },
  order_status: {
    fontSize: TextFont.TextSize(15), fontWeight: 'bold', color: '#2ed37e', marginLeft: 15
  },
  fare: {
    fontSize: TextFont.TextSize(16), fontWeight: 'bold', color: '#000',
  },
  dot: {
    height: 10, width: 10, borderRadius: 5,
  },
  adress: {
    fontSize: TextFont.TextSize(18), fontWeight: 'bold', color: '#404040', marginLeft: 15
  },
  content: {
    height: 40, width: width - 40, position: 'absolute', top: 5, left: 0, backgroundColor: '#ccc', flexDirection: 'row', borderRadius: 20, justifyContent: 'space-between', alignItems: 'center'
  },
  circle: {
    height: 50, width: height / 13, borderRadius: 25, justifyContent: 'center', alignItems: 'center',
  }
})
