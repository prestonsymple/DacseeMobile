import React, { Component, PureComponent } from 'react'
import { Text, View, TouchableOpacity, Modal,PixelRatio } from 'react-native'
import {
  Screen, Icons, Define,TextFont
} from '../utils'
import Wheel from './Wheel'
import _ from 'lodash'
const { height, width } = Screen.window
const pixelSize = (function() {
  let pixelRatio = PixelRatio.get()
  if (pixelRatio >= 3) return 0.333
  else if (pixelRatio >= 2) return 0.5
  else return 1
})()
export default class SelectCar extends PureComponent {
  constructor(props) {
    super(props)
    this.cars = this.props.cars
    this.state={
      car:this.cars[0]
    }
  }
  componentDidMount(){

  }
  onPayChange(index){
    this.setState({
      car:this.cars[index]
    })
  }

  render() {
    let modalHeight = Define.system.ios.x ? 266 + 22 : 266
    let weelHeight=modalHeight- 70
    return (
      <Modal
        animationType='fade'           //渐变
        transparent={true}             // 不透明
        visible={this.props.visible}    // 根据isModal决定是否显示
        onRequestClose={() => this.props.carChange()}  // android必须实现 安卓返回键调用
      >
        <View style={{ width: width, height: height, backgroundColor: 'rgba(57, 56, 67, 0.2)' }}>
          <View style={{ width: width, height:height-modalHeight }}></View>
          <View style={{ height:modalHeight, backgroundColor: '#fff', paddingBottom: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth:pixelSize, borderBottomColor: '#ccc', alignItems: 'center', width: width, height: 50 }}>
              <TouchableOpacity style={{ height: 50, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' }} onPress={()=>this.props.carChange()} >
                <Text style={{ color: '#1ab2fd', fontSize: TextFont.TextSize(15) }}>{this.props.i18n.cancel}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ height: 50, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' }} onPress={()=>this.props.carChange(this.state.car)} >
                <Text style={{ color: '#ffa03c', fontSize: TextFont.TextSize(15) }}>{this.props.i18n.confirm}</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: width,height:weelHeight}}>
              <Wheel
                style={{ height: weelHeight, width: width  }}
                itemStyle={{ textAlign: 'center' }}
                index={this.cars.indexOf(this.state.car)}
                items={this.cars}
                onChange={index => this.onPayChange(index)}
              />
            </View>
          </View>
        </View>
      </Modal>
    )
  }
}
