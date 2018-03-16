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
import { System, Icons, Screen, Session } from '../utils'
import { Button } from '../components' 
import { booking, application } from '../redux/actions'
import { BOOKING_STATUS } from '../route/main'
/*****************************************************************************************************/


export default connect(state => ({ status: state.booking.status }))(class DriverRespondView extends Component {
  render() {
    const { onPressCancel, onSelectAddress, defaultData, data, onChangeKeywords, field, booking_id = '' } = this.props
    return (
      <Modal onRequestClose={() => {}} visible={status === BOOKING_STATUS.PASSGENER_BOOKING_WAIT_DRIVER_ACCEPT} transparent={true} style={{ }}>
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
                color={'#ccccccEE'} 
                indeterminate={true} 
                // borderRadius={4}
                // animationType={'decay'}
                // borderColor={'transparent'}
                style={[ ]} />
            </View>
            <View style={{ height: 120, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
              {
                Icons.Generator.Material('settings-input-antenna', 88, '#eee')
              }
              {/* <Image style={{ width: 120, height: 120, borderRadius: 60 }} source={require('../resources/images/test.jpg')} /> */}
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
              <Text style={{ color: '#777', fontSize: 16, fontWeight: '200' }}>行程确认中，请稍等</Text>
            </View>
            <Button onPress={async () => {
              try {
                await Session.booking.put(`v1/${this.props.booking_id}`, { action: 'cancel' })
                this.props.dispatch(booking.journeyUserCancel())  
              } catch(e) {
                this.props.dispatch(application.showMessage('无法连接到服务器'))
              }
            }} style={{ backgroundColor: '#e54224', borderRadius: 4, height: 44, marginHorizontal: 10 }}>
              <Text style={{ fontSize: 16, color: 'white' }}>取消</Text>
            </Button>
          </View>
        </View>
      </Modal>
    )
  }
})