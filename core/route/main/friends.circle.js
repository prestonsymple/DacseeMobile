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
      title: '朋友圈'
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

    await new Promise(resolve => setTimeout(() => resolve(), 1000))
    this.setState({
      dataSource: dataContrast.cloneWithRows([
        { name: 'Vito', role: 'Driver', image: { uri: 'https://hbimg.b0.upaiyun.com/42c4da5880d187c52d5b5f4ed96fd13de57d48d1126e3-NxtDwz_fw658' } },
        { name: 'San', role: 'Passenger', image: { uri: 'https://hbimg.b0.upaiyun.com/1bce054ced7a13eb4eff8218f7a6b36c554b9b3125617-19o1EY_fw658' } },
        { name: 'Chim', role: 'Passenger', image: { uri: 'https://hbimg.b0.upaiyun.com/a476c4d19408c077bd6f0985827772ff6ebb677314bec-UNqdPS_fw658' } },
        { name: 'Jacky', role: 'Passenger', image: { uri: 'https://hbimg.b0.upaiyun.com/bb5c6a527ba21dcad49bf515a1f851d294809a0917064-rkFyzP_fw658' } },
      ])
    })
  }

  omponentWillUnmount() {
    this.subscription && this.subscription.remove()
  }

  render() {
    const { dataSource } = this.state

    return (
      <View style={{ flex: 1 }}>
        <HeaderSearchBar />
        <ListView
          refreshControl={
            <RefreshControl
              refreshing={this.state.loading}
              onRefresh={async () => {
                this.setState({ loading: true })
                await new Promise(resolve => setTimeout(() => resolve(), 1500))
                this.setState({ loading: false })
              }}
              title={'下拉进行刷新'}
              colors={['#ffffff']}
              progressBackgroundColor={'#1c99fb'}
            />
          }
          enableEmptySections={true}
          dataSource={dataSource}
          renderRow={(data) => <ItemPerson data={data} />}
          renderSeparator={() => (
            <View style={{ height: 1, backgroundColor: '#f2f2f2' }} />
          )}
        />
      </View>
    )
  }
}

class HeaderSearchBar extends Component {
  render() {
    return (
      <View style={{ height: 48, width, backgroundColor: '#f2f2f2', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ marginHorizontal: 15, paddingHorizontal: 15, backgroundColor: 'white', borderRadius: 17, alignItems: 'center' }}>
          <TextInput placeholder={'请输入姓名快速查询'} style={{ height: 34, width: width - 45 }} />
        </View>
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