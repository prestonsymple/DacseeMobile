import React, { Component } from 'react'
import { Modal, View, ActivityIndicator } from 'react-native'

import { connect } from 'react-redux'

export default connect((state)=>({
  hudModalVisible: state.application.hud_modal_visible
}))(class Hud extends Component {

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