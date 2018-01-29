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
    const { account, application } = this.props
    const { status_bar_style, status_bar_hidden } = application

    return (
      <View style={{ flex: 1 }}>
        <StatusBar animated={true} hidden={status_bar_hidden} barStyle={status_bar_style} />
        {
          account.status ? 
            (<HomeNavigator navigation={addNavigationHelpers({ dispatch: this.props.dispatch, state: this.props.homeNav })} />) :
            (<LoginNavigator navigation={addNavigationHelpers({ dispatch: this.props.dispatch, state: this.props.loginNav })} />)
        }
        <ModalProgress />
        <ModalUpdate />
      </View>
    )
  }

})