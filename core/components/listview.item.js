import React, { Component, PureComponent } from 'react'
import { Text, View, Animated, TouchableOpacity, Image, ListView, Alert, Button } from 'react-native'

import {
  Screen, Icons, Define,TextFont
} from '../utils'

export default class ListViewItem extends PureComponent {
  render() {
    const {
      title = '',
      value = '',
      underline = true,
      onPress = () => {},
      button = false,
      editable = true
    } = this.props.data

    return (
      button ? (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={{ justifyContent: 'center', alignItems: 'center', height: 44, backgroundColor: 'white' }}>
          <Text style={{ color: '#333', fontSize: TextFont.TextSize(15) }}>{ title }</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={editable ? onPress : () => {}} activeOpacity={0.7} style={{ paddingHorizontal: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 44, backgroundColor: 'white' }}>
          <Text style={{ color: '#333', fontSize: TextFont.TextSize(15), fontWeight: '400' }}>{title}</Text>
          <View style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: '#666', fontSize: TextFont.TextSize(15), marginRight: editable ? 0 : 10 }}>{value}</Text>
            { editable ? Icons.Generator.Material('chevron-right', 24, '#bbb') : null }
          </View>
        </TouchableOpacity>
      )
    )
  }
}
