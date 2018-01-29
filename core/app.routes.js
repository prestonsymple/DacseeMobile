import React from 'react'
import { TouchableOpacity } from 'react-native'
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
  SettingHelpCenterScreen
} from './route/setting'


import LoginScreen from './route/login'
/*****************************************************************************************************/

const defaultStackOptions = {
  navigationOptions: ({ navigation }) => {
    let options = {
      headerStyle: {
        backgroundColor: 'white',
        shadowColor: 'transparent',
        shadowOpacity: 0,
        // borderBottomWidth: 0,
        borderBottomColor: '#c8c8c8',
        elevation: 0,
      },
      headerTintColor: '#333',
      headerBackTitle: null,
    }
    if (!('index' in navigation.state)) options = Object.assign(options, {
      headerLeft: (
        <TouchableOpacity 
          activeOpacity={0.7} 
          style={{ top: 1, width: 44, justifyContent: 'center', alignItems: 'center' }} 
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
    SettingHelpCenter: { screen: SettingHelpCenterScreen }
  }, defaultStackOptions)}
}, defaultDrawerOptions)

// const HomeNavigator = DrawerNavigator({
//   Drawer: { screen: MainScreen }
// }, )



const LoginNavigator = StackNavigator({
  Login: { screen: LoginScreen }
})

export {
  HomeNavigator,
  LoginNavigator
}