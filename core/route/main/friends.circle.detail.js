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
      headerRight: (
        <TouchableOpacity
          activeOpacity={0.7}
          style={{ top: -0.5, width: 54, paddingRight: 20, justifyContent: 'center', alignItems: 'flex-end' }}
          onPress={() => DeviceEventEmitter.emit('NAVIGATION.EVENT.ON.PRESS.ADD.FREIENDS')}
        >
          {Icons.Generator.Material('add', 28, '#2f2f2f', { style: { left: 8 } })}
        </TouchableOpacity>
      ),
      title: '朋友详情'
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      dataSource: dataContrast.cloneWithRows([]),
      loading: false
    }
  }

  async componentDidMount() {
    await InteractionManager.runAfterInteractions()
    this.subscription = DeviceEventEmitter.addListener('NAVIGATION.EVENT.ON.PRESS.ADD.FREIENDS', () => this.props.navigation.navigate('FriendsCircleAdd'))
  }

  omponentWillUnmount() {
    this.subscription && this.subscription.remove()
  }

  render() {
    const { dataSource } = this.state

    return (
      <View style={{ flex: 1 }}>
      </View>
    )
  }
}

class ItemPerson extends Component {
  render() {
    const { name, role, image, onPress = () => {} } = this.props.data
    return (
      <TouchableOpacity activeOpacity={.7} onPress={onPress} style={{ height: 60, backgroundColor: 'white', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', paddingHorizontal: 15 }}>
        <View style={{ justifyContent: 'center', width: 60 }}>
          <Image style={{ width: 48, height: 48, borderRadius: 24 }} source={image} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, color: '#333', fontWeight: '400', marginBottom: 2 }}>{name}</Text>
          <Text style={{ fontSize: 13, color: '#999' }}>{role}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}