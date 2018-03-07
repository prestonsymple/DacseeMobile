
import React, { Component, PureComponent } from 'react'
import { 
  Text, View, Animated, StyleSheet, StatusBar, Image, TouchableOpacity, TouchableHighlight, 
  DeviceEventEmitter, TextInput, Easing, ListView, ScrollView
} from 'react-native'
import InteractionManager from 'InteractionManager'
import { NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'

import { Screen, Icons, Redux, Define, System, Session } from '../../utils'
import { Button } from '../../components'
import Resources from '../../resources'
import { application, booking } from '../../redux/actions'

const { height, width } = Screen.window

const styles = StyleSheet.create({
  pageWrap: { width: width, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white' },
  itemWrap: { alignItems: 'center', justifyContent: 'center' },
  itemTitle: { color: '#666', fontSize: 14, fontWeight: '100', marginBottom: 8 },
  itemImageContent: { marginHorizontal: 6, width: 68, height: 68, borderRadius: 33, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderWidth: 3 },
  itemImage: { opacity: 0.7, width: 66, height: 66, borderRadius: 33, borderWidth: 1.5, borderColor: 'white', resizeMode: 'cover' }
})

// TODO: Optimize the callback
const dataContrast = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

const DEMO_DATA = [
  {
    type: 'DS-MY',
    name: 'DACSEED WALLET',
    country: 'MALAYSIA',
    countryFlag: 'https://storage.googleapis.com/dacsee-service-wallet/_shared/flag-MY.jpg',
    availableAmount: 95,
    floatingDriverAmount: 20,
    floatingPassengerAmount: 10
  },
  {
    type: 'DSA-MY',
    name: 'DACSEED AGENT WALLET',
    country: 'MALAYSIA',
    countryFlag: 'https://storage.googleapis.com/dacsee-service-wallet/_shared/flag-MY.jpg',
    availableAmount: 1000
  }
]

// export default connect(state => ({ data: state.booking })) // TEST
export default connect(state => ({ data: state.booking }))(class WalletBalanceScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      drawerLockMode: 'locked-closed', 
      title: '钱包'
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      detail: dataContrast.cloneWithRows(DEMO_DATA)
    }
  }

  async componentDidMount() {
    await InteractionManager.runAfterInteractions()

    const resp = await Session.wallet.get('v1/wallets')
    // [{
    //   _id: '0d8f4330-1dac-11e8-b67d-91aeb57f5e5b',
    //   amount: 101,
    //   status: 'active',
    //   subType: 'standard',
    // }]

    console.log('[参数]', resp.data[0]._id)
    const wallet = await Session.wallet.get(`v1/transactions?batch_id=${resp.data[0]._id}`)
    // {{url_wallet}}/api/
  }

  render() {
    const { detail } = this.state
    const wrapWidth = width    

    return (
      <View style={{ backgroundColor: '#f8f8f8', flex: 1 }}>
        <ListView 
          dataSource={detail}
          enableEmptySections={true}
          renderRow={(row) => <TouchableOpacity onPress={() => this.props.navigation.navigate('WalletDetail', { walletInfo: row })}><ListItem data={row} /></TouchableOpacity>}
          // renderSeparator={() => <View style={{ height: 2, backgroundColor: '#f2f2f2' }} />}
          style={{ flex: 1, height: 30, marginTop: 15 }}
        />
      </View>
    )
  }
})

class ListItem extends Component {
  render() {
    const { data } = this.props
    const { type, name, country, countryFlag, availableAmount, floatingDriverAmount, floatingPassengerAmount } = data
    return (
      <View style={{ marginBottom: 15, width, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <View style={[
          { width: width - 30, borderRadius: 6, backgroundColor: 'white' },
          { shadowOffset: { width: 0, height: 0 }, shadowColor: '#a2a3a8', shadowOpacity: .5, shadowRadius: 3 },
          {  }
        ]}>

          <View style={{ flex: 1, flexDirection: 'column', height: 106 }}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <Image style={{ backgroundColor: '#4cb1f7', marginLeft: 15, width: 66, height: 66, borderRadius: 33}}
                source={{ uri: countryFlag }}/>
              <View style={{ marginLeft: 10, justifyContent: 'center'}}>
                <Text style={{ fontSize: 13 }}>{ country }</Text>
                <Text style={{ fontSize: 11, color: '#a5a5a5' }}>{ name }</Text>
              </View>
              <View style={{ flex: 1, marginRight: 15, justifyContent: 'center', alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 11, color: '#a5a5a5' }}>AVAILABLE BALANCE</Text>
                <View style={{ flexDirection: 'row'}}>
                  <Text style={{ fontSize: 15, marginTop: 12}}>RM</Text>
                  <Text style={{ fontSize: 27}}>{ availableAmount.toFixed(2) }</Text>
                </View>
              </View>
            </View>
            <View style={{ backgroundColor: '#D8D8D8', opacity: 0.5, height: 1}}></View>
          </View>
          {
            type.indexOf('DSA') >= 0 ? 
              null : 
              <View style={{ backgroundColor: 'white', width: width - 30, marginTop: 1, borderRadius: 6, flexDirection: 'column', height: 100}}>            
                <View style={{ flex: 1, paddingLeft:15, paddingTop: 10}}>
                  <Text style={{ fontSize: 11, color: '#a5a5a5' }}>Floating Balance (Passenger)</Text>
                  <Text style={{ fontSize: 13 }}>RM { floatingPassengerAmount.toFixed(2) }</Text>
                </View>
                <View style={{ flex: 1, paddingLeft:15, paddingTop: 5}}>
                  <Text style={{ fontSize: 11, color: '#a5a5a5' }}>Floating Balance (Driver)</Text>
                  <Text style={{ fontSize: 13 }}>RM { floatingDriverAmount.toFixed(2) }</Text>
                </View>
              </View>                        
          }             
        </View>
      </View>
    )
  }
}