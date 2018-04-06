import React, { Component } from 'react';
import {
  Text,
  View,
  Dimensions,
  Animated,
  PanResponder,
  Easing,
  StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';
const {width,height}=Dimensions.get('window')
import { Screen, Icons, Session, TextFont } from '../../../utils'
export default class OrderSlider extends Component {
  constructor(props) {
    super(props)
    this.width=0
    this.createPanResponder()
    this.translateX = 0
    this.state = {
      translateX: new Animated.Value(0),
      status:0
    }
  }
  onLayout(e){
    this.width=e.nativeEvent.layout.width
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
    this.state.translateX.stopAnimation()
    this.prevTouches= e.nativeEvent.touches
    this.firstTouche = e.nativeEvent.touches
  }

  onPanResponderMove(e, gestureState) {
    let { touches } = e.nativeEvent
    let prevTouches = this.prevTouches
    this.prevTouches = touches
    console.log(touches)
    if (touches.length != 1 || touches[0].identifier != prevTouches[0].identifier) {
      return
    }
    let value = touches[0].pageX - this.firstTouche[0].pageX
    value=value>this.width/2?this.width/2:value<-this.width/2?-this.width/2:value
    Animated.timing(this.state.translateX, {
      toValue: value,
      duration: 500,
      easing: Easing.linear ,
      useNativeDriver: true,
    }).start(() => {

    });

  }
  onPanResponderRelease(e, gestureState) {
    let offset=this.prevTouches[0].pageX- this.firstTouche[0].pageX
    let mdwidth=this.width/3-25
    let status=offset<-mdwidth?-1:offset>mdwidth?1:0
    if(status!=0){
      this.props.sliderChange(status)
    }
    if(offset>-mdwidth&&offset<mdwidth){
      Animated.spring(this.state.translateX, {
        useNativeDriver: true,
        toValue: 0
      }).start(() => {

      });
    }
  }
  render() {
    let {status}=this.state
    return (
      <View onLayout={e => this.onLayout(e)} {...this.panResponder.panHandlers} style={styles.container}>

        <View style={styles.content}>
          <Text style={{ fontSize: 15, color: '#fff',marginLeft:10 }}>放弃</Text>
          <Text style={{ fontSize: 15, color: '#fff',marginRight:10 }}>接受</Text>
        </View>
        <Animated.View
          style={[{transform: [{ translateX: this.state.translateX }]},styles.circle]}>
          {Icons.Generator.Material('code', 24, '#fff') }
        </Animated.View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container:{
    width:  width-40, height: 50, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
  },
  content:{
    height: 40, width:width-40, position: 'absolute', top: 5, left: 0, backgroundColor: '#ccc',flexDirection:'row', borderRadius: 20, justifyContent: 'space-between', alignItems: 'center'
  },
  circle:{
    height: 50, width: height/13, borderRadius:25, justifyContent: 'center',flexDirection:'row', alignItems: 'center',backgroundColor:'#fdb21a'
  }
})
