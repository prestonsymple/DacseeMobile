// @flow
import React from 'react'
// import PropTypes from 'prop-types'
// import lodash from 'lodash'

import Settings from './settings'
import SettingAboutScreen from './setting.about'
import SettingFeedbackScreen from './setting.feedback'
import SettingHelpCenterScreen from './setting.help.center'
import SettingWetViewScreen from './setting.web.view'

import {
  account
} from '../../redux/actions'


const createTemplate = (title: string, producer, navigationOptions?: Object) => {
  const clone = React.createFactory(Settings)
  clone.defaultProps = { producer }
  clone.navigationOptions = () => {
    return Object.assign({}, {
      drawerLockMode: 'locked-closed', title
    }, navigationOptions)
  }
  return clone
}

// 主菜单
const SettingMenuScreen = createTemplate('设置', ({ navigation, dispatch }) => [
  [{
    title: '账号与安全', type: 'text', onPress: () => navigation.navigate('SettingAccount')
  }],
  [{
    title: '新消息通知', type: 'text', onPress: () => navigation.navigate('SettingMessageNotification')
  }, {
    title: '语言和地区', type: 'text', onPress: () => navigation.navigate('SettingLanguageRegion')
  }],
  [{
    title: '意见反馈', type: 'text', onPress: async () => navigation.navigate('SettingFeedback')
  }, {
    title: '帮助中心', type: 'text', onPress: () => navigation.navigate('SettingHelpCenter')
  }, {
    title: '关于', type: 'text', onPress: () => navigation.navigate('SettingAbout')
  }],
  [{
    title: '切换账号', type: 'button', onPress: () => dispatch(account.accountEnterLogout())
  }]
])


// 账号与安全
const SettingAccountScreen = createTemplate('账号与安全', () => ([
  [{
    title: '手机号', type: 'text', value: '(+86) 176211269696', onPress: () => {}
  }, {
    title: '邮箱账号', type: 'text', value: '尚未绑定', onPress: () => {}
  }]
]))

// 新消息通知
const SettingMessageNotificationScreen = createTemplate('新消息通知', () => ([
  [{
    title: '允许推送消息', type: 'switch', value: false, editable: false, onPress: () => {}
  }]
]))

// 语言和地区
const SettingLanguageRegionScreen = createTemplate('语言和地区', () => ([
  [{
    title: '语言', type: 'text', value: '中文(简体)', editable: true, onPress: () => {}
  }, {
    title: '地区', type: 'text', value: '中国大陆', editable: true, onPress: () => {}
  }]
]))

export {
  SettingMenuScreen,
  SettingAboutScreen,
  SettingAccountScreen,
  SettingMessageNotificationScreen,
  SettingLanguageRegionScreen,
  SettingFeedbackScreen,
  SettingHelpCenterScreen,
  SettingWetViewScreen
}