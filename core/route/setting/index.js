// @flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'

import Settings from './settings'
import SettingAboutScreen from './setting.about'
import SettingFeedbackScreen from './setting.feedback'
import SettingHelpCenterScreen from './setting.help.center'
import SettingWetViewScreen from './setting.web.view'

import ProfileChangeAvatarScreen from './profile.change.avatars'

import { Session } from '../../utils'

import {
  account, application, intl
} from '../../redux/actions'

// 主菜单
const SettingMenuScreen = connect(state => ({
  i18n: state.intl.messages || {}
}))(class SettingScreen extends PureComponent {
  static navigationOptions = { title: '设置' }

  render() {
    const { navigation, dispatch, i18n } = this.props

    return (
      <Settings producer={[
        [{
          title: i18n.profile, type: 'text', onPress: () => navigation.navigate('SettingAccount')
        }],
        [{
          title: i18n.language_region, type: 'text', onPress: () => navigation.navigate('SettingLanguageRegion')
        }],
        [{
          title: i18n.feedback, type: 'text', onPress: async () => navigation.navigate('SettingWetView', {
            title: i18n.feedback,
            source: { uri: 'https://m.connect.aliyun.com/?utm_source=mmenu' }
          })
        }, {
          title: i18n.help, type: 'text', onPress: () => navigation.navigate('SettingWetView', {
            title: i18n.help,
            source: { uri: 'https://m.aliyun.com/doc/index.html' }
          })
        }, {
          title: i18n.about, type: 'text', onPress: () => navigation.navigate('SettingAbout')
        }],
        [{
          title: i18n.logout, type: 'button', onPress: () => {
            dispatch(account.logoutSuccess())
          }
        }]
      ]} />
    )
  }
})

// 账号与安全
const SettingAccountScreen = connect(state => ({
  user: state.account.user,
  i18n: state.intl.messages || {}
}))(class SettingProfileScreen extends PureComponent {
  static navigationOptions = { title: '账号与安全' }

  async _changeFullName(value) {
    try {
      const resp = await Session.User.Put('v1/profile', { fullName: value })
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
    const { navigation, dispatch, user, i18n } = this.props

    return (
      <Settings producer={[
        [{
          title: i18n.my_avatar, type: 'image', value: { uri: user.avatars[user.avatars.length - 1].url }, onPress: () => navigation.navigate('ProfileChangeAvatar')
        }],[{
          title: i18n.phone, type: 'text', value: `(${user.phoneCountryCode})${user.phoneNo}`, editable: false
        }, {
          title: i18n.account, type: 'text', value: user.userId, editable: false
        }, {
          title: i18n.fullname,
          type: 'text',
          value: `${user.fullName}`,
          onPress: () => navigation.navigate('FormEditor', {
            title: '修改全名',
            editorName: 'String',
            option: {
              placeholder: i18n.pls_enter_fullname,
              value: user.fullName,
              onChangeValue:  (val) => this._changeFullName(val)
            }
          })
        }, {
          title: i18n.email,
          type: 'text',
          value: user.email || i18n.no_content,
          onPress: () => navigation.navigate('FormEditor', {
            title: '修改邮箱',
            editorName: 'String',
            option: {
              placeholder: i18n.pls_enter_email,
              value: user.email,
              onChangeValue:  (val) => this._changeEmail(val)
            }
          })
        }], [{
          title: i18n.bind_wechat, type: 'text', value: '', onPress: () => { this.props }
        },{
          title: i18n.bind_weibo, type: 'text', value: '', onPress: () => {}
        }, {
          title: i18n.bind_qq, type: 'text', value: '', onPress: () => {}
        }]
      ]} />
    )
  }
})

// 新消息通知
const SettingMessageNotificationScreen = connect(state => ({
  i18n: state.intl.messages || {}
}))(class PushNotificationScreen extends PureComponent {
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
const SettingLanguageRegionScreen = connect(state => ({
  i18n: state.intl.messages || {},
  language: state.intl.locale
}))(class SettingLanguageRegionScreen extends PureComponent {
  static navigationOptions = { title: '语言及地区' }

  languageName(language) {
    switch (language) {
    case 'zh':
      return '中文(简体)'
    case 'mas':
      return 'Bahasa Malaysia'
    case 'en':
      return 'English'
    }
  }

  render() {
    const { navigation, i18n } = this.props

    return (
      <Settings producer={[
        [{
          title: i18n.language, type: 'text', value: i18n.current_language, editable: true, onPress: () => navigation.navigate('SettingLanguageChoose')
        }, {
          title: i18n.region, type: 'text', value: '中国大陆', editable: true, onPress: () => {}
        }]
      ]} />
    )
  }
})

// 语言选择
const SettingLanguageChooseScreen = connect(state => ({
  i18n: state.intl.messages || {},
  language: state.intl.locale
}))(class SettingLanguageChooseScreen extends PureComponent {
  static navigationOptions = { title: '语言选择' }

  render() {
    const { navigation, dispatch, language, i18n } = this.props

    return (
      <Settings producer={[
        [{
          title: i18n.cn_simple, type: 'radio', value: language == 'zh', editable: false,
          onPress: () => {
            dispatch(intl.update('zh'))
            dispatch(application.showHUD)
            setTimeout(() => {
              dispatch(application.hideHUD)
              navigation.goBack()
            }, 1000);

          }
        }, {
          title: i18n.mas, type: 'radio', value: language == 'mas', editable: false,
          onPress: () => {
            dispatch(intl.update('mas'))
            navigation.goBack()
          }
        }, {
          title: i18n.en, type: 'radio', value: language == 'en', editable: false,
          onPress: () => {
            dispatch(intl.update('en'))
            navigation.goBack()
          }
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
  SettingLanguageChooseScreen,
  SettingFeedbackScreen,
  SettingHelpCenterScreen,
  SettingWetViewScreen,
  ProfileChangeAvatarScreen
}
