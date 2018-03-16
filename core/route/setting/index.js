// @flow
import React from 'react'
// import PropTypes from 'prop-types'
// import lodash from 'lodash'

import Settings from './settings'
import SettingAboutScreen from './setting.about'
import SettingFeedbackScreen from './setting.feedback'
import SettingHelpCenterScreen from './setting.help.center'
import SettingWetViewScreen from './setting.web.view'

import ProfileChangeAvatarScreen from './profile.change.avatars'

import { Session as session } from '../../utils'
import PushService from '../../native/push-service'

import {
  account, application
} from '../../redux/actions'


// class TemplateFactory extends Component {
//   return 

//   render() {

//     <Settings />
//   }
// }

const createTemplate = (title: string, producer, navigationOptions?: Object) => {
  const clone = React.createFactory(Settings)
  clone.defaultProps = { producer }
  clone.navigationOptions = () => {
    return Object.assign({}, {
      drawerLockMode: 'locked-closed', title,
      headerStyle: {
        backgroundColor: '#1AB2FD',
        shadowColor: 'transparent',
        shadowOpacity: 0,
        borderBottomWidth: 0,
        borderBottomColor: 'transparent',
        elevation: 0,
      }
    }, navigationOptions)
  }
  return clone
}

const testPushService = async () => {
  try {
    await session.push.post('v1/push', {
      subject: 'Balance',
      message: '5 RM',
      priority: 'high',
      sound: 'notification',
      notId: 1491559662126,
      staging: true,
      routeParams: {'id':'01001378060'},
      to: '5a77ff35e5259a40deb60872',
      dev: true
    })
  } catch (e) {
    console.log(e)
  }
}

// 主菜单
const SettingMenuScreen = createTemplate('设置', ({ navigation, dispatch }) => [
  [{
    title: '账号与安全', type: 'text', onPress: () => navigation.navigate('SettingAccount')
  }],
  [
  //   {
  //   title: '新消息通知', type: 'text', onPress: () => navigation.navigate('SettingMessageNotification')
  // }, 
  {
    title: '推送测试', type: 'text', onPress: async () => testPushService()
  }, {
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
])

// 账号与安全
const SettingAccountScreen = createTemplate('账号与安全', ({ navigation, dispatch, user }) => ([
  [{
    title: '我的头像', type: 'image', value: { uri: user.avatars[user.avatars.length - 1].url }, onPress: () => navigation.navigate('ProfileChangeAvatar')
  }],[{
    title: '手机号', type: 'text', value: `(${user.phoneCountryCode})${user.phoneNo}`, editable: false
  }, {
    title: '账号', type: 'text', value: user.userId, editable: false
  }, {
    title: '全名', type: 'text', value: `${user.fullName}`, editable: false
  }, {
    title: '邮箱账号', type: 'text', value: user.email || '尚未绑定', onPress: () => dispatch(application.showMessage('暂不支持邮箱修改'))
  }], [{
    title: '绑定至微信', type: 'text', value: '', onPress: () => { this.props }
  },{
    title: '绑定至微博', type: 'text', value: '', onPress: () => {}
  }, {
    title: '绑定至QQ', type: 'text', value: '', onPress: () => {}
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
  SettingWetViewScreen,
  ProfileChangeAvatarScreen
}