/* @flow */

import React, { Component } from 'react'
import { View, Text, Dimensions, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
const { width, height } = Dimensions.get('window')

const fixPlusPixel = width <= 375 ? .5 : 1

import { Icons } from '../../utils'

// 文本输入
class FieldsTextInput extends Component {
  
  render() {
    const { key, value = '', label, defaultValue, placeholder, onPress, index } = this.props
    // const { value } = this.state

    return onPress ? (
      <TouchableOpacity onPress={() => onPress(this.props.navigation)} activeOpacity={.7} key={key} style={[
        { flexDirection: 'row', height: 44, alignItems: 'center', marginLeft: 15, paddingRight: 6 },
        { justifyContent: 'space-between' },
        index !== 0 && { borderTopWidth: fixPlusPixel, borderColor: '#eee' }
      ]}>
        <View style={{ width: 100 }}>
          <Text style={{ color: '#333', fontSize: 15, fontWeight: '400' }}>{ label }</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' }}>
          <Text style={{ color: (value || defaultValue) ? '#333' : '#999', fontSize: 15, fontWeight: '400' }}>{ value || defaultValue || placeholder }</Text>
          <View>{ Icons.Generator.Material('chevron-right', 24, '#bbb') }</View>
        </View>
      </TouchableOpacity>
    ) : (
      <View key={key} style={[
        { flexDirection: 'row', height: 44, alignItems: 'center', marginLeft: 15, paddingRight: 12 },
        { justifyContent: 'space-between' },
        index !== 0 && { borderTopWidth: fixPlusPixel, borderColor: '#eee' }
      ]}>
        <View style={{ width: 100 }}>
          <Text style={{ color: '#333', fontSize: 15, fontWeight: '400' }}>{ label }</Text>
        </View>
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <Text style={{ color: (value || defaultValue) ? '#333' : '#999', fontSize: 15, fontWeight: '400' }}>{ value || defaultValue || placeholder }</Text>
        </View>
      </View>
    )
  }
}

const CreateFieldsTextInput = (label : string, defaultValue : any, placeholder: string = '', onPress = undefined) => {
  const passProps = { label, placeholder, defaultValue, onPress }
  const reduxFilter = typeof(defaultValue) === 'function' ? defaultValue : () => ({})
  const ReduxConnect = connect(reduxFilter)(class CreateFieldsTextInput extends Component {
    render() {
      return (
        <FieldsTextInput {...this.props} {...passProps} />
      )
    }
  })
  return <ReduxConnect key={label} />
}

export {
  FieldsTextInput,
  CreateFieldsTextInput
}
