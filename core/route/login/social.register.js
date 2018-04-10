/* global store */
import React, { Component } from 'react'
import {
  Text, View, StyleSheet, StatusBar, Image, TouchableOpacity, TouchableHighlight,
  DeviceEventEmitter, TextInput, Easing, ListView, ScrollView, RefreshControl, Switch
} from 'react-native'
import InteractionManager from 'InteractionManager'
import { NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'

import { Screen, Icons, Redux, Define, System, Session } from '../../utils'
import { Button } from '../../components'
import Resources from '../../resources'
import { application, account, booking } from '../../redux/actions'
import { FormattedMessage } from 'react-intl'

const {height, width} = Screen.window

export default connect(state => ({
  i18n: state.intl.messages
}))(class SocialRegisterScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const reducer = store.getState()
    return {
      drawerLockMode: 'locked-closed',
      title: reducer.intl.messages.social_register
    }
  }

  constructor(props) {
    super(props)
    const userInfo = this.props.navigation.state.params.userInfo
    this.state = {
      userInfo: userInfo,
      fullName: userInfo.name,
      phoneCountryCode: '+86',
      phoneNo: '',
      phoneVerificationCode: '',
      referralUserId: '',

      registering: false,
      // codeSent: false
    }
  }

  async _fetchData() {
    const body = {
      fullName: this.state.fullName,
      phoneCountryCode: this.state.phoneCountryCode,
      phoneNo: this.state.phoneNo,
      phoneVerificationCode: this.state.phoneVerificationCode,
      oAuth: {
        provider: 'facebook',
        id: this.state.userInfo.uid
      },
      // _id: '5a4dfb482dd97f23dc6a06c4',
      referralUserId: this.state.referralUserId
    }
    try {
      const data = await Session.User.Post('v1/register', body)

      this.props.dispatch(account.saveLogin(data))
      this.props.dispatch(application.hideProgress())
      this.props.dispatch(application.updatePushToken())
    } catch (e) {
      console.log('Facebook注册失败', e)
    } finally {
      this.setState({
        registering: false
      })
    }
  }

  render() {
    const { i18n } = this.props
    const { registering, userInfo, fullName, phoneCountryCode, phoneNo, phoneVerificationCode, referralUserId } = this.state
    const { iconurl, name, uid } = userInfo
    return (
      <ScrollView style={{ flex: 1, backgroundColor: 'white' }} horizontal={false} keyboardDismissMode={ 'interactive' } >
        <View style={{ paddingTop: 20, alignItems: 'center' }}>
          <Image source={{ uri: iconurl }} style={{ width: 50, height: 50, borderRadius: 25 }} />
        </View>
        <View style={{ padding:20 }}>
          <View style={{ borderBottomWidth: 1, borderBottomColor: '#a5a5a5'}}>
            <Text style={{ fontSize: 12, color: '#666' }}>{i18n.name}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', height: 38, marginTop:6}}>
              {/* <Text style={{ fontSize: 14 }}>RM</Text> */}
              <TextInput style={{ flex: 1, fontSize: 14}} placeholder={i18n.enter_name} underlineColorAndroid="transparent" onChangeText={ (value) => this.setState({ fullName: value}) } value={ fullName } />
            </View>
          </View>

          <View style={{ paddingTop: 20, borderBottomWidth: 1, borderBottomColor: '#a5a5a5'}}>
            <Text style={{ fontSize: 12,color: '#666' }}>{i18n.phone}</Text>
            <View style={{ flex: 1, flexDirection: 'row', marginTop: 12, height: 38, }}>
              <Button style={{ marginRight: 10, height: 38, width: 60, justifyContent: 'center' }}
                onPress={() => this.props.navigation.navigate('PickerCountry', {
                  onPress: ({ name, code }) => this.setState({ phoneCountryCode: code })
                })} >
                <Text style={{}}>{ phoneCountryCode }</Text>
              </Button>
              <TextInput style={{ flex: 1, fontSize: 14, justifyContent: 'center' }} underlineColorAndroid="transparent" placeholder={i18n.enter_phone} returnKeyType={'done'} keyboardType={'phone-pad'} onChangeText={ (value) => this.setState({phoneNo: value}) } />
            </View>
          </View>

          <View style={{ paddingTop: 20, justifyContent: 'flex-end' }}>
            <Text style={{ fontSize: 12, color: '#666'}}>
              <FormattedMessage id={'verification_code'} />
            </Text>
            <View style={{ flex: 1, flexDirection: 'row',height: 38, }}>
              <TextInput style={{ flex: 1, fontSize: 14, height: 38, borderBottomWidth: 1, borderBottomColor: '#a5a5a5' }} underlineColorAndroid="transparent" placeholder={i18n.enter_code} keyboardType={'numeric'} onChangeText={ (value) => this.setState({phoneVerificationCode: value}) } />
              <Button style={{ marginLeft: 10, marginTop: 0, borderRadius: 5, width: 150, height: 38, backgroundColor: '#4cb1f7' }}
                onPress={ async () => {
                  const body = {
                    phoneCountryCode: phoneCountryCode,
                    phoneNo: phoneNo
                  }
                  try {
                    const data = await Session.User.Post('v1/sendVerificationCode/phone', body)
                    this.props.dispatch(application.showMessage(i18n.alert_sent_code))
                    // this.setState({
                    //   codeSent: true
                    // })
                  } catch (e) {
                    if (e.response && e.response.data.code == 'VERIFICATION_CODE_RESEND_WAIT') {
                      this.props.dispatch(application.showMessage(`${i18n.server_busy_code}[${e.response.data.data}]${i18n.seconds_later}`))
                    } else {
                      this.props.dispatch(application.showMessage('无法连接到服务器，请稍后再试'))
                    }
                  }
                }}>
                <Text style={{ color: 'white' }}>{i18n.send_code}</Text>
              </Button>
            </View>
          </View>

          <View style={{ paddingTop: 20, borderBottomWidth: 1, borderBottomColor: '#a5a5a5', }}>
            <Text style={{ fontSize: 12, color: '#666' }}>推荐人账号</Text>
            <TextInput style={{ fontSize: 14, height: 38, marginTop:6}} placeholder={i18n.enter_referee_id} underlineColorAndroid="transparent" returnKeyType={'done'} onChangeText={ (value) => this.setState({ referralUserId: value}) }/>
          </View>

          <View style={{ paddingTop: 30, flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
            <Button disabled={ registering } onPress={ () => {
              if (this.state.fullName == '' |
              this.state.phoneNo == '' |
              this.state.phoneVerificationCode == '' |
              this.state.referralUserId == '') {
                this.props.dispatch(application.showMessage(i18n.pls_finish_info))
              } else {
                this._fetchData()
              }
            }} style={[{ width:240, height: 44, borderRadius: 4 }, registering ? {backgroundColor: '#a5a5a5'} : {backgroundColor: '#4cb1f7'}]}>
              {
                registering ?
                  <Text style={{ fontSize: 20, color: 'white' }}>{`${i18n.registering}...`}</Text> :
                  <Text style={{ fontSize: 20, color: 'white' }}>{i18n.register}</Text>
              }
            </Button>
          </View>
        </View>
      </ScrollView>
    )
  }
})
