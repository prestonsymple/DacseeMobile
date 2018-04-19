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
} from 'react-native'

import QRCode from 'react-native-qrcode-svg'


export default class SettingQrCode extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <View style={styles.container}>
        <QRCode
          value="http://awesome.link.qr"
          size={200}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})