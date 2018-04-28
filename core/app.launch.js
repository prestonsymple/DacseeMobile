/* global store */


import React, { PureComponent } from 'react'
import { View, StatusBar, Platform, Linking, Text } from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import SplashScreen from 'rn-splash-screen'
import { addNavigationHelpers, NavigationActions } from 'react-navigation'
import { createReduxBoundAddListener } from 'react-navigation-redux-helpers'
import { IntlProvider } from 'react-intl-redux'

import SwitchNavigation from './app.routes'
import { System } from './utils'

import ModalUpdate from './modal/modal.update'
import ModalProgress from './modal/modal.progress'
import Hud from './modal/modal.hud'
import { application } from './redux/actions'

const addListener = createReduxBoundAddListener('AuthLoading')
class I18nLoadView extends PureComponent {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <SwitchNavigation 
          navigation={addNavigationHelpers({
            dispatch: this.props.dispatch,
            state: this.props.nav,
            addListener
          })}
        />
        <ModalProgress />
        <Hud />
        <ModalUpdate />        
      </View>
    )
  }
} 

export default connect(state => ({ 
  nav: state.nav,
  account_status: state.account.status
}))(class AppLaunch extends PureComponent {

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

    if (!_args || _args.length === 0) return undefined
    switch (_args[0]) {
    case 'invite': 
      this.handleInvite(_args[1], _args[2].replace('#Intent;package=com.dacsee;end', ''))
      break
    default:
      break
    }
  }

  handleInvite(userId, id) {
    if (!this.props.account_status) {
      this.props.dispatch(application.setReferrerValue(userId)) 
    } else {
      this.props.dispatch(NavigationActions.navigate(
        { 
          routeName: 'FriendsRequest', 
          params: { referrer: userId, id } 
        }
      ))
    }
  }

  render() {
    const prefix = System.Platform.Android ? 'dacsee://dacsee/' : 'dacsee://'

    // {/* TODO: 接到推送订单时，禁用自动升级 */}
    return (
      <IntlProvider textComponent={Text}>
        <I18nLoadView {...this.props} />
      </IntlProvider>
    )
  }

})