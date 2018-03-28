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
import { booking } from '../../redux/actions'
import { Search } from '../../native/AMap'
import { System, Icons, Screen, Define, Session } from '../../utils'
import { Button } from '../../components'
import { BOOKING_STATUS } from '../main'
/*****************************************************************************************************/

const dataContrast = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

export default connect(state => ({ 
  location: state.account.location,
  i18n: state.intl.messages
}))(class SelectAddressModal extends Component {

  constructor(props) {
    super(props)
    this.state = {
      source: dataContrast.cloneWithRows([])
    }
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
  }

  onEnterKeywords(keywords) {
    try {
      this.timer && clearTimeout(this.timer)
      this.timer = setTimeout(async () => {
        if (keywords.length === 0) return this.setState({ source: dataContrast.cloneWithRows([]) })
        try {
          const { lat, lng } = this.props.location
          const city = await Session.Lookup_CN.Get(`v1/map/search/city/${lat},${lng}`)
          const { data } = await Session.Lookup_CN.Get(`v1/map/search/address/${city.data}/${keywords}`)
          this.setState({ source: dataContrast.cloneWithRows(data) })
        } catch (e) {
          console.log(e)
        }
      }, 350)
    } catch (e) {
      // nothing
    }
  }

  render() {
    const { type } = this.props.navigation.state.params
    const { source } = this.state
    const onPressCancel = () => this.props.navigation.goBack()
    const onChangeWords = (words) => this.onEnterKeywords(words)
    const { i18n } = this.props
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <StatusBar animated={true} hidden={false} backgroundColor={'white'} barStyle={'dark-content'} />
        {/* NavBar */}
        <View style={{ paddingTop: Define.system.ios.x ? 22 : 0 }}>
          <View style={{ height: Platform.select({ ios: 64, android: 44 }), backgroundColor: 'white', justifyContent: 'flex-end' }}>
            <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', height: 44 }}>
              <View style={{ flex: 1, paddingHorizontal: 12 }}>
                <TextInput 
                  {...Define.TextInputArgs} 
                  onChangeText={onChangeWords} 
                  placeholder={i18n.please_enter_keywords} 
                  style={[
                    { height: 44, fontWeight: '400', fontSize: 15, color: '#666' }
                  ]
                } />
              </View>
              <View style={{ height: 22, width: 1, backgroundColor: '#e2e2e2' }} />
              <View style={{ width: 70 }}>
                <Button onPress={onPressCancel} style={{ justifyContent: 'center', height: 44 }}>
                  <Text style={{ fontWeight: '400', fontSize: 15, color: '#888' }}>{i18n.cancel}</Text>
                </Button>
              </View>
            </View>
          </View>
          <View style={{ height: .8, backgroundColor: '#e2e2e2' }} />
        </View>

        {/* List */}
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <ListView
            enableEmptySections={true}
            dataSource={source}
            renderRow={(rowData) => <PickAddressRowItem onPress={() => {
              this.props.dispatch(booking.passengerSetValue({ [type]: rowData }))
              this.props.dispatch(booking.passengerSetStatus(BOOKING_STATUS.PASSGENER_BOOKING_PICKED_ADDRESS))
              this.props.navigation.goBack()
            }} data={rowData} />}
            renderSeparator={() => <View style={{ marginLeft: 15, borderColor: '#eee', borderBottomWidth: 0.8 }} />}
            style={{ flex: 1, borderRadius: 4 }}
          />
        </View>
      </View>
    )
  }
})

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