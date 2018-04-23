/**
 * modal.select.car
 * Created by yml on 2018/04/20.
 */
import React, { Component } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  TextInput,
  ScrollView
} from 'react-native'
import { connect } from 'react-redux'

import { Screen, Icons, Define, Session, UtilMath, TextFont } from '../../../../utils'
import Resources from '../../../../resources'

const { height, width } = Screen.window
export default connect(state => state.booking)(class SelectCarModel extends Component {

  constructor(props) {
    super(props)
    this.state = { selectIndex: 0 }
  }

  onChange(index) {
    this.setState({
      selectIndex: index
    })
  }

  render() {
    let modalHeight = width
    const { visible, i18n } = this.props
    const { selectIndex } =this.state
    return (
      <Modal
        animationType='fade'           //渐变
        transparent={true}             // 不透明
        visible={visible}    // 根据isModal决定是否显示
        onRequestClose={() => this.props.carChange()}  // android必须实现 安卓返回键调用
      >
        <View style={[
          { width: width, height: height, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(57, 56, 67, 0.4)' },
          { shadowOffset: { width: 0, height: 3 }, shadowColor: '#999', shadowOpacity: .5 }
        ]}>
          <View style={{ width: modalHeight - 60 }}>
            <View style={{ height: 40, marginTop: 40, backgroundColor: '#FDC377', borderTopLeftRadius: 20, borderTopRightRadius: 20, width: modalHeight - 60 }} />
            <View style={{ height: 80, position: 'absolute', top:0, left: 20, width: modalHeight -80}}>
              <Image style={{ height: 80, width:183 }} source={Resources.image.car_vehicle} />
            </View>
            <View style={{ padding: 15, backgroundColor: '#fff', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
              <View style={{ }}>
                <Text style={{ color: '#000', fontSize: TextFont.TextSize(17), marginBottom: 5 }}>{'选择车型'}</Text>
                <Text style={{ color: '#ccc', fontSize: TextFont.TextSize(14) }}>{'请选择车型'}</Text>
                <View style={{ marginTop: 15, borderRadius: 10, borderColor: '#ddd', borderWidth: StyleSheet.hairlineWidth }}>
                  {
                    this.props.vehicle_categories.map((pipe, id) => (
                      <CarCell 
                        key={id} 
                        isSelected={selectIndex === parseInt(id)}
                        onChange={() => this.onChange(parseInt(id))}
                        img={pipe.icon} 
                        border={parseInt(id) + 1 === this.props.vehicle_categories.length ? false : true} 
                        fare={pipe.fare} 
                        car={pipe.name}
                      />
                    ))
                  }
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15, marginHorizontal: 0, justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={() => this.props.onClose()}
                  activeOpacity={.7} style={{ width: 100, height: 40, borderRadius: 25, backgroundColor: '#D8D8D8', justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: '#000', fontSize: TextFont.TextSize(15), fontWeight: '600' }}>{i18n.cancel}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.props.onClose()} activeOpacity={.7} style={{ width: 100, height: 40, borderRadius: 25, backgroundColor: '#ffb639', justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: '#000', fontSize: TextFont.TextSize(15), fontWeight: '600' }}>{i18n.confirm}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={{ height: 60 }} />
        </View>
      </Modal >
    )
  }
})


const CarCell = (props) => {
  let innerCircle = props.isSelected ? <View style={[styles.innerCircle, { backgroundColor: '#1AB2FD' }]} /> : null
  let brderstyle = props.border ? { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#ddd' } : null
  return (
    <TouchableOpacity 
      onPress={props.onChange}
      activeOpacity={1} 
      style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} >
        <Image style={{ height: 32, width:32, marginHorizontal: 10 }} source={props.img} />
        <Text style={{ color: '#111', fontSize: 14, fontWeight: '600' }}>{props.car}</Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', }} >
        <Text style={{ color: '#1AB2FD', fontSize: 14, fontWeight: '600' }}>{`RM ${props.fare}`}</Text>
        <View style={{ padding: 10 }}>
          <View style={styles.outerCircle}>
            {innerCircle}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}
const styles = StyleSheet.create({
  outerCircle: {
    height: 20,
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 2 / window.scale,
    borderRadius: 10,
    backgroundColor: '#D8D8D8'
  },
  innerCircle: {
    height: 14,
    width: 14,
    borderRadius: 7
  }
})