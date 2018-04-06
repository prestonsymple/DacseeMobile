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
  render() {
    const { currentPosition } = this.props

    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={{ fontSize: 15, color: '#fff',marginLeft:10 }}>放弃</Text>
          <Text style={{ fontSize: 15, color: '#fff',marginRight:10 }}>接受</Text>
        </View>
        <Animated.View
          style={[{ transform: [ { translateX: currentPosition }],},styles.circle]}>
          {Icons.Generator.Material('code', 24, '#fff') }
        </Animated.View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container:{
    width:  width-50, height: 50, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
  },
  content:{
    height: 40, width:width-50, position: 'absolute', top: 5, left: 0, backgroundColor: '#ccc',flexDirection:'row', borderRadius: 20, justifyContent: 'space-between', alignItems: 'center'
  },
  circle:{
    height: 50, width: 50, borderRadius:25, justifyContent: 'center',flexDirection:'row', alignItems: 'center',backgroundColor:'#fdb21a'
  }
})
