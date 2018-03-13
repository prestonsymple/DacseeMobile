/* eslint-disable */
import React, { Component, PureComponent } from 'react'
import { 
  View, TouchableOpacity, Modal, Text, Animated, Alert, AppState, TextInput, ScrollView, ListView, Platform,
  StatusBar
} from 'react-native'
import InteractionManager from 'InteractionManager'
import * as Progress from 'react-native-progress'
import CodePush from 'react-native-code-push'
import { connect } from 'react-redux'
import { NavigationActions, SafeAreaView } from 'react-navigation'

/*****************************************************************************************************/
import { System, Icons, Screen, Define } from '../utils'
import { Button } from '../components'
/*****************************************************************************************************/


export default class SelectAddressView extends Component {
  render() {
    const { onPressCancel, onSelectAddress, defaultData, data, onChangeKeywords, field } = this.props
    return (
      <Modal onRequestClose={onPressCancel} {...this.props} style={{ backgroundColor: 'white' }}>
        <StatusBar animated={true} hidden={false} backgroundColor={'white'} barStyle={'dark-content'} />
        {
          Platform.select({
            ios: (
              <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1, backgroundColor: 'white' }}>
                  {/* NavBar */}
                  <View style={[
                    { height: 44, backgroundColor: 'white' }
                  ]}>
                    <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', height: 44 }}>
                      <View style={{ flex: 1, paddingHorizontal: 12 }}>
                        <TextInput {...Define.TextInputArgs} onChangeText={keywords => onChangeKeywords(keywords)} placeholder={`Where ${field}?`} style={[
                          { height: 44, fontWeight: '400', fontSize: 15, color: '#666' }
                        ]} />
                      </View>
                      <View style={{ height: 22, width: 1, backgroundColor: '#e2e2e2' }} />
                      <View style={{ width: 70 }}>
                        <Button onPress={onPressCancel} style={{ justifyContent: 'center', height: 44 }}>
                          <Text style={{ fontWeight: '400', fontSize: 15, color: '#888' }}>Cancel</Text>
                        </Button>
                      </View>
                    </View>
                  </View>
                  <View style={{ height: .8, backgroundColor: '#e2e2e2' }} />
  
                  {/* List */}
                  <View style={{ flex: 1, marginTop: 15, backgroundColor: 'white', borderRadius: 4 }}>
                    <ListView
                      enableEmptySections={true}
                      dataSource={data || defaultData}
                      renderRow={(rowData) => <PickAddressRowItem onPress={() => onSelectAddress(rowData, field)} data={rowData} />}
                      renderSeparator={() => <View style={{ marginLeft: 15, borderColor: '#eee', borderBottomWidth: 0.8 }} />}
                      style={{ flex: 1, borderRadius: 4 }}
                    />
                  </View>
                </View>
              </SafeAreaView>
            ),
            android: (
              <View style={{ flex: 1, backgroundColor: 'white' }}>
                  {/* NavBar */}
                  <View style={[
                    { height: 44, backgroundColor: 'white' }
                  ]}>
                    <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', height: 44 }}>
                      <View style={{ flex: 1, paddingHorizontal: 12 }}>
                        <TextInput {...Define.TextInputArgs} onChangeText={keywords => onChangeKeywords(keywords)} placeholder={`Where ${field}?`} style={[
                          { height: 44, fontWeight: '400', fontSize: 15, color: '#666' }
                        ]} />
                      </View>
                      <View style={{ height: 22, width: 1, backgroundColor: '#e2e2e2' }} />
                      <View style={{ width: 70 }}>
                        <Button onPress={onPressCancel} style={{ justifyContent: 'center', height: 44 }}>
                          <Text style={{ fontWeight: '400', fontSize: 15, color: '#888' }}>Cancel</Text>
                        </Button>
                      </View>
                    </View>
                  </View>
                  <View style={{ height: .8, backgroundColor: '#e2e2e2' }} />
  
                  {/* List */}
                  <View style={{ flex: 1, marginTop: 15, backgroundColor: 'white', borderRadius: 4 }}>
                    <ListView
                      enableEmptySections={true}
                      dataSource={data || defaultData}
                      renderRow={(rowData) => <PickAddressRowItem onPress={() => onSelectAddress(rowData, field)} data={rowData} />}
                      renderSeparator={() => <View style={{ marginLeft: 15, borderColor: '#eee', borderBottomWidth: 0.8 }} />}
                      style={{ flex: 1, borderRadius: 4 }}
                    />
                  </View>
                </View>
            )
          })
        }
      </Modal>
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
            <Text style={{ color: '#666', fontSize: 15, fontWeight: '400' }}>{ name }</Text>
          </View>
        </View>
      </Button>
    )
  }
}