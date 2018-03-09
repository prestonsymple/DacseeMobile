/* global store */

import React, { Component } from 'react'
import { View, StatusBar, Platform, Linking } from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import SplashScreen from 'rn-splash-screen'

import SwitchNavigation from './app.routes'
import { System } from './utils'

import ModalUpdate from './modal/modal.update'
import ModalProgress from './modal/modal.progress'
import { application } from './redux/actions'


export default connect(state => {
  return {
    application: state.application,
    config: state.config,
    account: state.account
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
    if (_args && _args.length > 0 && _args[0] === 'invite') {
      if (!this.props.account.status) this.props.dispatch(application.setReferrerValue(_args[2])) 
    }
  }

  render() {
    const { account, application, config } = this.props
    const prefix = System.Platform.Android ? 'dacsee://dacsee/' : 'dacsee://'

    return (
      <View style={{ flex: 1 }}>
        <SwitchNavigation uriPrefix={prefix} />
        <ModalProgress />
        <ModalUpdate />
      </View>
    )
  }

})