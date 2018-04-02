import React, { Component, PureComponent } from 'react'
import { Text, View, Animated, StyleSheet, StatusBar, Image,
  TouchableOpacity, TouchableHighlight, DeviceEventEmitter, TextInput,
  ScrollView, Platform, FlatList, ListView } from 'react-native'
import InteractionManager from 'InteractionManager'
import { NavigationActions, SafeAreaView } from 'react-navigation'

import { Screen, Icons, Redux, Define,TextFont } from '../../utils'
import resources from '../../resources'
import { application as app, account } from '../../redux/actions'
import { FormattedMessage } from 'react-intl';

const { width, height } = Screen.window


const dataContrast = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

export default class PickerCountryComponent extends Component {

  static navigationOptions = { header: null }

  constructor(props) {
    super(props)
    this.state = {
      source: dataContrast.cloneWithRows([])
    }
  }

  async componentDidMount() {
    this.setState({
      source: dataContrast.cloneWithRows([{
        key: '2',
        name: 'malaysia',
        code: '+60'
      }, {
        key: '1',
        name: 'china',
        code: '+86'
      }, {
        key: '3',
        name: 'southkorea',
        code: '+82'
      }, {
        key: '4',
        name: 'japan',
        code: '+81'
      }])
    })
  }
  componentWillUnmount() {}


  render() {
    const {
      onPress = () => {}
    } = this.props.navigation.state.params

    return Platform.select({
      android: (
        <View style={{ flex: 1 }}>
          <View style={{ height: 54, backgroundColor: '#f2f2f2', borderBottomWidth: .8, borderColor: '#ccc', justifyContent: 'flex-end' }}>
            <View style={{ height: 54, flexDirection: 'row' }}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={{ width: 54, paddingLeft: 8, justifyContent: 'center', alignItems: 'flex-start' }}
                onPress={() => this.props.navigation.goBack()}
              >
                { Icons.Generator.Material('keyboard-arrow-left', 30, '#2f2f2f') }
              </TouchableOpacity>
              <FormattedMessage id={'choose_country'}>
                {
                  msg => (
                    <TextInput
                      placeholder={msg}
                      style={{ height: 54, flex: 1 }}
                    />
                  )
                }
              </FormattedMessage>

            </View>
          </View>
          <View style={{ flex: 1 }}>
            <ListView
              style={{ backgroundColor: '#f8f8f8' }}
              enableEmptySections={true}
              dataSource={this.state.source}
              renderSeparator={() => (
                <View style={{ height: .8, backgroundColor: '#eee' }}></View>
              )}
              renderRow={(row) => (
                <TouchableOpacity activeOpacity={.7} onPress={() => {
                  onPress(row)
                  this.props.navigation.goBack()
                }} style={{ flex: 1, height: 52, justifyContent: 'center', backgroundColor: 'white' }}>
                  <View style={{ flexDirection: 'row', paddingHorizontal: 15, alignItems: 'center' }}>
                    <Text style={{ color: '#333', fontSize: TextFont.TextSize(16), fontWeight: '600' }}>{ row.name }</Text>
                    <Text style={{ color: '#333', fontSize: TextFont.TextSize(16), fontWeight: '600' }}> ({ row.code })</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      ),
      ios: (
        <View style={{ flex: 1 }}>
          <StatusBar animated={true} hidden={false} backgroundColor={'white'} barStyle={'dark-content'} />
          <View style={{ height: Define.system.ios.x ? 88 : 64, backgroundColor: '#f2f2f2', borderBottomWidth: .8, borderColor: '#ccc', justifyContent: 'flex-end' }}>
            <View style={{ height: 44, flexDirection: 'row' }}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={{ width: 54, paddingLeft: 8, justifyContent: 'center', alignItems: 'flex-start' }}
                onPress={() => this.props.navigation.goBack()}
              >
                { Icons.Generator.Material('keyboard-arrow-left', 30, '#2f2f2f') }
              </TouchableOpacity>
              <FormattedMessage id={'choose_country'}>
                {
                  msg => (
                    <TextInput
                      placeholder={msg}
                      style={{ height: 44, flex: 1 }}
                    />)
                }
              </FormattedMessage>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <ListView
              style={{ backgroundColor: '#f8f8f8' }}
              enableEmptySections={true}
              dataSource={this.state.source}
              renderSeparator={() => (
                <View style={{ height: .8, backgroundColor: '#eee' }}></View>
              )}
              renderRow={(row) => (
                <TouchableOpacity activeOpacity={.7} onPress={() => {
                  onPress(row)
                  this.props.navigation.goBack()
                }} style={{ flex: 1, height: 52, justifyContent: 'center', backgroundColor: 'white' }}>
                  <View style={{ flexDirection: 'row', paddingHorizontal: 15, alignItems: 'center' }}>
                    <Text style={{ color: '#333', fontSize: TextFont.TextSize(16), fontWeight: '600' }}>
                      <FormattedMessage id={ row.name } />
                    </Text>
                    <Text style={{ color: '#333', fontSize: TextFont.TextSize(16), fontWeight: '600' }}> ({ row.code })</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      )
    })
  }
}

const styles = StyleSheet.create({
})
