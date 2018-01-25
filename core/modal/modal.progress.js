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


export default connect(state => ({ application: state.application }))(
  class ProgressModal extends Component {
    render() {
      const {  } = this.props
      return (
        <Modal 
          onRequestClose={() => {}} 
          transparent={true} 
          visible={this.props.application.progress_modal_visible} 
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
