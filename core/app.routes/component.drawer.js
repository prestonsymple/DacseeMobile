/* global store */
import React, { Component } from 'react'
import { ScrollView, StyleSheet, View, Text, Image } from 'react-native'
import { connect } from 'react-redux'
import { SafeAreaView } from 'react-navigation'

import { Icons, System } from '../utils'
import { Button } from '../components'

const ICONS_COLOR = '#888'

const MENUS_OPTIONS = [{
  key: '0',
  name: '加入DACSEE',
  icon: (Icons.Generator.Material('drive-eta', 24, ICONS_COLOR, { style: { top: 1 } })),
  onPress: ({ navigation }) => navigation.navigate('UpgradeDriver')
}, {
  key: '1',
  name: '开始接单',
  icon: (Icons.Generator.Material('drive-eta', 24, ICONS_COLOR, { style: { top: 1 } })),
  onPress: ({ navigation }) => navigation.navigate('JobsListener')
}, {
  key: '2',
  name: '检验清单',
  icon: Icons.Generator.Material('assignment', 24, ICONS_COLOR, { style: { left: .5 } }),
  onPress: () => {
  }
}, {
  key: '3',
  name: '我的行程',
  icon: Icons.Generator.Material('data-usage', 24, ICONS_COLOR, { style: { left: .5, top: 1 } }),
  onPress: ({ navigation }) => navigation.navigate('JobsList')
}, {
  key: '4',
  name: '钱包',
  icon: Icons.Generator.Material('account-balance-wallet', 24, ICONS_COLOR, { style: { left: .5 } }),
  onPress: ({ navigation }) => navigation.navigate('WalletBalance')
}, {
  key: '5',
  name: '收入',
  icon: Icons.Generator.Material('monetization-on', 24, ICONS_COLOR, { style: { left: 1 } }),
  onPress: ({ navigation }) => navigation.navigate('IncomeList')
}, 
{
  key: '7',
  name: '设置',
  icon: Icons.Generator.Material('settings', 24, ICONS_COLOR, { style: { left: 1.5 } }),
  onPress: ({ navigation }) => navigation.navigate('SettingMenu')
}]

export default connect(state => ({ user: state.account.user }))(class DrawerContentComponent extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    const { fullName, avatars } = this.props.user

    return (
      <View style={{ flex: 1 }}>
        {/* TODO: Fix iPhone X */}
        <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
          {/* Profile */}
          <View style={{ marginVertical: 25, alignItems: 'center' }}>
            {/* TODO: LOAD USER DATA */}
            <View style={[
              { backgroundColor: '#eee', overflow: 'hidden', borderColor: '#e8e8e8', borderWidth: 1 },
              { borderRadius: 50, width: 100, height: 100, justifyContent: 'center', alignItems: 'center' }
            ]}>
              <Image style={{ width: 100, height: 100 }} source={{ uri: avatars[avatars.length - 1].url }} />
              {/* { Icons.Generator.Material('account-circle', 100, '#fad723') } */}
            </View>
            <Text style={[
              { marginTop: 10 },
              { color: '#333', fontWeight: System.Platform.Android ? '400' : '600', fontSize: 18 }
            ]}>{ fullName }</Text>
            <View style={[
              { marginTop: 10, paddingHorizontal: 20, height: 26, borderRadius: 13, borderColor: '#e8e8e8', borderWidth: 0.5 },
              { backgroundColor: '#f2f2f2', justifyContent: 'center', alignItems: 'center' }
            ]}>
              <Text style={{ color: '#666', fontWeight: '600', fontSize: 12 }}>乘客</Text>
            </View>
          </View>

          <View style={{ height: 1, backgroundColor: '#f1f1f1', marginHorizontal: 27, marginBottom: 12, borderRadius: 2 }} />
          {/* Menu */}
          <ScrollView style={{ paddingHorizontal: 25 }} containerStyle={{ flex: 1 }}>
            {
              MENUS_OPTIONS.map(pipe => (
                <Button onPress={pipe.onPress ? pipe.onPress.bind(this, this.props) : () => {}} key={pipe.key} style={{ height: 44, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                  <View style={{ marginRight: 10 }}>{ pipe.icon }</View>
                  <Text style={{ fontSize: 14, fontWeight: System.Platform.Android ? '400' : '600', color: '#333' }}>{pipe.name}</Text>
                </Button>
              ))
            }
          </ScrollView>
        </SafeAreaView>
      </View>
    )
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
