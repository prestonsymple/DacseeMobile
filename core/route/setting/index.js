// @flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import Settings from './settings'
import SettingAboutScreen from './setting.about'
import SettingFeedbackScreen from './setting.feedback'
import SettingHelpCenterScreen from './setting.help.center'
import SettingWetViewScreen from './setting.web.view'

import ProfileChangeAvatarScreen from './profile.change.avatars'

import { Session } from '../../utils'

import {
  account, application
} from '../../redux/actions'

// 主菜单
const SettingMenuScreen = connect(state => ({}))(class SettingScreen extends PureComponent {
  static navigationOptions = { title: '设置' }
  
  render() {
    const { navigation, dispatch } = this.props

    return (
      <Settings producer={[
        [{
          title: '账号与安全', type: 'text', onPress: () => navigation.navigate('SettingAccount')
        }],
        [{
          title: '语言和地区', type: 'text', onPress: () => navigation.navigate('SettingLanguageRegion')
        }],
        [{
          title: '意见反馈', type: 'text', onPress: async () => navigation.navigate('SettingWetView', { 
            title: '意见反馈 - 演示',
            source: { uri: 'https://m.connect.aliyun.com/?utm_source=mmenu' }
          })
        }, {
          title: '帮助中心', type: 'text', onPress: () => navigation.navigate('SettingWetView', { 
            title: '帮助中心 - 演示',
            source: { uri: 'https://m.aliyun.com/doc/index.html' }
          })
        }, {
          title: '关于', type: 'text', onPress: () => navigation.navigate('SettingAbout')
        }],
        [{
          title: '切换账号', type: 'button', onPress: () => {
            dispatch(account.logoutSuccess())
          }
        }]
      ]} />
    )
  }
})

// 账号与安全
const SettingAccountScreen = connect(state => ({ user: state.account.user }))(class SettingProfileScreen extends PureComponent {
  static navigationOptions = { title: '账号与安全' }

  async _changeFullName(value) {    
    try {
      const resp = await Session.user.put('v1/profile', { fullName: value })
      this.props.dispatch(account.setAccountValue({
        user: Object.assign({}, this.props.user, { fullName: resp.data.fullName })
      }))
      this.props.dispatch(application.showMessage('全名修改成功'))
    } catch (e) {
      this.props.dispatch(application.showMessage('网络状况差，请稍后再试'))
    } 
  }

  async _changeEmail(value) {    
    try {
      const data = await Session.User.Put('v1/profile', { email: value })
      this.props.dispatch(account.setAccountValue({
        user: Object.assign({}, this.props.user, { email: data.email })
      }))
      this.props.dispatch(application.showMessage('邮箱修改成功'))
    } catch (e) {
      this.props.dispatch(application.showMessage('网络状况差，请稍后再试'))
    } 
  }

  render() {
    const { navigation, dispatch, user } = this.props

    return (
      <Settings producer={[
        [{
          title: '我的头像', type: 'image', value: { uri: user.avatars[user.avatars.length - 1].url }, onPress: () => navigation.navigate('ProfileChangeAvatar')
        }],[{
          title: '手机号', type: 'text', value: `(${user.phoneCountryCode})${user.phoneNo}`, editable: false
        }, {
          title: '账号', type: 'text', value: user.userId, editable: false
        }, {
          title: '全名', 
          type: 'text', 
          value: `${user.fullName}`, 
          onPress: () => navigation.navigate('FormEditor', { 
            title: '修改全名',
            editorName: 'String', 
            option: { 
              placeholder: '请输入您的全名',
              value: user.fullName,
              onChangeValue:  (val) => this._changeFullName(val)
            } 
          })
        }, {
          title: '邮箱账号', 
          type: 'text', 
          value: user.email || '尚未绑定', 
          onPress: () => navigation.navigate('FormEditor', { 
            title: '修改邮箱',
            editorName: 'String', 
            option: { 
              placeholder: '请输入您的邮箱',
              value: user.email,
              onChangeValue:  (val) => this._changeEmail(val)
            } 
          })
        }], [{
          title: '绑定至微信', type: 'text', value: '', onPress: () => { this.props }
        },{
          title: '绑定至微博', type: 'text', value: '', onPress: () => {}
        }, {
          title: '绑定至QQ', type: 'text', value: '', onPress: () => {}
        }]
      ]} />
    )
  }
})

// 新消息通知
const SettingMessageNotificationScreen = connect(state => ({}))(class PushNotificationScreen extends PureComponent {
  static navigationOptions = { title: '新消息通知' }

  render() {
    return (
      <Settings producer={[
        [{
          title: '允许推送消息', type: 'switch', value: false, editable: false, onPress: () => {}
        }]
      ]} />
    )
  }
})

// 语言和地区
const SettingLanguageRegionScreen = connect(state => ({}))(class SettingLanguageRegionScreen extends PureComponent {
  static navigationOptions = { title: '语言及地区' }

  render() {
    return (
      <Settings producer={[
        [{
          title: '语言', type: 'text', value: '中文(简体)', editable: true, onPress: () => {}
        }, {
          title: '地区', type: 'text', value: '中国大陆', editable: true, onPress: () => {}
        }]
      ]} />
    )
  }
})

export {
  SettingMenuScreen,
  SettingAboutScreen,
  SettingAccountScreen,
  SettingMessageNotificationScreen,
  SettingLanguageRegionScreen,
  SettingFeedbackScreen,
  SettingHelpCenterScreen,
  SettingWetViewScreen,
  ProfileChangeAvatarScreen
}