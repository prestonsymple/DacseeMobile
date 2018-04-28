/* global store */

import React, { PureComponent, Component } from 'react'
import {
  Text, View, TouchableOpacity, DeviceEventEmitter, ScrollView, TextInput, Image, RefreshControl, Alert, TouchableNativeFeedback
} from 'react-native'
// import ActionSheet from 'react-native-actionsheet'
import { connect } from 'react-redux'

import { } from '../../../redux/actions'
import { Icons, Screen, Define, System ,TextFont} from '../../../utils'
import ShareUtil from '../../../native/umeng/ShareUtil'
import { application } from '../../../redux/actions'

const { width, height } = Screen.window

export default connect(state => ({
  account: state.account,
  i18n: state.intl.messages || {}
}))(class FriendsCircleAddComponent extends Component {

  static navigationOptions = ({ navigation }) => {
    const { i18n } = navigation.state.params
    return {
      drawerLockMode: 'locked-closed',
      title: i18n.friend_add
    }
  }

  render() {
    const { dataSource } = this.state
    const { i18n } = this.props
    return (
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 22, paddingVertical: 22 }} style={{ flex: 1 }}>
          {/* PHONE NO. */}
          <BlockWrap
            iconBackgroundColor={'#4fb2f9'}
            icon={Icons.Generator.Awesome('phone', 36, 'white') }
            title={i18n.phone}
            describer={i18n.search_byphone}
            isPhoneNo={true}
            placeholder={'13x xxxx xxxx'}
            canInput={true}
            navigation={this.props.navigation}
            onPress={(value, countryCode) => {
              if (value.length === 0) return this.props.dispatch(application.showMessage(i18n.pls_enter_correct_num))
              this.props.navigation.navigate('FriendsSearchBase', { value, countryCode })
            }}
          />

          {/* EMAIL ADDRESS */}
          <BlockWrap
            iconBackgroundColor={'#4f9029'}
            icon={Icons.Generator.Awesome('envelope', 28, 'white')}
            title={i18n.email}
            describer={i18n.search_byemail}
            placeholder={'example@mail.com'}
            canInput={true}
            onPress={(value) => {
              if (value.length === 0 || !System.Rules.isMail(value)) return this.props.dispatch(application.showMessage(i18n.pls_enter_correct_email))
              this.props.navigation.navigate('FriendsSearchBase', { value })
            }}
          />

          {/* PHONE NO. */}
          <BlockWrap
            iconBackgroundColor={'#f4a951'}
            icon={Icons.Generator.Awesome('address-card', 28, 'white')}
            title={i18n.name_or_userid}
            describer={i18n.search_byname_userid}
            placeholder={''}
            canInput={true}
            navigation={this.props.navigation}
            onPress={(value) => {
              if (value.length < 2) return this.props.dispatch(application.showMessage(i18n.pls_enter_two_chars))
              this.props.navigation.navigate('FriendsSearchBase', { value })
            }}
          />

          {/* SCAN QRCODE SESSION */}
          <BlockWrap
            iconBackgroundColor={'#f4a951'}
            icon={Icons.Generator.Awesome('qrcode', 32, 'white')}
            title={'二维码'}
            describer={'通过扫码添加好友'}
            onPress={(value) => {
              this.props.navigation.navigate('CommonScanQRCode',{i18n} )
            }}
          />
        </ScrollView>
      </View>
    )
  }
})

class BlockWrap extends Component {

  constructor(props) {
    super(props)
    this.state = {
      value: '',
      countryCode: '+60'
    }
  }

  render() {
    const { canInput, title, describer, iconBackgroundColor, icon, isPhoneNo, placeholder, onPress = () => {} } = this.props
    const { countryCode, value } = this.state
    const WrapComponent = canInput ? View : TouchableOpacity

    return (
      <WrapComponent activeOpacity={.7} onPress={() => onPress()} style={[
        { shadowOffset: { width: 0, height: 2 }, shadowColor: '#999', shadowOpacity: .3, shadowRadius: 3 },
        { marginBottom: 15, height: 105, borderRadius: 17, backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 13 }
      ]}>
        <IconWrap backgroundColor={iconBackgroundColor}>{ icon }</IconWrap>
        <View style={{ justifyContent: 'center', marginLeft: 12, flex: 1 }}>
          <Text style={{ fontSize: TextFont.TextSize(16), color: 'black', marginBottom: canInput ? 2 : 6 }}>{ title }</Text>
          <Text style={{ fontSize: TextFont.TextSize(11), color: '#969696' }}>{ describer }</Text>
          {
            canInput && (
              <View style={{ marginTop: 6 }}>
                <View style={{ flexDirection: 'row', height: 36, borderRadius: 6, backgroundColor: '#e8e8e8', paddingHorizontal: 6, alignItems: 'center' }}>
                  {
                    isPhoneNo && (
                      <TouchableOpacity onPress={() => this.props.navigation.navigate('PublicPickerCountry', {
                        onPress: ({ name, code }) => this.setState({ countryCode: code })
                      })} activeOpacity={.7} style={[
                        { shadowOffset: { width: 0, height: 1 }, shadowColor: '#999', shadowOpacity: .5, shadowRadius: 3 },
                        { marginRight: 5, flexDirection: 'row', height: 26, borderRadius: 15, backgroundColor: '#3b90f7', width: 58, justifyContent: 'center', alignItems: 'center' }
                      ]}>
                        <Text style={{ color: 'white', fontSize: TextFont.TextSize(13), fontWeight: '400' }}>{countryCode}</Text>
                        { Icons.Generator.Material('arrow-drop-down', 14, 'white') }
                      </TouchableOpacity>
                    )
                  }
                  <TextInput {...Define.TextInputArgs} onChangeText={ value => this.setState({ value: (value || '').trim() }) } keyboardType={isPhoneNo ? 'number-pad' : 'default'} placeholder={placeholder} style={{ flex: 1, fontSize: TextFont.TextSize(13) }} />
                  <TouchableOpacity onPress={() => onPress(value, countryCode)} activeOpacity={.7} style={[
                    { shadowOffset: { width: 0, height: 1 }, shadowColor: '#999', shadowOpacity: .5, shadowRadius: 3 },
                    { backgroundColor: '#F5A623', width: 26, height: 26, borderRadius: 15, justifyContent: 'center', alignItems: 'center' }
                  ]}>
                    { Icons.Generator.Material('search', 18, 'black') }
                  </TouchableOpacity>
                </View>
              </View>
            )
          }
        </View>
      </WrapComponent>
    )
  }
}

class IconWrap extends Component {
  render() {
    return (
      <View style={[
        { width: 76, height: 76, borderRadius: 38, justifyContent: 'center', alignItems: 'center' },
        { borderColor: '#EAEAEA', borderWidth: 6 },
        { backgroundColor: this.props.backgroundColor }
      ]}>
        { this.props.children }
      </View>
    )
  }
}

class ItemPerson extends Component {
  render() {
    const { icon, label, describer, onPress = () => {} } = this.props.data
    return (
      <TouchableOpacity activeOpacity={.7} onPress={onPress} style={{ height: 60, backgroundColor: 'white', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', paddingHorizontal: 15 }}>
        <View style={{ justifyContent: 'center', width: 60 }}>
          {icon}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: TextFont.TextSize(16), color: '#333', fontWeight: '400', marginBottom: 2 }}>{ label }</Text>
          <Text style={{ fontSize: TextFont.TextSize(13), color: '#999' }}>{ describer }</Text>
        </View>
      </TouchableOpacity>
    )
  }
}
