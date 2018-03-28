/* global store */
/*eslint no-unused-vars: [0, { "vars": "intl" }]*/

import React, { PureComponent } from 'react'
import { View, StatusBar, Platform, Linking, Text } from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import SplashScreen from 'rn-splash-screen'
import { addNavigationHelpers, NavigationActions } from 'react-navigation'
import { createReduxBoundAddListener } from 'react-navigation-redux-helpers'
import intl from 'intl'
import { IntlProvider } from 'react-intl-redux'

import SwitchNavigation from './app.routes'
import { System } from './utils'

import ModalUpdate from './modal/modal.update'
import ModalProgress from './modal/modal.progress'
import ModalBookingOrderDetail from './modal/modal.booking.order.detail'
import ModalBookingAcceptJobs from './modal/modal.booking.accept.jobs'
import Hud from './modal/modal.hud'
import { application } from './redux/actions'
import i18n from './i18n'

const addListener = createReduxBoundAddListener('AuthLoading');

export default connect(state => ({ nav: state.nav }))(class AppLaunch extends PureComponent {

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

  render() {
    const prefix = System.Platform.Android ? 'dacsee://dacsee/' : 'dacsee://'
    // const defaultLanguage = localization.chooseLocale()
    // const messages = localization.messages[store.language] === undefined ? 
    //   localization.messages[defaultLanguage] : 
    //   localization.messages[store.language]

    // console.log(messages)
    // {/* TODO: 接到推送订单时，禁用自动升级 */}
    return (
      <IntlProvider textComponent={Text}>
        <View style={{ flex: 1 }}>
          <SwitchNavigation 
            // uriPrefix={prefix}
            navigation={addNavigationHelpers({
              dispatch: this.props.dispatch,
              state: this.props.nav,
              addListener
            })}
          />
          {/* <ModalBookingOrderDetail />
          <ModalBookingAcceptJobs /> */}
          <ModalProgress />
          <Hud />
          <ModalUpdate />        
        </View>
      </IntlProvider>
    )
  }

})