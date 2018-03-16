

import {
  LoginScreen,
  PickerCountryScreen,
  LoginSelectAccountScreen
} from '../route/login'

import { 
  BookingScreen,
  BookingDriverDetailScreen,
  BookingCompleteScreen,
  FriendsCircleScreen,
  FriendsCircleAddScreen,
  FriendsRequestScreen,
  FriendsDetailScreen,
  FriendsSearchScreen
} from '../route/main'

import {
  JobsListenerScreen,
  JobsListScreen,
  JobsListDetailScreen
} from '../route/jobs'

import {
  TripListScreen,
  TripListDetailScreen
} from '../route/trip'

import { 
  WalletBalanceScreen,
  WalletWithdrawScreen,
  WalletBalanceListScreen,
  WalletTransactionListScreen,
  WalletDetailScreen,
  WalletTransferScreen,
  WalletTransferSelectionScreen,
  WalletTransferSummaryScreen
} from '../route/wallet'

import {
  SettingMenuScreen,
  SettingAboutScreen,
  SettingAccountScreen,
  SettingMessageNotificationScreen,
  SettingLanguageRegionScreen,
  SettingFeedbackScreen,
  SettingHelpCenterScreen,
  SettingWetViewScreen,

  ProfileChangeAvatarScreen
} from '../route/setting'

import {
  FormEditorScreen
} from '../components/form-builder'

import {
  IncomeListScreen
} from '../route/income'

import UpgradeDriverScreen from '../route/upgrade.driver'

// 登录流程
const AuthScreen = {
  Login: { screen: LoginScreen },
  SettingWetView: { screen: SettingWetViewScreen },
  PickerCountry: { screen: PickerCountryScreen },
  LoginSelectAccount: { screen: LoginSelectAccountScreen }
}

// 首页流程
const HomeScreen = {
  Main: { screen: BookingScreen },
  BookingDriverDetail: { screen: BookingDriverDetailScreen },
  BookingComplete: { screen: BookingCompleteScreen },

  FriendsCircle: { screen: FriendsCircleScreen },
  FriendsCircleAdd: { screen: FriendsCircleAddScreen },
  FriendsSearchBase: { screen: FriendsSearchScreen },
  FriendsRequest: { screen: FriendsRequestScreen },
  FriendsDetail: { screen: FriendsDetailScreen },

  JobsListener: { screen: JobsListenerScreen },
  JobsList: { screen: JobsListScreen },
  JobsListDetail: { screen: JobsListDetailScreen },

  TripList: { screen: TripListScreen },
  TripListDetail: { screen: TripListDetailScreen },

  WalletBalance: { screen: WalletBalanceScreen },
  WalletWithdraw: { screen: WalletWithdrawScreen },
  WalletBalanceList: { screen: WalletBalanceListScreen },
  WalletTransaction: { screen: WalletTransactionListScreen },
  WalletDetail: { screen: WalletDetailScreen },

  WalletTransfer: { screen: WalletTransferScreen },
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

  ProfileChangeAvatar: { screen: ProfileChangeAvatarScreen },

  UpgradeDriver: { screen: UpgradeDriverScreen },

  FormEditor: { screen: FormEditorScreen },

  PublicPickerCountry: { screen: PickerCountryScreen }
}

export {
  AuthScreen,
  HomeScreen
}