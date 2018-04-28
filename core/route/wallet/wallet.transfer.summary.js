import React, { Component } from 'react'
import {
  Text, View, Image, ScrollView
} from 'react-native'
import InteractionManager from 'InteractionManager'
import { NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'

import { Screen, Icons, Redux, Define, System, Session ,TextFont} from '../../utils'
import { Button } from '../../components'
import { application, booking, wallet as Wallet } from '../../redux/actions'
import { FormattedMessage } from 'react-intl'

const {height, width} = Screen.window

export default connect(state => ({
  ...state.wallet,
  i18n: state.intl.messages
})) (class WalletTransferSummaryScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const reducer = global.store.getState()
    return {
      drawerLockMode: 'locked-closed',
      title: reducer.intl.messages.transfer_confirm
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
      await Session.Wallet.Post('v1/transferTransactions', body)

      this.props.dispatch(Wallet.setBalanceValue({amount: amount}))
      this.props.dispatch(application.showMessage(this.props.i18n.transfer_success))
      this.props.navigation.dispatch(NavigationActions.reset({
        index: 2,
        actions: [NavigationActions.navigate({ routeName: 'Main' }),
          NavigationActions.navigate({ routeName: 'WalletBalance' }),
          NavigationActions.navigate({ routeName: 'WalletDetail' })]
      }))
    } catch (e) {
      if (e.response && e.response.data.message) {
        this.props.dispatch(application.showMessage(e.response.data.message))  
      } else {
        this.props.dispatch(application.showMessage(this.props.i18n.unable_connect_server_pls_retry_later))
      }
      
      this.setState({
        transfering: false
      })
    }

  }

  render() {
    const { wallet, transfering } = this.state
    const { amount, userList, remark } = this.state.transferInfo
    const user = userList[0]
    const {avatars= [{ url: 'https://storage.googleapis.com/dacsee-service-user/_shared/default-profile.jpg' }]}=user
    return (
      <ScrollView style={{ flex: 1, backgroundColor: 'white' }} horizontal={false} >
        <View style={{ padding:20 }}>
          <View style={{ borderBottomWidth: 1, borderBottomColor: '#a5a5a5'}}>
            <Text style={{ fontSize: TextFont.TextSize(12), opacity: 0.5 }}>
              <FormattedMessage id={'transfer_wallet'}/>
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', height: 40}}>
              <Text style={{ fontSize: TextFont.TextSize(14) }}>{ wallet.name }</Text>
            </View>
          </View>

          <View style={{ paddingTop: 20, borderBottomWidth: 1, borderBottomColor: '#a5a5a5'}}>
            <Text style={{ fontSize: TextFont.TextSize(12), opacity: 0.5 }}>
              <FormattedMessage id={'sending_amount'}/>
            </Text>
            <View style={{ height: 40, justifyContent: 'center' }}>
              <Text style={{}}>{ amount }</Text>
            </View>
          </View>

          <View style={{ paddingTop: 20, borderBottomWidth: 1, borderBottomColor: '#a5a5a5'}}>
            <Text style={{ fontSize: TextFont.TextSize(12), opacity: 0.5 }}>
              <FormattedMessage id={'recipient_account'}/>
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <Image source={{ uri: avatars[0].url}} style={{ marginVertical: 15, marginRight: 15, width: 66, height: 66, borderRadius: 33 }}/>
              <View style={{ justifyContent: 'center'}}>
                <Text style={{ fontSize: TextFont.TextSize(11), opacity: 0.6 }}>{ user.userId }</Text>
                <Text style={{ fontSize: TextFont.TextSize(17) }}>{ user.fullName }</Text>
              </View>
            </View>
          </View>

          <View style={{ paddingTop: 20, borderBottomWidth: 1, borderBottomColor: '#a5a5a5'}}>
            <Text style={{ fontSize: TextFont.TextSize(12), opacity: 0.5 }}>
              <FormattedMessage id={'remarks'}/>
            </Text>
            <Text style={{ marginVertical: 10, fontSize: TextFont.TextSize(14) }}>{ remark }</Text>
          </View>

          <View style={{ paddingTop: 30, flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
            <Button disabled={ transfering } onPress={ () => this._submitTransfer()} style={[{ width:240, height: 44, borderRadius: 4 }, transfering ? {backgroundColor: '#a5a5a5'} : { backgroundColor: '#4cb1f7'}]}>
              {
                transfering ?
                  <Text style={{ fontSize: TextFont.TextSize(20), color: 'white' }}>
                    <FormattedMessage id={'transfering'}/>
                  </Text> :
                  <Text style={{ fontSize: TextFont.TextSize(20), color: 'white' }}>
                    <FormattedMessage id={'confirm_transfer'}/>
                  </Text>

              }
            </Button>
          </View>
        </View>
      </ScrollView>
    )
  }
})
