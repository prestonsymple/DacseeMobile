// @flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'

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
const SettingMenuScreen = injectIntl(connect(state => ({}))(class SettingScreen extends PureComponent {
  static navigationOptions = { title: '设置' }
  
  render() {
    const { navigation, dispatch } = this.props
    const { formatMessage } = this.props.intl
    return (
      <Settings producer={[
        [{
          title: formatMessage({id: 'profile'}), type: 'text', onPress: () => navigation.navigate('SettingAccount')
        }],
        [{
          title: formatMessage({id: 'language_region'}), type: 'text', onPress: () => navigation.navigate('SettingLanguageRegion')
        }],
        [{
          title: formatMessage({id: 'feedback'}), type: 'text', onPress: async () => navigation.navigate('SettingWetView', { 
            title: '意见反馈 - 演示',
            source: { uri: 'https://m.connect.aliyun.com/?utm_source=mmenu' }
          })
        }, {
          title: formatMessage({id: 'help'}), type: 'text', onPress: () => navigation.navigate('SettingWetView', { 
            title: '帮助中心 - 演示',
            source: { uri: 'https://m.aliyun.com/doc/index.html' }
          })
        }, {
          title: formatMessage({id: 'about'}), type: 'text', onPress: () => navigation.navigate('SettingAbout')
        }],
        [{
          title: formatMessage({id: 'logout'}), type: 'button', onPress: () => {
            dispatch(account.logoutSuccess())
          }
        }]
      ]} />
    )
  }
}))

// 账号与安全
const SettingAccountScreen = injectIntl(connect(state => ({ user: state.account.user }))(class SettingProfileScreen extends PureComponent {
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
    const { formatMessage } = this.props.intl
    return (
      <Settings producer={[
        [{
          title: formatMessage({id: 'my_avatar'}), type: 'image', value: { uri: user.avatars[user.avatars.length - 1].url }, onPress: () => navigation.navigate('ProfileChangeAvatar')
        }],[{
          title: formatMessage({id: 'phone'}), type: 'text', value: `(${user.phoneCountryCode})${user.phoneNo}`, editable: false
        }, {
          title: formatMessage({id: 'account'}), type: 'text', value: user.userId, editable: false
        }, {
          title: formatMessage({id: 'fullname'}), 
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
          title: formatMessage({id: 'email'}), 
          type: 'text', 
          value: user.email || formatMessage({id: 'no_content'}), 
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
          title: formatMessage({id: 'bind_wechat'}), type: 'text', value: '', onPress: () => { this.props }
        },{
          title: formatMessage({id: 'bind_weibo'}), type: 'text', value: '', onPress: () => {}
        }, {
          title: formatMessage({id: 'bind_qq'}), type: 'text', value: '', onPress: () => {}
        }]
      ]} />
    )
  }
}))

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
const SettingLanguageRegionScreen = injectIntl(connect(state => ({}))(class SettingLanguageRegionScreen extends PureComponent {
  static navigationOptions = { title: '语言及地区' }

  render() {
    const { navigation } = this.props
    const { formatMessage } = this.props.intl
    return (
      <Settings producer={[
        [{
          title: formatMessage({id: 'language'}), type: 'text', value: '中文(简体)', editable: true, onPress: () => navigation.navigate('SettingLanguageChoose')
        }, {
          title: formatMessage({id: 'region'}), type: 'text', value: '中国大陆', editable: true, onPress: () => {}
        }]
      ]} />
    )
  }
}))

// 语言选择
const SettingLanguageChooseScreen = injectIntl(connect(state => ({
  ...state.storage
}))(class SettingLanguageChooseScreen extends PureComponent {
  static navigationOptions = { title: '语言选择' }

  constructor (props) {
    super(props)
  }

  render() {    
    const { navigation, dispatch, language } = this.props    
    const { formatMessage } = this.props.intl    
    return (
      <Settings producer={[
        [{
          title: formatMessage({id: 'cn_simple'}), type: 'radio', value: language == 'zh', editable: false, 
          onPress: () => {
            dispatch(application.setLanguage('zh'))
            navigation.goBack()
          }
        }, {
          title: formatMessage({id: 'mas'}), type: 'radio', value: language == 'mas', editable: false, 
          onPress: () => {
            dispatch(application.setLanguage('mas'))
            navigation.goBack()
          }
        }, {
          title: formatMessage({id: 'en'}), type: 'radio', value: language == 'en', editable: false, 
          onPress: () => {
            dispatch(application.setLanguage('en'))
            navigation.goBack()
          }
        }]
      ]} />
    )
  }
}))

export {
  SettingMenuScreen,
  SettingAboutScreen,
  SettingAccountScreen,
  SettingMessageNotificationScreen,
  SettingLanguageRegionScreen,
  SettingLanguageChooseScreen,
  SettingFeedbackScreen,
  SettingHelpCenterScreen,
  SettingWetViewScreen,
  ProfileChangeAvatarScreen
}