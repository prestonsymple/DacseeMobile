import React, { Component } from 'react'
import { Animated, StyleSheet, TouchableOpacity, TouchableHighlight, Modal, Platform, View, ActivityIndicator } from 'react-native'

export default class Loading extends Component {
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {};
  }

  render() {
    return (
      <Modal
        transparent = {true}
        onRequestClose={()=> this.onRequestClose()}
      >
        <View style={{ flex: 1, justifyContent:'center', alignItems: 'center', backgroundColor:'rgba(0, 0, 0, 0.5)' }}>          
          <View style={{ width: 60, height: 60, backgroundColor: 'white', borderRadius: 10 }}>
            <ActivityIndicator size="large" color="#333" /> 
          </View>          
        </View>
      </Modal>
    )
  }
}