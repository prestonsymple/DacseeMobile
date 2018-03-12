import React from 'react'
import { TouchableOpacity, Platform } from 'react-native'
import { StackNavigator, DrawerNavigator, SwitchNavigator } from 'react-navigation'

import { Icons } from './utils'

/*****************************************************************************************************/
import DrawerContent from './route/_menu'

import AppAuthLoadingScreen from './app.auth.loading'

import { 
  BookingScreen,
  BookingOptionsScreen,
  PickerAddressScreen,
  FriendsCircleScreen,
  FriendsCircleAddScreen,
  FriendsRequestScreen,
  FriendsDetailScreen,
  FriendsSearchScreen
} from './route/main'

import {
  JobsListenerScreen
} from './route/jobs'

import { 
  WalletBalanceScreen,
  WalletWithdrawScreen,
  WalletBalanceListScreen,
  WalletTransactionListScreen,
  WalletDetailScreen,
  WalletTransferScreen,
  WalletTransferSelectionScreen,
  WalletTransferSummaryScreen
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

import {
  IncomeListScreen
} from './route/income'

import UpgradeDriverScreen from './route/upgrade.driver'


import {
  LoginScreen,
  PickerCountryScreen,
  LoginSelectAccountScreen
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

const AppNavigator = DrawerNavigator({
  Drawer: { screen: StackNavigator({ 
    Main: { screen: BookingScreen },
    BookingOptions: { screen: BookingOptionsScreen },
    FriendsCircle: { screen: FriendsCircleScreen },
    FriendsCircleAdd: { screen: FriendsCircleAddScreen },
    FriendsSearchBase: { screen: FriendsSearchScreen },
    FriendsRequest: { screen: FriendsRequestScreen },
    FriendsDetail: { screen: FriendsDetailScreen },
    PickerAddress: { screen: PickerAddressScreen },

    JobsListener: { screen: JobsListenerScreen },

    WalletBalance: { screen: WalletBalanceScreen },
    WalletWithdraw: { screen: WalletWithdrawScreen },
    WalletBalanceList: { screen: WalletBalanceListScreen },
    WalletTransaction: { screen: WalletTransactionListScreen },
    WalletDetail: { screen: WalletDetailScreen },
    WalletTransfer: { screen: WalletTransferScreen },
    WalletPickerCountry: { screen: PickerCountryScreen },
    WalletTransferSelection: { screen: WalletTransferSelectionScreen },
    WalletTransferSummary: { screen: WalletTransferSummaryScreen },

    IncomeList: { screen: IncomeListScreen },
    
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



const AuthNavigator = StackNavigator({
  Login: { screen: LoginScreen },
  SettingWetView: { screen: SettingWetViewScreen },
  PickerCountry: { screen: PickerCountryScreen },
  LoginSelectAccount: { screen: LoginSelectAccountScreen }
}, defaultStackOptions)

export default SwitchNavigator(
  {
    AuthLoading: AppAuthLoadingScreen,
    App: AppNavigator,
    Auth: AuthNavigator,
  }, { initialRouteName: 'AuthLoading' }
)