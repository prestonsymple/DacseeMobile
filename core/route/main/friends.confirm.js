import React, { PureComponent, Component } from 'react'
import {
  Text, View, TouchableOpacity, DeviceEventEmitter, ListView, TextInput, Image, RefreshControl
} from 'react-native'

import InteractionManager from 'InteractionManager'
import { } from '../../redux/actions'
import { Icons, Screen } from '../../utils'

const { width, height } = Screen.window

const dataContrast = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged: (s1, s2) => s1 !== s2 })

export default class FriendsCircleComponent extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      drawerLockMode: 'locked-closed',
      title: '确认邀请'
    }
  }

  constructor(props) {
    super(props)
    console.log(props)
    this.state = {
    }
  }

  async componentDidMount() {
    await InteractionManager.runAfterInteractions()
  }

  omponentWillUnmount() {
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
      </View>
    )
  }
}