import React, { Component, PureComponent } from 'react'
import {
  View, ListView, Text, Image, StatusBar, Keyboard, TouchableOpacity
} from 'react-native'
import InteractionManager from 'InteractionManager'
import { connect } from 'react-redux'

import { Icons, Screen, Session, TextFont, Define } from '../../utils'
import { account, application } from '../../redux/actions'
const { height, width } = Screen.window
const dataContrast = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1._id !== r2._id, sectionHeaderHasChanged: (s1, s2) => s1 !== s2 })

export default connect(state => ({ account: state.account, i18n: state.intl.messages }))(class LoginSelectAccountScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params
    const reducer = global.store.getState()
    return {
      drawerLockMode: 'locked-closed',
      title: reducer.intl.messages.login_select_account
    }
  }

  constructor(props) {
    super(props)
    const { data } = this.props.navigation.state.params
    this.state = {
      dataSource: dataContrast.cloneWithRows(data)
    }
  }

  async componentDidUpdate() {
    await InteractionManager.runAfterInteractions()
    Keyboard.dismiss()
  }
  async onSelect(row) {
    const { value, type } = this.props.navigation.state.params
    if (type === 'EMAIL_LOGIN') {
      if (row.phoneCountryCode && row.phoneNo) {
        const { phoneCountryCode, phoneNo  } = row
        let body = { phoneCountryCode: phoneCountryCode, phoneNo: phoneNo }
        try {
          const data = await Session.User.Post('v1/sendVerificationCode/phone', body)
          this.props.dispatch(account.loginPutValue(2))
          this.props.dispatch(application.setMailModeValue(row._id))
        } catch (e) {
          this.props.dispatch(application.showMessage('无法连接到服务器，请稍后再试'))
        }
      }else{
        this.props.dispatch(account.loginPutValue(4))
        this.props.dispatch(application.setMailModeValue(row._id))
      }
    } else {
      this.props.dispatch(account.loginNext({
        stage: type === 'BIND_PHONE' ? 6 : 3, value: Object.assign({}, value, {
          _id: row._id
        })
      }))
    }
    this.props.navigation.goBack()

  }

  render() {
    const { value, type } = this.props.navigation.state.params
    const { i18n } = this.props
    const { isMail } = value

    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <StatusBar animated={true} hidden={false} backgroundColor={'#1AB2FD'} barStyle={'light-content'} />
        {type === 'BIND_PHONE' &&
          <View style={{ marginHorizontal: 20, marginVertical: 15, }}>
            <Text style={{ color: '#999999', fontSize: 13 }}>Bind account </Text>
          </View >
        }
        {
          type === 'EMAIL_LOGIN' &&
          <View style={{ marginHorizontal: 20, marginVertical: 15, }}>
            <Text style={{ color: '#999999', fontSize: 13 }}>Select account</Text>
          </View >
        }
        <ListView
          enableEmptySections={true}
          dataSource={this.state.dataSource}
          renderRow={(row) => (<RowItem isMail={isMail} onPress={() => this.onSelect(row)} data={row} i18n={i18n} />)}
          renderSeparator={() => (
            <View style={{ backgroundColor: '#f2f2f2', height: .8 }}></View>
          )}
          style={{ backgroundColor: 'white', flex: 1 }}
        />
        {type === 'BIND_PHONE' &&
          <View style={{ height: 60, width: width - 60, marginHorizontal: 30, }}>
            <TouchableOpacity style={{ flex: 1, marginBottom: Define.system.ios.x ? 32 : 10, marginTop: 6, justifyContent: 'center', alignItems: 'center', borderRadius: 22, backgroundColor: '#ffa81d' }}
              onPress={() => this.props.dispatch(account.loginNext({ stage: 7, value: value }))}
            >
              <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15 }}>Bind account </Text>
            </TouchableOpacity >
          </View >
        }
      </View>
    )
  }
})

class RowItem extends Component {
  render() {
    const { onPress = () => { }, isMail, i18n } = this.props
    const { _id, avatars, fullName, phoneNo } = this.props.data
    // const role = rights.reduce((prev, next) => prev + `, ${next}`)

    return (
      <TouchableOpacity onPress={onPress} activeOpacity={.7} style={{ height: 68, backgroundColor: 'white', justifyContent: 'center' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 15 }}>
          <View style={{ width: 68, justifyContent: 'center' }}>
            <Image style={{ width: 48, height: 48, borderRadius: 24 }} source={{ uri: avatars[avatars.length - 1].url }} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, color: '#333', fontWeight: '400', marginBottom: 4 }}>{fullName}</Text>
            {isMail && <Text style={{ fontSize: 12, color: '#666', fontWeight: '400' }}>{phoneNo ? i18n.active : i18n.inactive}</Text>}
          </View>
          <View style={{ width: 45, alignItems: 'flex-end' }}>
            {Icons.Generator.Material('keyboard-arrow-right', 26, '#999')}
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}
