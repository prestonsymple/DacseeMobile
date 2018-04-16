import React, { Component } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  Image, StyleSheet
} from 'react-native'
import {Icons, Screen, Define, Session, TextFont, System} from '../../../../utils'

export default  class ItemPerson extends Component {
  render() {
    const { onPressDetail = () => { }, onPressCheck = () => { }, data } = this.props
    const { _id, friend_id, friend_info, checked } = data
    const { avatars = [{ url: '' }], email, fullName, phoneCountryCode, phoneNo, userId } = friend_info

    /** @TODO 多语言 */
    return (
      <TouchableOpacity onPress={() => onPressDetail()} activeOpacity={.7} style={{ height: 84, backgroundColor: 'white', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
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
        {
          <TouchableOpacity onPress={() => onPressCheck()} hitSlop={{ top: 27, left: 40, bottom: 27, right: 0 }} activeOpacity={.7} style={[styles.circle, { backgroundColor: checked ? '#7ed321' : '#e7e7e7' }]}>
            {checked ? Icons.Generator.Material('check', 18, 'white') : null}
          </TouchableOpacity>
        }
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  circle: {
    width: 23,
    height: 23,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2
  }
})
