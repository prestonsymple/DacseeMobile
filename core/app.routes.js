import React from 'react'
import { TouchableOpacity, Platform } from 'react-native'
import { StackNavigator, DrawerNavigator } from 'react-navigation'

import { Icons } from './utils'

/*****************************************************************************************************/
import DrawerContent from './route/_menu'

import { 
  BookingScreen,
  PickerAddressScreen
} from './route/main'

import { 
  WalletBalanceScreen 
} from './route/wallet'

import {
  SettingMenuScreen,
  SettingAboutScreen,
  SettingAccountScreen,
  SettingMessageNotificationScreen,
  SettingLanguageRegionScreen,
  SettingFeedbackScreen,
  SettingHelpCenterScreen,
  SettingWetViewScreen
} from './route/setting'

import {
  FormEditorScreen
} from './components/form-builder'

import UpgradeDriverScreen from './route/upgrade.driver'


import {
  LoginScreen,
  RegisterScreen
} from './route/login'
/*****************************************************************************************************/

const defaultStackOptions = {
  navigationOptions: ({ navigation }) => {
    let options = {
      headerStyle: {
        backgroundColor: 'white',
        shadowColor: 'transparent',
        shadowOpacity: 0,
        borderBottomWidth: Platform.select({ ios: .6, android: .5 }),
        borderBottomColor: '#eee',
        elevation: 0,
      },
      headerTintColor: '#333',
      headerBackTitle: null,
    }
    if (!('index' in navigation.state)) options = Object.assign(options, {
      headerLeft: (
        <TouchableOpacity 
          activeOpacity={0.7} 
          style={{ top: 1, width: 54, paddingLeft: 8, justifyContent: 'center', alignItems: 'flex-start' }} 
          onPress={() => navigation.goBack()}
        >
          { Icons.Generator.Material('keyboard-arrow-left', 30, '#2f2f2f') }
        </TouchableOpacity>
      )
    })
    return options
  }
}

const defaultDrawerOptions = {
  drawerOpenRoute: 'DrawerOpen',
  drawerCloseRoute: 'DrawerClose',
  drawerToggleRoute: 'DrawerToggle',
  initialRouteName: 'Drawer',
  contentComponent: DrawerContent,
  contentOptions: {
    activeTintColor: '#e91e63',
  }
}

const HomeNavigator = DrawerNavigator({
  Drawer: { screen: StackNavigator({ 
    Main: { screen: BookingScreen },
    PickerAddress: { screen: PickerAddressScreen },

    WalletBalance: { screen: WalletBalanceScreen },
    
    SettingMenu: { screen: SettingMenuScreen },
    SettingAbout: { screen: SettingAboutScreen },
    SettingAccount: { screen: SettingAccountScreen },
    SettingMessageNotification: { screen: SettingMessageNotificationScreen },
    SettingLanguageRegion: { screen: SettingLanguageRegionScreen },
    SettingFeedback: { screen: SettingFeedbackScreen },
    SettingHelpCenter: { screen: SettingHelpCenterScreen },
    SettingWetView: { screen: SettingWetViewScreen },

    UpgradeDriver: { screen: UpgradeDriverScreen },

    FormEditor: { screen: FormEditorScreen },
  }, defaultStackOptions)}
}, defaultDrawerOptions)

// const HomeNavigator = DrawerNavigator({
//   Drawer: { screen: MainScreen }
// }, )



const LoginNavigator = StackNavigator({
  Login: { screen: LoginScreen },
  SettingWetView: { screen: SettingWetViewScreen }
})

export {
  HomeNavigator,
  LoginNavigator
}