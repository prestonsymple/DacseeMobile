/**
 * @flow
 * Created by Rabbit on 2018/4/16.
 */

import React, {Component} from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  DeviceEventEmitter,
  TouchableOpacity, ScrollView, TextInput, Switch,
} from 'react-native'
import {Define, Icons, TextFont, Screen} from '../../../utils'
import { FormattedMessage, injectIntl } from 'react-intl'

const { width, height } = Screen.window

export default class FriendsGroupAdd extends Component{
  constructor(props) {
    super(props)
    this.state = {
      isPrivate : false,
      isVerify: false,

    }
  }
  // TODO 标题多语言
  static navigationOptions = ({ navigation }) => {
    const reducer = global.store.getState()
    return {
      drawerLockMode: 'locked-closed',
      headerRight: (
        <TouchableOpacity
          activeOpacity={0.7}
          style={{ top: -0.5, width: 54, paddingRight: 20, justifyContent: 'center', alignItems: 'flex-end' }}
          onPress={() => DeviceEventEmitter.emit('NAVIGATION.EVENT.ON.PRESS.ADD.FREIENDS')}
        >
          {Icons.Generator.Material('add', 28, 'white', { style: { left: 8 } })}
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: '#1AB2FD',
        shadowColor: 'transparent',
        shadowOpacity: 0,
        borderBottomWidth: 0,
        borderBottomColor: 'transparent',
        elevation: 0,
      },
      title: 'EDIT GROUP',
    }
  }

  onPrivateChange = (value) => {
    this.setState({
      isPrivate: value,
    })
  }

  onVerifyChange = (value) => {
    this.setState({
      isVerify: value,
    })
  }

  // TODO 多语言
  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <ScrollView style={styles.container}>
          <View style={{alignItems: 'center', flex:1}}>
            <Image style={{ width: 88, height: 88, borderRadius: 44, marginTop:16 }} source={{ uri: 'https://storage.googleapis.com/dacsee-service-user/_shared/default-profile.jpg' }} />
          </View>
          <Text style={{fontSize: 16, opacity: 0.45, color: '#000', marginTop: 16}}>Group Name</Text>
          <TextInput style={{height: 44, backgroundColor: '#f5f5f5', paddingHorizontal: 8, borderRadius: 3, marginTop: 5}} placeholder={'My Family'}/>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', height: 30, flex: 1, alignItems: 'center', marginTop: 10}}>
            <Text style={{fontSize: 16, color:'#000', opacity: 0.45}}>Private Group</Text>
            <Switch onValueChange={this.onPrivateChange} value={this.state.isPrivate}/>
          </View>
          {
            this.state.isPrivate ?
              <View style={{flexDirection: 'row', justifyContent: 'space-between', height: 30, flex: 1, alignItems: 'center', marginTop: 10}}>
                <Text style={{fontSize: 16, color:'#000', opacity: 0.45}}>Require Verification to Join Group</Text>
                <Switch onValueChange={this.onVerifyChange} value={this.state.isVerify}/>
              </View>
              :null
          }
          <Text style={{fontSize: 16, opacity: 0.45, color: '#000', marginTop: 16}}>Description</Text>
          <TextInput multiline={true} style={{height: 88, backgroundColor:'#f5f5f5', paddingHorizontal: 8, borderRadius: 3, marginVertical: 5}} placeholder={'Enter Here'}/>
        </ScrollView>
        <View style={styles.bottomButton}>
          <TouchableOpacity onPress={() => this._handleClick()} activeOpacity={.7} style={styles.confirmButton}>
            <Text style={{ fontSize: TextFont.TextSize(18), fontWeight: '400', color: 'white' }}>
              <FormattedMessage id={'confirm'}/>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: 'white'
    // alignItems: 'center',
  },
  bottomButton:{
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor:'red',
    height:Define.system.ios.x ?110:78,
    width: width - 90,
    marginHorizontal: 45,
  },
  confirmButton:{
    justifyContent: 'center',
    alignItems: 'center',
    width: width - 90,
    height: 60,
    borderRadius: 36,
    backgroundColor: '#7dd320',
    borderStyle: 'solid',
    borderWidth: 5,
    borderColor: '#ffffff',
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowRadius: 3,
    shadowOpacity: 1
  }
})