/* global store */

import React, { Component } from 'react'
import { View, StatusBar, Platform, Linking, Text } from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import SplashScreen from 'rn-splash-screen'
import { addNavigationHelpers, NavigationActions } from 'react-navigation'
import { createReduxBoundAddListener } from 'react-navigation-redux-helpers'

import SwitchNavigation from './app.routes'
import { System } from './utils'

import ModalUpdate from './modal/modal.update'
import ModalProgress from './modal/modal.progress'
import ModalBookingOrderDetail from './modal/modal.booking.order.detail'
import ModalBookingAcceptJobs from './modal/modal.booking.accept.jobs'
import Hud from './modal/modal.hud'
import { application } from './redux/actions'
import DeviceInfo from 'react-native-device-info'
import { addLocaleData, IntlProvider, FormattedMessage } from 'react-intl'

import languages from './localization'
import en from 'react-intl/locale-data/en'
import zh from 'react-intl/locale-data/zh'
import mas from 'react-intl/locale-data/mas'

const messages = {}
messages['en'] = languages.en_US
messages['zh'] = languages.zh_CN
messages['mas'] = languages.mas

addLocaleData([...en, ...zh, ...mas])

const addListener = createReduxBoundAddListener('AuthLoading');

export default connect(state => {
  return {
    application: state.application,
    config: state.config,
    account: state.account,
    nav: state.nav,
    store: state.storage
  }
})(class AppLaunch extends Component {

  static propTypes = {
    dispatch: PropTypes.func,

    homeNav: PropTypes.object,
    loginNav: PropTypes.object,

    account: PropTypes.object,
    application: PropTypes.object
  }

  constructor(props) {
    super(props)
  }

  // componentWillReceiveProps(props) {
  //   if (this.props.account.status !== props.account.status) {
  //     this.props.navigation
  //   }
  // }

  componentDidMount() {
    Linking.addEventListener('url', event => this.handleOpenURL(event.url))
    Linking.getInitialURL().then(url => url && this.handleOpenURL(url))

    SplashScreen.hide()
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleOpenURL)
  }

  handleOpenURL(url) {
    const _url = System.Platform.Android ? url.replace('dacsee://dacsee/', '') : url.replace('dacsee://', '')
    const _args = _url.split('/')

    if (!_args || _args.length === 0) return undefined;
    switch (_args[0]) {
    case 'invite': 
      this.handleInvite(_args[1], _args[2])
      break;
    default:
      break;
    }
  }

  handleInvite(userId, id) {
    if (!this.props.account.status) {
      this.props.dispatch(application.setReferrerValue(userId)) 
    } else {
      this.props.dispatch(NavigationActions.navigate({ routeName: 'FriendsRequest', params: { referrer: userId, id } }))
    }
  }

  chooseLocale() {
    console.log('[Locale Language]', DeviceInfo.getDeviceLocale())
    switch (DeviceInfo.getDeviceLocale()) {
    case 'en', 'en-US':
      return 'en'
    case 'zh', 'zh-CN', 'zh-Hans-CN':
      return 'zh'
    case 'mas':
      return 'mas'
    default:
      return 'en'
    }
  }

  render() {
    console.log(this.props)
    const { account, application, config, store } = this.props
    const prefix = System.Platform.Android ? 'dacsee://dacsee/' : 'dacsee://'
    const defaultLanguage = this.chooseLocale()
    // {/* TODO: 接到推送订单时，禁用自动升级 */}
    return (
      <IntlProvider locale={defaultLanguage} messages={messages[store.language] === undefined ? messages[defaultLanguage] : messages[store.language]} textComponent={Text}>
        <View style={{ flex: 1 }}>
          <SwitchNavigation 
            // uriPrefix={prefix}
            navigation={addNavigationHelpers({
              dispatch: this.props.dispatch,
              state: this.props.nav,
              addListener,
            })}
          />
          <ModalBookingOrderDetail />
          <ModalBookingAcceptJobs />
          <ModalProgress />
          <Hud />
          <ModalUpdate />        
        </View>
      </IntlProvider>
    )
  }

})