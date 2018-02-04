/* @flow */

import React, { Component } from 'react'
import { View, ScrollView, Text, Dimensions } from 'react-native'
const { width, height } = Dimensions.get('window')

const fixPlusPixel = width <= 375 ? .5 : 1


// 表单容器
class FormGroup extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    const { title = '', children = [], id } = this.props

    return (
      <View key={id} style={{ flex: 1, backgroundColor: '#f8f8f8', paddingTop: 18 }}>
        <View style={{ height: 20, paddingLeft: 15 }}>
          <Text style={{ color: '#666', fontSize: 13, fontWeight: '400' }}>{ title }</Text>
        </View>
        <View style={{ 
          backgroundColor: 'white', 
          borderTopWidth: fixPlusPixel, 
          borderBottomWidth: fixPlusPixel,
          borderColor: '#eee'
        }}>
          { children }
        </View>
      </View>
    )
  }

}

export default FormGroup