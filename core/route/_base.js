// @flow
import React, { Component, PureComponent } from 'react'
import type { StackNavigatorConfig } from 'react-navigation'
import { BackHandler } from 'react-native'
import InteractionManager from 'InteractionManager'
import {
  Screen, Icons, Define
} from '../utils'

export default class BaseScreenComponent extends Component {

  async componentDidMount() {
    await InteractionManager.runAfterInteractions() 
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
  }

  onBackButtonPressAndroid = () => {
    return true
  };

  get define() {
    return Define
  }

  get screen() {
    return Screen
  }

  get icons() {
    return Icons
  }
  
}