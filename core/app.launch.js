import React, { Component, PureComponent } from 'react'
import { Text, View, Animated, StyleSheet, StatusBar, Image } from 'react-native'
import { connect } from 'react-redux'
import InteractionManager from 'InteractionManager'
import { NavigationActions, addNavigationHelpers } from 'react-navigation'

import { AppNavigator } from './app.routes'

import ModalUpdate from './modal/modal.update'

export default connect(state => {
  return {
    application: state.application,
    nav: state.nav
  }
})
(class AppLaunch extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    const { status_bar_style, status_bar_hidden } = this.props.application

    return (
      <View style={{ flex: 1 }}>
        <StatusBar animated={true} hidden={status_bar_hidden} />
        <AppNavigator 
          navigation={
            addNavigationHelpers({ dispatch: this.props.dispatch, state: this.props.nav })
          } 
        />
        <ModalUpdate />
      </View>
    )
  }

})