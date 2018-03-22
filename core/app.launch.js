/* global store */

import React, { Component } from 'react'
import { View, StatusBar, Platform, Linking } from 'react-native'
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

const addListener = createReduxBoundAddListener('AuthLoading');

export default connect(state => {
  return {
    application: state.application,
    config: state.config,
    account: state.account,
    nav: state.nav
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

  render() {
    const { account, application, config } = this.props
    const prefix = System.Platform.Android ? 'dacsee://dacsee/' : 'dacsee://'

    // {/* TODO: 接到推送订单时，禁用自动升级 */}
    return (
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
        <ModalUpdate />
        <Hud />
      </View>
    )
  }

})