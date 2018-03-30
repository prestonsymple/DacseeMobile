import React, { Component, PureComponent } from 'react'
import { Text, View, TouchableOpacity, Modal,PixelRatio } from 'react-native'
import {
  Screen, Icons, Define
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
export default class SelectPay extends PureComponent {
  constructor(props) {
    super(props)
    this.pays = ['支付宝','微信','一网通银行卡','国际银行卡','QQ钱包']
  }
  componentDidMount(){

  }
  onPayChange(){

  }


  render() {

    let modalHeight = Define.system.ios.x ? 242 + 22 : 242
    let weelHeight=modalHeight- 70
    return (
      <Modal
        animationType='fade'           //渐变
        transparent={true}             // 不透明
        visible={this.props.visible}    // 根据isModal决定是否显示
        onRequestClose={() => this.props.payCancel()}  // android必须实现 安卓返回键调用
      >
        <View style={{ width: width, height: height, backgroundColor: 'rgba(57, 56, 67, 0.2)' }}>
          <TouchableOpacity style={{ width: width, height:height-modalHeight }} onPress={() => this.props.payCancel()} ></TouchableOpacity>
          <View style={{ height:modalHeight, backgroundColor: '#fff', paddingBottom: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth:pixelSize, borderBottomColor: '#ccc', alignItems: 'center', width: width, height: 50 }}>
              <TouchableOpacity style={{ height: 50, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' }} onPress={()=>this.props.payCancel()} >
                <Text style={{ color: '#1ab2fd', fontSize: 15 }}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ height: 50, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' }} onPress={()=>this.props.payCancel()} >
                <Text style={{ color: '#ffa03c', fontSize: 15 }}>确定</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: width,height:weelHeight}}>
              <Wheel
                style={{ height: weelHeight, width: width  }}
                itemStyle={{ textAlign: 'center' }}
                items={this.pays}
                onChange={index => this.onPayChange(index)}
              />
            </View>
          </View>
        </View>
      </Modal>
    )
  }
}
