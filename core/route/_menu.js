
import React, { Component } from 'react'
import { 
  ScrollView, StyleSheet, View, Text, Image
} from 'react-native'
import { connect } from 'react-redux'
import { DrawerItems, SafeAreaView } from 'react-navigation'

import resources from '../resources'
import { Screen, Icons } from '../utils'
import { Button } from '../components'
import { application, account } from '../redux/actions'

const ICONS_COLOR = '#888'

const MENUS_OPTIONS = [{
  key: '0',
  name: '加入DACSEE',
  icon: (Icons.Generator.Material('drive-eta', 24, ICONS_COLOR, { style: { top: 1 } })),
  onPress: ({ navigation }) => navigation.navigate('UpgradeDriver')
}, {
  key: '1',
  name: '检验清单',
  icon: Icons.Generator.Material('assignment', 24, ICONS_COLOR, { style: { left: .5 } })
}, {
  key: '2',
  name: '行程预约',
  icon: Icons.Generator.Material('data-usage', 24, ICONS_COLOR, { style: { left: .5, top: 1 } })
}, {
  key: '3',
  name: '钱包',
  icon: Icons.Generator.Material('account-balance-wallet', 24, ICONS_COLOR, { style: { left: .5 } }),
  onPress: ({ navigation }) => navigation.navigate('WalletBalance')
}, {
  key: '4',
  name: '收入',
  icon: Icons.Generator.Material('monetization-on', 24, ICONS_COLOR, { style: { left: 1 } })
}, 
// {
//   key: '5',
//   name: '司',
//   icon: Icons.Generator.Material('store-mall-directory', 24, ICONS_COLOR, { style: { left: 1 } })
// }, {
//   key: '6',
//   name: 'New Job (Driver)',
//   icon: Icons.Generator.Material('perm-contact-calendar', 24, ICONS_COLOR, { style: { left: 1.5 } })
// }, 
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
    const { fullName } = this.props.user

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
              <Image style={{ width: 100, height: 100 }} source={require('../resources/images/test.jpg')} />
              {/* { Icons.Generator.Material('account-circle', 100, '#fad723') } */}
            </View>
            <Text style={[
              { marginTop: 10 },
              { color: '#333', fontWeight: '600', fontSize: 18 }
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
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#333' }}>{pipe.name}</Text>
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
