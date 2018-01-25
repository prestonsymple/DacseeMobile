/* eslint-disable */
import React, { Component, PureComponent } from 'react'
import { 
  View, TouchableOpacity, Modal, Text, Animated, Alert, AppState, TextInput, ScrollView, ListView,
  Image
} from 'react-native'
import InteractionManager from 'InteractionManager'
import * as Progress from 'react-native-progress'
import CodePush from 'react-native-code-push'
import { connect } from 'react-redux'
import { NavigationActions, SafeAreaView } from 'react-navigation'

/*****************************************************************************************************/
import { System, Icons, Screen } from '../utils'
import { Button } from '../components'
/*****************************************************************************************************/


export default class DriverRespondView extends Component {
  render() {
    const { onPressCancel, onSelectAddress, defaultData, data, onChangeKeywords, field } = this.props
    return (
      <Modal onRequestClose={() => {}} {...this.props} transparent={true} style={{ }}>
        <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#66666699', flex: 1 }}>
          <View style={[
            { width: Screen.window.width - 90, height: 296, backgroundColor: 'white', borderRadius: 4 },
            { paddingTop: 15, paddingBottom: 10 },
            { shadowOffset: { width: 0, height: 2 }, shadowColor: '#666', shadowOpacity: .3, shadowRadius: 3 }
          ]}>
            <View style={[
              { height: 120, width: Screen.window.width - 90, justifyContent: 'center', alignItems: 'center' },
              { top: 35, position: 'absolute' }
            ]}>
              <Progress.Circle 
                size={124}
                color={'#999999EE'} 
                indeterminate={true} 
                // borderRadius={4}
                // animationType={'decay'}
                // borderColor={'transparent'}
                style={[ ]} />
            </View>
            <View style={{ height: 120, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
              <Image style={{ width: 120, height: 120, borderRadius: 60 }} source={require('../resources/images/test.jpg')} />
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
              <Text style={{ color: '#777', fontSize: 16, fontWeight: '200' }}>行程确认中，请稍等</Text>
            </View>
            <Button style={{ backgroundColor: '#e54224', borderRadius: 4, height: 44, marginHorizontal: 10 }}>
              <Text style={{ fontSize: 16, color: 'white' }}>取消</Text>
            </Button>
          </View>
        </View>
      </Modal>
    )
  }
}