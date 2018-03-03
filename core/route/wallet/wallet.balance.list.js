
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
    this.state = {}
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
    const { wallet, detail } = this.state
    const wrapWidth = width

    return (
      <View style={{ backgroundColor: '#f8f8f8', flex: 1 }}>
        {/* CARD */}
        <ScrollView style={{ }} contentContainerStyle={{ paddingTop: 15 }}>
          <View style={{ marginBottom: 15, width, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <View style={[
              { width: width - 30, height: 200, borderRadius: 6, backgroundColor: '#4cb1f7' },
              { shadowOffset: { width: 0, height: 0 }, shadowColor: '#a2a3a8', shadowOpacity: .5, shadowRadius: 3 },
              {  }
            ]}>
              <View style={{ flex: 1, paddingHorizontal: 15, paddingVertical: 15 }}>
                <Text style={{ flex: 1, textAlign: 'left', color: '#000', fontWeight: '400', fontSize: 16}}>LOCAL CURRENCY</Text>
                <Text style={{ color: 'white', fontWeight: '200', fontSize: 13}}>YOUR BALANCE</Text>
                <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                  <Text style={{ color: 'white', fontWeight: System.Platform.Android ? '400' : '600', top: -3, marginRight: 10, fontSize: 22, fontFamily: 'Cochin' }}>RM</Text>
                  <Text style={{ color: 'white', fontWeight: System.Platform.Android ? '400' : '600', fontSize: 34, fontFamily: 'Cochin' }}>{ (3420.80).toFixed(2) }</Text>
                  {/* <Text style={{ color: '#333', fontWeight: System.Platform.Android ? '400' : '600', fontSize: 28, fontFamily: 'Cochin' }}>RM</Text> */}
                </View>
              </View>
              <View style={{ backgroundColor: 'white', width: width - 30, marginTop: 12, flexDirection: 'row', paddingHorizontal: 15, height: 48, justifyContent: 'flex-end', alignItems: 'center' }}>
                <Button onPress={() => this.props.navigation.navigate('WalletDeposit')} style={{ paddingHorizontal: 10, height: 28, marginRight: 15, borderRadius: 4 }}>
                  <Text style={{ fontSize: 12, color: '#a5a5a5', fontWeight: System.Platform.Android ? '400' : '600' }}>充值</Text>
                </Button>
                <Button onPress={() => this.props.navigation.navigate('WalletWithdraw')} style={{ paddingHorizontal: 10, height: 28, backgroundColor: '#e5e5e5', borderRadius: 4 }}>
                  <Text style={{ fontSize: 12, color: '#7d7d7d', fontWeight: System.Platform.Android ? '400' : '600' }}>提现</Text>
                </Button>
              </View>
            </View>
          </View>

          <View style={{ marginBottom: 15, width, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <View style={[
              { width: width - 30, height: 275, borderRadius: 6, backgroundColor: '#f6b854' },
              { shadowOffset: { width: 0, height: 0 }, shadowColor: '#a2a3a8', shadowOpacity: .5, shadowRadius: 3 },
              {  }
            ]}>
              <View style={{ flex: 1, paddingHorizontal: 15, paddingVertical: 15 }}>
                <Text style={{ flex: 1, textAlign: 'left', color: '#000', fontWeight: '400', fontSize: 16}}>DACSEE WALLET</Text>
                <Text style={{ color: 'white', fontWeight: '200', fontSize: 13}}>YOUR BALANCE</Text>
                <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                  <Text style={{ color: 'white', fontWeight: System.Platform.Android ? '400' : '600', fontSize: 34, fontFamily: 'Cochin' }}>{ (2400).toFixed(2) }</Text>
                  <Text style={{ color: 'white', fontWeight: System.Platform.Android ? '400' : '600', top: -3, marginLeft: 10, fontSize: 22, fontFamily: 'Cochin' }}>TOKEN</Text>
                </View>
                <Text style={{ marginTop: 22, color: 'white', fontWeight: '200', fontSize: 13}}>CURRENT MARKET VALUE</Text>
                <View style={{ flexDirection: 'row', alignItems: 'flex-end', borderRadius: 4, marginTop: 5 }}>
                  <Text style={{ backgroundColor: '#373a44', paddingHorizontal: 6, paddingVertical: 2, color: 'white', fontWeight: System.Platform.Android ? '400' : '600', fontSize: 18, fontFamily: 'Cochin' }}>RM { (2400).toFixed(2) }</Text>
                </View>
              </View>
              <View style={{ backgroundColor: 'white', width: width - 30, marginTop: 12, flexDirection: 'row', paddingHorizontal: 15, height: 48, justifyContent: 'flex-end', alignItems: 'center' }}>
                <Button onPress={() => this.props.dispatch(application.showMessage('无法请求到服务器'))} style={{ paddingHorizontal: 10, height: 28, backgroundColor: '#e5e5e5', borderRadius: 4 }}>
                  <Text style={{ fontSize: 12, color: '#7d7d7d', fontWeight: System.Platform.Android ? '400' : '600' }}>出售</Text>
                </Button>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }
})