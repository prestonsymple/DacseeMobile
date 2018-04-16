/**
 * @flow
 * Created by Rabbit on 2018/4/16.
 */

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  DeviceEventEmitter,
  TouchableOpacity, ScrollView, TextInput,
} from 'react-native';
import {Icons} from '../../../utils';

export default class FriendsGroupAdd extends Component <> {
  constructor(props) {
    super(props);
    this.state = {};
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

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={{alignItems: 'center', flex:1}}>
          <Image style={{ width: 88, height: 88, borderRadius: 44, marginTop:16 }} source={{ uri: 'https://storage.googleapis.com/dacsee-service-user/_shared/default-profile.jpg' }} />
        </View>
        <Text style={{fontSize: 16, opacity: 0.45, color: '#000', marginTop: 16}}>Group Name</Text>
        <TextInput />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: 'white'
    // alignItems: 'center',
  },
});