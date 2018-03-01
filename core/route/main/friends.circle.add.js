import React, { PureComponent, Component } from 'react'
import {
  Text, View, TouchableOpacity, DeviceEventEmitter, ListView, TextInput, Image, RefreshControl
} from 'react-native'

import { } from '../../redux/actions'
import { Icons, Screen } from '../../utils'

const { width, height } = Screen.window

const dataContrast = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged: (s1, s2) => s1 !== s2 })

export default class FriendsCircleAddComponent extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      drawerLockMode: 'locked-closed',
      title: '添加好友'
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      dataSource: dataContrast.cloneWithRows([
        { describer: '使用用户ID查找', label: 'DACSEE', icon: Icons.Generator.Awesome('id-badge', 36, '#333', { style: { left: 7 } }) },
        { describer: '邀请来自微信的好友', label: '微信', icon: Icons.Generator.Awesome('weixin', 36, '#333', { style: { left: 0 } }) },
        { describer: '授权获取微博好友列表', label: '微博', icon: Icons.Generator.Awesome('weibo', 36, '#333', { style: { left: 1.5 } }) },
        { describer: '从Facebook好友列表中查找', label: 'Facebook', icon: Icons.Generator.Awesome('facebook', 36, '#333', { style: { left: 8 } }) }
      ])
    }
  }

  async componentDidMount() {
  }

  render() {
    const { dataSource } = this.state

    return (
      <View style={{ flex: 1 }}>
        <ListView
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

class ItemPerson extends Component {
  render() {
    const { icon, label, describer, onPress = () => {} } = this.props.data
    return (
      <TouchableOpacity activeOpacity={.7} onPress={onPress} style={{ height: 60, backgroundColor: 'white', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', paddingHorizontal: 15 }}>
        <View style={{ justifyContent: 'center', width: 60 }}>
          {icon}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, color: '#333', fontWeight: '400', marginBottom: 2 }}>{ label }</Text>
          <Text style={{ fontSize: 13, color: '#999' }}>{ describer }</Text>
        </View>
      </TouchableOpacity>
    )
  }
}