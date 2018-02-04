import React, { Component } from 'react'
import { View, StatusBar } from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { addNavigationHelpers } from 'react-navigation'

import { HomeNavigator, LoginNavigator } from './app.routes'

import ModalUpdate from './modal/modal.update'
import ModalProgress from './modal/modal.progress'

export default connect(state => {
  return {
    application: state.application,
    config: state.config,
    homeNav: state.homeNav,
    loginNav: state.loginNav,
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

  render() {
    const { account, application, config } = this.props
    const { status_bar_hidden } = application
    const { status_bar_style } = config

    return (
      <View style={{ flex: 1 }}>
        <StatusBar animated={true} hidden={status_bar_hidden} backgroundColor={status_bar_style === 'light-content' ? 'black' : 'white'} barStyle={status_bar_style} />
        {
          account.status ? 
            (<HomeNavigator 
              onNavigationStateChange={(prevState, currentState) => {
                const currentScreen = getCurrentRouteName(currentState);
                const prevScreen = getCurrentRouteName(prevState);
          
                if (prevScreen !== currentScreen) {
                  // the line below uses the Google Analytics tracker
                  // change the tracker here to use other Mobile analytics SDK.
                  tracker.trackScreenView(currentScreen);
                }
              }}
              navigation={addNavigationHelpers({ dispatch: this.props.dispatch, state: this.props.homeNav })} 
            />) :
            (<LoginNavigator 
              onNavigationStateChange={(prevState, currentState) => {
                const currentScreen = getCurrentRouteName(currentState);
                const prevScreen = getCurrentRouteName(prevState);
          
                if (prevScreen !== currentScreen) {
                  // the line below uses the Google Analytics tracker
                  // change the tracker here to use other Mobile analytics SDK.
                  tracker.trackScreenView(currentScreen);
                }
              }}
              navigation={addNavigationHelpers({ dispatch: this.props.dispatch, state: this.props.loginNav })} 
            />)
        }
        <ModalProgress />
        <ModalUpdate />
      </View>
    )
  }

})