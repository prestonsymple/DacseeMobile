/**
 * @flow
 * Created by Rabbit on 2018/4/18.
 */

import React, {Component} from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native'

import QRCode from 'react-native-qrcode-svg'

import { Icons, Screen, Session, TextFont } from '../../utils'
import {connect} from 'react-redux'

const { width, height } = Screen.window


export default connect(state => ({
  i18n: state.intl.messages || {},
  user: state.account.user,
})) (class SettingQrCode extends Component {

  static navigationOptions = ({ navigation }) => {
    const {title, option} = navigation.state.params
    const reducer = global.store.getState()
    return {
      drawerLockMode: 'locked-closed',
      title: title,
    }
  }

  constructor(props) {
    super(props)
    const { option } = props.navigation.state.params
    console.log(option)
    this.state = {
      userId: option.userId,
      user:{
        userId: option.userId,
        id: option.id,
      }
    }
  }

  // TODO 扫二维码的多语言
  render() {
    return (
      <View style={styles.container}>

        <Text style={{textAlign: 'center', fontSize: 13, color:'#000', opacity: 0.7, marginTop:70, marginHorizontal: 50}}>
          {this.props.i18n.qr_code_introduce}
        </Text>
        <View style={{marginBottom: 100}}>
          <QRCode
            value={this.state.userId}
            size={200}
          />
        </View>
        <View style={{height: 100,width, backgroundColor:'white'}}/>
      </View>
    )
  }
})

const styles = StyleSheet.create({
  container: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'white',
  },
})