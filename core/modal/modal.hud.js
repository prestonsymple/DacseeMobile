import React, { Component } from 'react'
import { Animated, StyleSheet, Modal, Platform, View, ActivityIndicator } from 'react-native'

import { connect } from 'react-redux'
import { application } from '../redux/actions'

export default connect((state)=>({
  hudModalVisible: state.application.hud_modal_visible
}))(class Hud extends Component {
  constructor(props) {
    super(props);
    // 初始状态
    // this.state = {};
  }

  // async componentWillMount() {}

  render() {
    const { hudModalVisible } = this.props
    return (
      <Modal
        transparent = {true}
        onRequestClose={()=> {}}
        visible={hudModalVisible} 
        animationType={'fade'} 
      >
        <View style={{ flex: 1, justifyContent:'center', alignItems: 'center' }}>          
          <View style={{  justifyContent:'center', alignItems: 'center', width: 80, height: 80, backgroundColor: '#333', borderRadius: 10 }}>
            <ActivityIndicator size='large' color='white' /> 
          </View>          
        </View>
      </Modal>
    )
  }
})