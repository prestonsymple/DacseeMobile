

import {
  LoginScreen,
  PickerCountryScreen,
  LoginSelectAccountScreen,
  SocialRegisterScreen
} from '../route/login'

import {
  DriverAndPassengerScreen,

  FriendsCircleScreen,
  FriendsCircleAddScreen,
  FriendsRequestScreen,
  FriendsDetailScreen,
  FriendsSearchScreen,

  CommonScanQRCodeScreen
} from '../route/main'

import {
  JobsListScreen,
  JobsOnlineScreen,
  JobsListDetailScreen,
  JobsAddScreen
} from '../route/jobs'

import {
  TripListScreen,
  TripListDetailScreen
} from '../route/trip'

import {
  WalletBalanceScreen,
  WalletTransactionListScreen,
  WalletDetailScreen,
  WalletTransferScreen,
  WalletTransferSelectionScreen,
  WalletTransferSummaryScreen,
  BankListScreen
} from '../route/wallet'

import {
  SettingMenuScreen,
  SettingAboutScreen,
  SettingAccountScreen,
  SettingMessageNotificationScreen,
  SettingLanguageRegionScreen,
  SettingLanguageChooseScreen,
  SettingFeedbackScreen,
  SettingHelpCenterScreen,
  SettingWetViewScreen,
  SettingPrivateScreen,
  BankDetailScreen,
  ProfileChangeAvatarScreen,
  SettingQrCodeScreen
} from '../route/setting'

import {
  DownLineListScreen,
  DownLineDetailScreen,
  DownLineTotalScreen
} from '../route/downLine'

import {
  FormEditorScreen
} from '../components/form-builder'

import {
  IncomeListScreen
} from '../route/income'

import {ChatScreen} from '../route/chat'

// 登录流程
const AuthScreen = {
  Login: { screen: LoginScreen },
  SettingWetView: { screen: SettingWetViewScreen },
  PickerCountry: { screen: PickerCountryScreen },
  LoginSelectAccount: { screen: LoginSelectAccountScreen },
  SocialRegister: { screen: SocialRegisterScreen }
}

// 首页流程
const HomeScreen = {
  Main: { screen: DriverAndPassengerScreen },

  FriendsCircle: { screen: FriendsCircleScreen },
  FriendsCircleAdd: { screen: FriendsCircleAddScreen },
  FriendsSearchBase: { screen: FriendsSearchScreen },
  FriendsRequest: { screen: FriendsRequestScreen },
  FriendsDetail: { screen: FriendsDetailScreen },

  CommonScanQRCode: { screen: CommonScanQRCodeScreen },

  JobsList: { screen: JobsListScreen },
  JobsListDetail: { screen: JobsListDetailScreen },
  JobsOnline: { screen: JobsOnlineScreen },
  JobsAdd: { screen: JobsAddScreen },

  TripList: { screen: TripListScreen },
  TripListDetail: { screen: TripListDetailScreen },

  WalletBalance: { screen: WalletBalanceScreen },
  WalletTransaction: { screen: WalletTransactionListScreen },
  WalletDetail: { screen: WalletDetailScreen },

  WalletTransfer: { screen: WalletTransferScreen },
  WalletTransferSelection: { screen: WalletTransferSelectionScreen },
  WalletTransferSummary: { screen: WalletTransferSummaryScreen },
  BankList:{ screen:BankListScreen},

  IncomeList: { screen: IncomeListScreen },

  SettingMenu: { screen: SettingMenuScreen },
  SettingAbout: { screen: SettingAboutScreen },
  SettingAccount: { screen: SettingAccountScreen },
  SettingMessageNotification: { screen: SettingMessageNotificationScreen },
  SettingLanguageRegion: { screen: SettingLanguageRegionScreen },
  SettingLanguageChoose: { screen: SettingLanguageChooseScreen },
  SettingFeedback: { screen: SettingFeedbackScreen },
  SettingHelpCenter: { screen: SettingHelpCenterScreen },
  SettingPrivate: { screen: SettingPrivateScreen },
  SettingWetView: { screen: SettingWetViewScreen },
  SettingQrCode: { screen: SettingQrCodeScreen },

  DownLineTotal: { screen: DownLineTotalScreen },
  DownLineList: { screen: DownLineListScreen },
  DownLineDetail: { screen: DownLineDetailScreen },

  ProfileChangeAvatar: { screen: ProfileChangeAvatarScreen },

  FormEditor: { screen: FormEditorScreen },

  PublicPickerCountry: { screen: PickerCountryScreen },

  ChatWindow: { screen: ChatScreen },
  BankDetail:{ screen:BankDetailScreen}
}

export {
  AuthScreen,
  HomeScreen
}
