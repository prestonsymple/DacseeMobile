/* @flow */

import React, { Component } from 'react'
import { View, ScrollView } from 'react-native'


// 表单容器
class FormContainer extends Component {

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
        <ScrollView>
          { this.props.children }
        </ScrollView>
      </View>
    )
  }

}

export default FormContainer