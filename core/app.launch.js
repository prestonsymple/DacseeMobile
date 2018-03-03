/* global store */

import React, { Component } from 'react'
import { View, StatusBar, Platform, Linking } from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import SplashScreen from 'rn-splash-screen'

import SwitchNavigation from './app.routes'
import DeepLink from './app.deep.link'


import ModalUpdate from './modal/modal.update'
import ModalProgress from './modal/modal.progress'


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
    const path = url.split(':/')[1]
    DeepLink(path)
  }

  render() {
    const { account, application, config } = this.props
    const { status_bar_hidden } = application
    const { status_bar_style } = config

    return (
      <View style={{ flex: 1 }}>
        <StatusBar animated={true} hidden={status_bar_hidden} backgroundColor={status_bar_style === 'light-content' ? 'black' : 'white'} barStyle={status_bar_style} />
        
        {/* {
          account.status ? 
            (<HomeNavigator 
              // uriPrefix={prefix}
              navigation={addNavigationHelpers({ dispatch: this.props.dispatch, state: this.props.homeNav })} 
            />) :
            (<LoginNavigator 
              // uriPrefix={prefix}
              navigation={addNavigationHelpers({ dispatch: this.props.dispatch, state: this.props.loginNav })} 
            />)
        } */}
        <SwitchNavigation />
        <ModalProgress />
        <ModalUpdate />
      </View>
    )
  }

})