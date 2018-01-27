/* eslint-disable */
import React, { Component, PureComponent } from 'react'
import { View, TouchableOpacity, Modal, Text, Animated, Alert, AppState, TextInput, ScrollView, ListView } from 'react-native'
import InteractionManager from 'InteractionManager'
import CodePush from 'react-native-code-push'
import { connect } from 'react-redux'

/*****************************************************************************************************/
import { System, Icons, Screen } from '../utils'
import { Button, Progress } from '../components'
/*****************************************************************************************************/


export default connect(({ application }) => ({ 
  progressModalVisible: application.progress_modal_visible
}))(
  class ProgressModal extends Component {
    render() {
      const { progressModalVisible } = this.props
      return (
        <Modal 
          onRequestClose={() => {}} 
          transparent={true} 
          visible={progressModalVisible} 
          animationType={'fade'} 
          {...this.props} 
          style={{ backgroundColor: '' }}
        >
          <Progress style={{ width: 40, height: 40 }} />
        </Modal>
      )
    }
  }
)
