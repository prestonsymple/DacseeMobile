
import React, { PureComponent, Component} from 'react'
import { View, TouchableOpacity, Image, Alert, Text, ActivityIndicator, DeviceEventEmitter, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import Settings from './settings'

import {application, account, wallet} from '../../redux/actions'
import {Icons, Screen, Session, Define, TextFont} from '../../utils'

const { width } = Screen.window
class  BankDetails extends Component{
  static navigationOptions = ({ navigation }) => {
    const {title, option} = navigation.state.params
    const reducer = global.store.getState()
    return {
      drawerLockMode: 'locked-closed',
      title: title,
      headerRight: (
        <TouchableOpacity
          activeOpacity={0.7}
          style={{paddingRight: 15, justifyContent: 'center', alignItems: 'flex-end' }}
          onPress={() =>{option.onsubmit()}}
        >
          <Text style={{ fontSize: TextFont.TextSize(16), color: 'white', fontWeight: '600' }}>{reducer.intl.messages.finish}</Text>
        </TouchableOpacity>
      )
    }
  }

  _changeBankName(value) {
    this.props.dispatch(wallet.updateBankInfo({
      bank_info: Object.assign({}, this.props.wallet.bank_info, { name: value })
    }))
  }

  _changeBankAccount(value) {
    this.props.dispatch(wallet.updateBankInfo({
      bank_info: Object.assign({}, this.props.wallet.bank_info, { accountNo: value })
    }))
  }
  _changeBankHolderName(value) {
    this.props.dispatch(wallet.updateBankInfo({
      bank_info: Object.assign({}, this.props.wallet.bank_info, { accountHolderName: value })
    }))
  }

  

  componentWillUnmount() {
    this.props.dispatch(wallet.updateBankInfo({
      bank_info: {}
    }))
  }


  render(){
    const {i18n, user, navigation, wallet} =this.props
    const {bankInfo} = user
    return(
      <View style={styles.container}>
        <View style={{paddingTop:16,paddingLeft:12}}>
          <Text>{i18n.bank_detail_for_withdrawals}</Text>
        </View>
        <Settings producer={[
          [{
            title: i18n.bank_name, type: 'text',
            value: wallet.bank_info.name || (bankInfo && bankInfo.name) || '',
            onPress: () => navigation.navigate('BankList', {
              title: i18n.sel_bank,
              editorName: 'String',
              onPress:(val) => this._changeBankName(val)
            })
          },{
            title: i18n.bank_account, type: 'text',
            value: wallet.bank_info.accountNo || (bankInfo && bankInfo.accountNo) || '',
            onPress: () => navigation.navigate('FormEditor', {
              title: bankInfo==null ? i18n.add_bank_account : i18n.update_bank_account,
              editorName: 'String',
              option: {
                placeholder: i18n.pls_enter_bank_account,
                keyboardType:'numeric',
                value: wallet.bank_info.accountNo || (bankInfo && bankInfo.accountNo) || '',
                onChangeValue:  (val) => this._changeBankAccount(val)
              }
            })
          },{
            title: i18n.bank_holder_name, type: 'text',
            value: wallet.bank_info.accountHolderName || (bankInfo && bankInfo.accountHolderName) || '',
            onPress: () => navigation.navigate('FormEditor', {
              title: bankInfo==null ? i18n.add_bank_account : i18n.update_bank_account,
              editorName: 'String',
              option: {
                placeholder: i18n.pls_enter_holder_name,
                value: wallet.bank_info.accountHolderName || (bankInfo && bankInfo.accountHolderName) || '',
                onChangeValue:  (val) => this._changeBankHolderName(val)
              }
            })
          }]
        ]}
        />
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#f2f2f2'
  }
})

export default connect(state => ({
  user: state.account.user,
  i18n: state.intl.messages || {},
  wallet: state.wallet || {}
}))(BankDetails)