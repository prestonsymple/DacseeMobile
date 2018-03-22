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

const {height, width} = Screen.window

const styles = StyleSheet.create({
  pageWrap: { width: width, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white' },
  itemWrap: { alignItems: 'center', justifyContent: 'center' },
  itemTitle: { color: '#666', fontSize: 14, fontWeight: '100', marginBottom: 8 },
  itemImageContent: { marginHorizontal: 6, width: 68, height: 68, borderRadius: 33, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderWidth: 3 },
  itemImage: { opacity: 0.7, width: 66, height: 66, borderRadius: 33, borderWidth: 1.5, borderColor: 'white', resizeMode: 'cover' }
})

export default connect(state => ({  
  ...state.wallet
})) (class WalletTransferSummaryScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      drawerLockMode: 'locked-closed', 
      title: '转账确认'
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      wallet: this.props.selected_wallet,
      transferInfo: this.props.navigation.state.params.transferInfo,
      transfering: false
    }
  }

  async _submitTransfer() {
    const { wallet } = this.state
    const { amount, remark, userList } = this.state.transferInfo
    const user = userList[0]

    await InteractionManager.runAfterInteractions()

    const body = {
      from: {
        walletType: wallet.type
      },
      to: {
        walletType: wallet.type,
        user_id: user._id
      },
      amount: amount,
      remarks: remark
    }
    try {
      this.setState({
        transfering: true
      })
      await Session.wallet.post('v1/transferTransactions', body)
      
      this.props.dispatch(application.showMessage('转账成功'))
      this.props.navigation.dispatch(NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Main' })]
      }))
    } catch (e) {
      this.props.dispatch(application.showMessage('无法请求到服务器'))
      this.setState({
        transfering: false
      })
    }
    
  }

  render() {
    const { wallet, transfering } = this.state
    const { amount, userList, remark } = this.state.transferInfo
    const user = userList[0]
    // console.log(userList)
    return (      
      <ScrollView style={{ flex: 1, backgroundColor: 'white' }} horizontal={false} >
        <View style={{ padding:20 }}>
          <View style={{ borderBottomWidth: 1, borderBottomColor: '#a5a5a5'}}>
            <Text style={{ fontSize: 12, opacity: 0.5 }}>转账钱包</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', height: 40}}>
              <Text style={{ fontSize: 14 }}>{ wallet.name }</Text>              
            </View>
          </View>

          <View style={{ paddingTop: 20, borderBottomWidth: 1, borderBottomColor: '#a5a5a5'}}>
            <Text style={{ fontSize: 12, opacity: 0.5 }}>转账金额</Text>
            <View style={{ height: 40, justifyContent: 'center' }}>
              <Text style={{}}>{ amount }</Text>
            </View>            
          </View>

          <View style={{ paddingTop: 20, borderBottomWidth: 1, borderBottomColor: '#a5a5a5'}}>
            <Text style={{ fontSize: 12, opacity: 0.5 }}>收款账户</Text>
            <View style={{ flexDirection: 'row' }}>
              <Image source={{ uri: user.avatars[0].url}} style={{ marginVertical: 15, marginRight: 15, width: 66, height: 66, borderRadius: 33 }}/>
              <View style={{ justifyContent: 'center'}}>
                <Text style={{ fontSize: 11, opacity: 0.6 }}>{ user.userId }</Text>
                <Text style={{ fontSize: 17 }}>{ user.fullName }</Text>
              </View>
            </View>
          </View>

          <View style={{ paddingTop: 20, borderBottomWidth: 1, borderBottomColor: '#a5a5a5'}}>
            <Text style={{ fontSize: 12, opacity: 0.5 }}>备注</Text>
            <Text style={{ marginVertical: 10, fontSize: 14 }}>{ remark }</Text>
          </View>

          <View style={{ paddingTop: 30, flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
            <Button disabled={ transfering } onPress={ () => this._submitTransfer()} style={[{ width:240, height: 44, borderRadius: 4 }, transfering ? {backgroundColor: '#a5a5a5'} : { backgroundColor: '#4cb1f7'}]}>
              {
                transfering ? 
                  <Text style={{ fontSize: 20, color: 'white' }}>转账中...</Text> :
                  <Text style={{ fontSize: 20, color: 'white' }}>确认转账</Text>
                  
              }              
            </Button>
          </View>
        </View>
      </ScrollView>       
    )
  }
})