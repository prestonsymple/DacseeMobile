/* eslint-disable */
import React, { Component, PureComponent } from 'react'
import { View, TouchableOpacity, Modal, Text, Animated, Alert, AppState, TextInput, ScrollView, ListView } from 'react-native'
import InteractionManager from 'InteractionManager'
import * as Progress from 'react-native-progress'
import CodePush from 'react-native-code-push'
import { connect } from 'react-redux'
import { NavigationActions, SafeAreaView } from 'react-navigation'

/*****************************************************************************************************/
import { System, Icons, Screen } from '../../utils'
import { Button } from '../../components'
/*****************************************************************************************************/

const DEMO_DATA = [{
  type: 'favorite',
  address: '浦东新区xxx',
  name: '浦东国际机场 T2航站楼'
}, {
  type: 'favorite',
  address: 'xxx',
  name: '丰盛创建大厦'
}, {
  type: 'favorite',
  address: 'xxx',
  name: '虹桥机场 T1航站楼'
}, {
  type: 'history',
  address: 'xxx',
  name: 'PFCC'
}, {
  type: 'history',
  address: 'xxx',
  name: 'Limrrkokwin,Cyberjaya'
}, {
  type: 'history',
  address: 'xxx',
  name: 'Raub,Pahang'
}]

// TODO: Optimize the callback
const dataContrast = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

export default class SelectAddressView extends Component {

  constructor(props) {
    super(props)
    this.state = {
      defaultData: dataContrast.cloneWithRows(DEMO_DATA),
      data: undefined
    }
  }

  render() {
    const { defaultData, data } = this.state
    const { key } = this.props
    return (
      <View style={{ flex: 1, backgroundColor: 'transparent' }}>
        <View style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 }} />
        {/* NavBar */}
        <View style={[
          { height: 64, backgroundColor: 'white' },
          { shadowOffset: { width: 0, height: 1 }, shadowColor: '#666', shadowOpacity: .3, shadowRadius: 3 }
        ]}>
          <View style={{ top: 22, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', height: 44 }}>
            {/* <View style={{ justifyContent: 'center', width: 110, paddingHorizontal: 12 }}>
              <Text style={{ fontSize: 14, color: '#666' }}>Shanghai</Text>
            </View> */}
            {/* <View style={{ height: 22, width: 1, backgroundColor: '#f2f2f2' }} /> */}
            <View style={{ flex: 1, paddingHorizontal: 12 }}>
              <TextInput onChangeText={keywords => onChangeKeywords(keywords)} placeholder={`Where ${key}?`} style={[
                { height: 44, fontWeight: '600', fontSize: 15, color: '#666' }
              ]} />
            </View>
            <View style={{ height: 22, width: 1, backgroundColor: '#e2e2e2' }} />
            {/* <View style={{ width: 70 }}>
              <Button onPress={onPressCancel} style={{ justifyContent: 'center', height: 44 }}>
                <Text style={{ fontWeight: '600', fontSize: 15, color: '#888' }}>Cancel</Text>
              </Button>
            </View> */}
          </View>
        </View>

        {/* List */}
        <View style={[
          { height: Screen.window.height - 64 - 10, marginTop: 15, marginHorizontal: 12, backgroundColor: 'white', borderRadius: 4 },
          { shadowOffset: { width: 0, height: 2 }, shadowColor: '#666', shadowOpacity: .3, shadowRadius: 3 }
        ]}>
          <ListView
            dataSource={data || defaultData}
            renderRow={(rowData) => <PickAddressRowItem onPress={() => onSelectAddress(rowData, field)} data={rowData} />}
            renderSeparator={() => <View style={{ marginLeft: 15, borderColor: '#eee', borderBottomWidth: 0.5 }} />}
            style={{ flex: 1, borderRadius: 4 }}
          />
        </View>
      </View>
    )
  }
}

class PickAddressRowItem extends Component {
  render() {
    const { onPress } = this.props
    const { type, address, name } = this.props.data
    return (
      <Button onPress={onPress} style={{ height: 48, flex: 1, backgroundColor: 'white', alignItems: 'flex-start', paddingHorizontal: 15 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ marginRight: 15 }}>
            { type === 'favorite' && Icons.Generator.Material('star', 24, '#f3ae3d') }
            { type === 'history' && Icons.Generator.Material('history', 24, '#999') }
            { type === 'keywords' && Icons.Generator.Material('my-location', 24, '#999') }
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#666', fontSize: 15, fontWeight: '600' }}>{ name }</Text>
          </View>
        </View>
      </Button>
    )
  }
}