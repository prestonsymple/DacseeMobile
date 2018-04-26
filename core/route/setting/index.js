// @flow
import React, { PureComponent} from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'

import Settings from './settings'
import SettingAboutScreen from './setting.about'
import SettingFeedbackScreen from './setting.feedback'
import SettingHelpCenterScreen from './setting.help.center'
import SettingWetViewScreen from './setting.web.view'
import SettingQrCodeScreen from './setting.qrcode'

import ProfileChangeAvatarScreen from './profile.change.avatars'
import BankDetailScreen from './bank.details'
import {Icons, Session} from '../../utils'

import {
  account, application, intl
} from '../../redux/actions'
import {DeviceEventEmitter} from 'react-native'

// 主菜单
const SettingMenuScreen = connect(state => ({
  i18n: state.intl.messages || {}
}))(class SettingScreen extends PureComponent {
  // static navigationOptions = { title: '设置' }
  static navigationOptions = ({ navigation }) => {
    const reducer = global.store.getState()
    return {
      title: reducer.intl.messages.settings,
    }
  }
  render() {
    const { navigation, dispatch, i18n } = this.props

    return (
      <Settings producer={[
        [{
          title: i18n.profile, type: 'text', onPress: () => navigation.navigate('SettingAccount')
        }, {
          title: i18n.privacy_setting, type: 'text', onPress: () => navigation.navigate('SettingPrivate')
        }],
        [{
          title: i18n.language_region, type: 'text', onPress: () => navigation.navigate('SettingLanguageRegion', {
            refresh: () => this.props.navigation.setParams({})
          })
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
          title: i18n.about, type: 'text', onPress: () => navigation.navigate('SettingAbout',{
            i18n
          })
        }],
        [{
          title: i18n.logout, type: 'button', onPress: () => {
            dispatch(account.asyncLogout())
          }
        }]
      ]} />
    )
  }
})

// 账号与安全
const SettingAccountScreen = connect(state => ({
  user: state.account.user,
  i18n: state.intl.messages || {},
  wallet: state.wallet
}))(class SettingProfileScreen extends PureComponent {
  static navigationOptions = ({ navigation }) => {const reducer = global.store.getState()
    return {
      title: reducer.intl.messages.profile,
    }
  }
  async _changeFullName(value) {
    try {
      const resp = await Session.User.Put('v1/profile', { fullName: value })
      this.props.dispatch(account.setAccountValue({
        user: Object.assign({}, this.props.user, { fullName: resp.fullName })
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

  async _updateBankInfo() {
    try {
      const {i18n,user} = this.props
      const {bankInfo} =user  //原始数据源
      const {bank_info} =this.props.wallet //修改后的数据集合
      let info={}
      if(bankInfo != null) {
        /* 用户有添加过卡的情况 */
        if(!bank_info.name && !bank_info.accountNo && !bank_info.accountHolderName) return true //用户无修改数据
        info=Object.assign({},bankInfo,bank_info)
      }else{
        /* 用户没有添加过卡的情况 */
        if( !bank_info.name || bank_info.name.length===0) return this.props.dispatch(application.showMessage(i18n.empty_bank_name))
        if( !bank_info.accountNo || bank_info.accountNo.length===0) return this.props.dispatch(application.showMessage(i18n.empty_bank_account))
        if( !bank_info.accountHolderName || bank_info.accountHolderName.length===0) return this.props.dispatch(application.showMessage(i18n.empty_holder_name))
        info=bank_info
      }
      const data = await Session.User.Put('v1/profile/bankInfo', { ...info })
      this.props.dispatch(account.setAccountValue({
        user: Object.assign({}, this.props.user, { bankInfo: data.bankInfo })
      }))
      this.props.dispatch(application.showMessage(bankInfo != null?i18n.update_bank_info_succ:i18n.add_bank_info_succ))
    } catch (e) {
      this.props.dispatch(application.showMessage('网络状况差，请稍后再试'))
    }
  }


  render() {
    const { navigation, dispatch, user, i18n } = this.props
    const {avatars= [{ url: 'https://storage.googleapis.com/dacsee-service-user/_shared/default-profile.jpg' }]}=user
    return (
      <Settings producer={[
        [{
          title: i18n.my_avatar, type: 'image', value: { uri: avatars[avatars.length - 1].url }, onPress: () => navigation.navigate('ProfileChangeAvatar',{i18n})
        }],[{
          title: i18n.phone, type: 'text', value: `(${user.phoneCountryCode})${user.phoneNo}`, editable: false
        }, {
          title: i18n.account, type: 'text', value: user.userId, editable: false
        }, {
          title: i18n.fullname,
          type: 'text',
          value: `${user.fullName}`,
          onPress: () => navigation.navigate('FormEditor', {
            title: i18n.update_fullname,
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
            title: i18n.update_email,
            editorName: 'String',
            option: {
              placeholder: i18n.pls_enter_email,
              value: user.email,
              onChangeValue:  (val) => this._changeEmail(val)
            }
          })
        },{
          title: i18n.bank_detail,
          type: 'text',
          onPress: () => navigation.navigate('BankDetail', {
            title: i18n.bank_detail,
            editorName: 'String',
            option: {
              onsubmit:()=> this._updateBankInfo()
            }
          })
        },{
          title: i18n.my_qr_code,
          type: 'icon',
          value: Icons.Generator.Awesome('qrcode', 25, '#bbb'),
          editable: false,
          onPress: () => navigation.navigate('SettingQrCode', {
            title: i18n.my_qr_code,
            editorName: 'String',
            option: {
              userId: user.userId,
              id: user._id,
            }
          })
        }]
        // , [{
        //   title: i18n.bind_wechat, type: 'text', value: '', onPress: () => { this.props }
        // },{
        //   title: i18n.bind_weibo, type: 'text', value: '', onPress: () => {}
        // }, {
        //   title: i18n.bind_qq, type: 'text', value: '', onPress: () => {}
        // }]
      ]} />
    )
  }
})

// 新消息通知
const SettingMessageNotificationScreen = connect(state => ({
  i18n: state.intl.messages || {}
}))(class PushNotificationScreen extends PureComponent {
  // static navigationOptions = { title: '新消息通知' }
  static navigationOptions = ({ navigation }) => {
    const reducer = global.store.getState()
    return {
      title: reducer.intl.messages.new_message_notification,
    }
  }
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

// 隐私设置
const SettingPrivateScreen = connect(state => ({
  i18n: state.intl.messages || {}
}))(class PushNotificationScreen extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    const reducer = global.store.getState()
    return {
      title: reducer.intl.messages.privacy_setting,
    }
  }
  render() {
    const { i18n } = this.props
    return (
      <Settings producer={[
        [{
          title: i18n.allow_request_from_driver, type: 'switch', value: false, editable: false, onPress: () => {}
        }, {
          title: i18n.allow_search_by_phone, type: 'switch', value: false, editable: false, onPress: () => {}
        }, {
          title: i18n.allow_search_by_email, type: 'switch', value: false, editable: false, onPress: () => {}
        }, {
          title: i18n.allow_search_by_name, type: 'switch', value: false, editable: false, onPress: () => {}
        }]
      ]} />
    )
  }
})

// 语言和地区
const SettingLanguageRegionScreen = connect(state => ({
  i18n: state.intl.messages || {},
  language: state.account.language
}))(class SettingLanguageRegionScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const reducer = global.store.getState()
    return {
      title: reducer.intl.messages.language_region,
    }
  }
  componentWillUnmount() {
    this.props.navigation.state.params.refresh()
  }
  render() {
    const { navigation, i18n } = this.props

    return (
      <Settings producer={[
        [{
          title: i18n.language, type: 'text', value: i18n.current_language, editable: true, onPress: () => navigation.navigate('SettingLanguageChoose', {
            refresh: (data)=>{
              this.props.navigation.setParams({})
            }
          })
        }
        // , {
        //   title: i18n.region, type: 'text', value: '中国大陆', editable: true, onPress: () => {}
        // }
        ]
      ]} />
    )
  }
})

// 语言选择
const SettingLanguageChooseScreen = connect(state => ({
  i18n: state.intl.messages || {},
  language: state.account.language
}))(class SettingLanguageChooseScreen extends PureComponent {
  // static navigationOptions = { title: '语言选择' }
  static navigationOptions = ({ navigation }) => {
    const reducer = global.store.getState()
    return {
      title: reducer.intl.messages.language_select,
    }
  }
  render() {
    const { navigation, dispatch, language, i18n } = this.props

    const { refresh }  = navigation.state.params


    return (
      <Settings producer={[
        [{
          title: i18n.cn_simple, type: 'radio', value: language === 'zh-CN', editable: false,
          onPress: () => {
            dispatch(account.setAccountValue({ language: 'zh-CN' }))
            dispatch(intl.update('zh-CN'))
            refresh('refresh')
            navigation.goBack()
          }
        }, {
          title: i18n.mas, type: 'radio', value: language === 'mas', editable: false,
          onPress: () => {
            dispatch(account.setAccountValue({ language: 'mas' }))
            dispatch(intl.update('mas'))
            refresh('refresh')
            navigation.goBack()
          }
        }, {
          title: i18n.en, type: 'radio', value: language === 'en-US', editable: false,
          onPress: () => {
            dispatch(account.setAccountValue({ language: 'en-US' }))
            dispatch(intl.update('en-US'))
            refresh('refresh')
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
  ProfileChangeAvatarScreen,
  SettingPrivateScreen,
  BankDetailScreen,
  SettingQrCodeScreen
}
