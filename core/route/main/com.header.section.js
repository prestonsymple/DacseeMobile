import React, { PureComponent } from 'react'
import {
  Text, View, TouchableOpacity, ScrollView
} from 'react-native'

import { booking } from '../../redux/actions'


export default class HeaderSection extends PureComponent {
  render() {
    return (
      <View style={[
        { position: 'absolute', top: 0, left: 0, right: 0, height: 34, backgroundColor: '#f7f7f7' },
        { shadowOffset: { width: 0, height: 2 }, shadowColor: '#999', shadowOpacity: .5, shadowRadius: 3 }
      ]}>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={{ height: 34 }}>
          {
            [{
              title: '出租车', key: 'taxi'
            }, {
              title: '朋友圈', key: 'circle'
            }, {
              title: '优选出行', key: 'standard'
            }, {
              title: '经济', key: 'eco'
            }, {
              title: '专车', key: 'lux'
            }].map((pipe, index) => (
              <TouchableOpacity activeOpacity={1} onPress={() => this.props.dispatch(booking.journeyUpdateData({ type: pipe.key }))} key={index} style={{ paddingHorizontal: 10, marginHorizontal: 10, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={this.props.type === pipe.key ? { color: '#FEA81C', fontSize: 13, fontWeight: '600' } : { color: '#666', fontSize: 13, fontWeight: '600' }}>{ pipe.title }</Text>
              </TouchableOpacity>
            ))
          }
        </ScrollView>
      </View>
    )
  }
}