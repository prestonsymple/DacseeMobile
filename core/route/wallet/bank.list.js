import React, { Component, PureComponent } from 'react'
import { Text, View, Animated, StyleSheet, StatusBar, Image,
  TouchableOpacity, TouchableHighlight, DeviceEventEmitter, TextInput,
  ScrollView, Platform, FlatList, ListView } from 'react-native'
import InteractionManager from 'InteractionManager'
import { NavigationActions, SafeAreaView } from 'react-navigation'

import {Screen, Icons, Redux, Define, TextFont, Session} from '../../utils'
import {application as app, account, wallet} from '../../redux/actions'
import {connect} from 'react-redux'

const { width, height } = Screen.window


const dataContrast = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

class PickerBank extends Component {

  static navigationOptions = ({ navigation }) => {
    const {title} =navigation.state.params
    return {
      drawerLockMode: 'locked-closed',
      title: title,
    }
  }

  async componentDidMount() {
    try{
      const {account} = this.props
      const data = await Session.Lookup.Get(`v1/lookup/banks?resultType=nameOnly&country=${account.country}`)
      this.props.dispatch(wallet.setBankValue({bank_list:data}))
    }catch (e) {
      console.log(e)
      this.props.dispatch(app.showMessage(this.props.i18n.unable_connect_server_pls_retry_later))
    }
  }
  componentWillUnmount() {}


  render() {
    const {wallet, navigation} = this.props
    const {
      onPress = () => {}
    } = navigation.state.params
    return(
      <View style={styles.container}>
        <ListView
          dataSource={dataContrast.cloneWithRows(wallet.bank_list)}
          enableEmptySections={true}
          renderSeparator={() => (
            <View style={{ height: .8, backgroundColor: '#eee' }}></View>
          )}
          renderRow={(row) => (
            <TouchableOpacity activeOpacity={.7} onPress={() => {
              onPress(row)
              this.props.navigation.goBack()
            }} style={{ flex: 1, height: 52, justifyContent: 'center', backgroundColor: 'white' }}>
              <View style={{ flexDirection: 'row', paddingHorizontal: 15, alignItems: 'center' }}>
                <Text style={{ color: '#333', fontSize: 16, fontWeight: '600' }}>{ row }</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1
  }
})

export default connect(state => ({
  account:state.account,
  user: state.account.user,
  i18n: state.intl.messages || {},
  wallet: state.wallet || {}
}))(PickerBank)
