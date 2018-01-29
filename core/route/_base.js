// @flow
import React, { Component, PureComponent } from 'react'
import type { StackNavigatorConfig } from 'react-navigation'
import { Text, View, Animated, TouchableOpacity, Image, Alert, ScrollView } from 'react-native'

import {
  account,
  application
} from '../redux/actions'
import {
  Screen, Icons, Define
} from '../utils'

export default class BaseComponent extends Component {

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
