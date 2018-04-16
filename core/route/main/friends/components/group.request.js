/**
 * Created by Rabbit on 2018/4/16.
 */
import React, { Component } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native'
import {Icons, Screen, Define, Session, TextFont, System} from '../../../../utils'

export default class RequestorPerson extends Component {
  render() {
    const { onPressAccept = () => {}, onPressReject = () => {}, data } = this.props
    const { _id, requestor_id, requestor_info } = data
    const { avatars = [{ url: '' }], email, fullName, phoneCountryCode, phoneNo, userId } = requestor_info

    //@TODO 行程的多语言
    return (
      <View activeOpacity={.7} style={{ height: 84, backgroundColor: 'white', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
        <View style={{ justifyContent: 'center', marginRight: 10 }}>
          <Image style={{ width: 56, height: 56, borderRadius: 28 }} source={{ uri: avatars[avatars.length - 1].url }} />
          {/*<View style={{ right: 2, bottom: 2, position: 'absolute', backgroundColor: '#7ED321', width: 12, height: 12, borderRadius: 6 }} />*/}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: TextFont.TextSize(16), color: '#333', fontWeight: '400', marginBottom: 5 }}>{fullName}</Text>
          <View style={{flexDirection: 'row'}}>
            <View style={{flexDirection: 'row',justifyContent: 'center', alignItems: 'center', backgroundColor:'#d7d7d7', borderRadius: 10, paddingHorizontal: 5, paddingVertical:0}}>
              {Icons.Generator.Material('lock', 15, '#797979')}
              <Text style={{fontSize:13, color:'#000', opacity: 0.8}}>public</Text>
            </View>
            <Text style={{marginLeft: 5, color:'#000', opacity: 0.8}}>100 Members</Text>
          </View>
        </View>
        <View style={{ marginRight: 0, flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={() => onPressReject(_id)} activeOpacity={.7} style={{ marginRight: 15, width: 30, height: 30, borderRadius: 18, backgroundColor: '#ff2239', justifyContent: 'center', alignItems: 'center' }}>
            { Icons.Generator.Material('close', 18, 'white') }
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onPressAccept(_id)} activeOpacity={.7} style={{ width: 30, height: 30, borderRadius: 18, backgroundColor: '#7dd320', justifyContent: 'center', alignItems: 'center' }}>
            { Icons.Generator.Material('add', 23, 'white') }
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}
