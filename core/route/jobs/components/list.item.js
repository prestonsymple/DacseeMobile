import React, { PureComponent } from 'react'
import {
  Text, View, Image, TouchableOpacity, ListView, ScrollView, RefreshControl, Switch
} from 'react-native'
import moment from 'moment'
import { Screen, Icons, Session } from '../../../utils'
import font from '../../../utils/util.textSize'
const TextSize=font.TextSize
const {height, width} = Screen.window

export default class ListItem extends PureComponent {

  render() {
    const { itemData, itemDay, onPress = () => { } } = this.props
    const { from, destination, booking_at, payment_method, fare, status } = itemData

    return (
      <TouchableOpacity activeOpacity={.7} onPress={onPress}>
        <View style={{ marginBottom: 15, marginLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
          <View style={[
            { width: width - 20, borderRadius: 6, backgroundColor: 'white' },
            { shadowOffset: { width: 0, height: 0 }, shadowColor: '#a2a3a8', shadowOpacity: .5, shadowRadius: 3 }
          ]}>
            <View style={{ margin: 15 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text numberOfLines={1} style={{ fontSize: TextSize(25), fontFamily: 'Helvetica', fontWeight: 'bold', color: '#67666c' }}>{from.name}</Text>
              </View>
              <View style={{ marginTop: 5, flexDirection: 'row', alignItems: 'center' }}>
                {/* <Text style={{ fontSize: TextSize(13), fontFamily: 'Helvetica', fontWeight: 'bold', color: '#B2B1B6'}}></Text> */}
                <Text style={{ fontSize: TextSize(15), fontFamily: 'Helvetica', fontWeight: 'bold', color: '#B2B1B6' }}>to {destination.name} </Text>
              </View>

              <View style={{ marginTop: 30, flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <View>{Icons.Generator.Material('access-time', TextSize(15), '#000000')}</View>
                <Text style={{ marginLeft: 5, fontSize: TextSize(15), color: '#5C5B63' }}>{moment(Date.parse(booking_at)).format('HH:mm')}</Text>
                <View style={{ marginLeft: 10, }}>{Icons.Generator.Material('payment', TextSize(15), '#000000')}</View>
                <Text style={{ marginLeft: 5, fontSize: TextSize(15), color: '#5C5B63' }}>{payment_method == 'Cash' ? '现金' : payment_method}</Text>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                  {/* <View style={{ marginLeft: 30 }}>{ Icons.Generator.Material('monetization-on', 15, '#bbb') }</View> */}
                  <Text style={{ fontSize: TextSize(15), marginLeft: 10, fontWeight: 'bold', color: '#6A696F' }}>{fare}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}
