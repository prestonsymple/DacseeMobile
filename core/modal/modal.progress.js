/* eslint-disable */
import React, { Component, PureComponent } from 'react'
import { View, TouchableOpacity, Modal, Text, Animated, Alert, AppState, TextInput, ScrollView, ListView } from 'react-native'
import InteractionManager from 'InteractionManager'
import CodePush from 'react-native-code-push'
import { connect } from 'react-redux'
import Lottie from 'lottie-react-native'

/*****************************************************************************************************/
import Resources from '../resources'
import { System, Icons, Screen } from '../utils'
import { Button, Progress } from '../components'
/*****************************************************************************************************/


export default connect(({ application }) => ({ 
  progressModalVisible: application.progress_modal_visible
}))(
  class ProgressModal extends Component {

    constructor(props) {
      super(props)
      this.animated = new Animated.Value(0)
    }

    async componentWillMount() {}

    componentWillReceiveProps(props) {
      if (props.progressModalVisible) {
        Animated.loop(Animated.timing(this.animated, { toValue: 1, duration: 3000, useNativeDriver: true })).start()
      } else {
        this.animated.stopAnimation()
      }
    }

    render() {
      const { progressModalVisible } = this.props
      const aniamtedSize = {
        width: 300,
        height: 300,
        opacity: .7
      }

      return (
        <Modal 
          onRequestClose={() => {}} 
          transparent={true} 
          visible={progressModalVisible} 
          animationType={'fade'} 
          {...this.props} 
          style={{ backgroundColor: '' }}
        >
          <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <View style={{ ...aniamtedSize }}>
              <Lottie progress={this.animated} style={{ ...aniamtedSize }} source={Resources.animation.loader_star} />
            </View>
          </View>
        </Modal>
      )
    }
  }
)
