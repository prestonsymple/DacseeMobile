

import {
  LoginScreen,
  PickerCountryScreen,
  LoginSelectAccountScreen,
  SocialRegisterScreen
} from '../route/login'

import {
  DriverAndPassengerScreen,

  PassengerCompleteScreen,

  FriendsCircleScreen,
  FriendsCircleAddScreen,
  FriendsRequestScreen,
  FriendsDetailScreen,
  FriendsSearchScreen,
  FriendsGroupDetailScreen,
  CommonScanQRCodeScreen
} from '../route/main'

import {
  JobsListScreen,
  JobsOnlineScreen,
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
  SettingLanguageChooseScreen,
  SettingFeedbackScreen,
  SettingHelpCenterScreen,
  SettingWetViewScreen,
  SettingPrivateScreen,

  ProfileChangeAvatarScreen
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

import UpgradeDriverScreen from '../route/upgrade.driver'
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

  PassengerCompleteScreen: { screen: PassengerCompleteScreen },

  FriendsCircle: { screen: FriendsCircleScreen },
  FriendsCircleAdd: { screen: FriendsCircleAddScreen },
  FriendsSearchBase: { screen: FriendsSearchScreen },
  FriendsRequest: { screen: FriendsRequestScreen },
  FriendsDetail: { screen: FriendsDetailScreen },
  FriendsGroupDetail: { screen: FriendsGroupDetailScreen },

  CommonScanQRCode: { screen: CommonScanQRCodeScreen },

  JobsList: { screen: JobsListScreen },
  JobsListDetail: { screen: JobsListDetailScreen },
  JobsOnline: { screen: JobsOnlineScreen },

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
  SettingLanguageChoose: { screen: SettingLanguageChooseScreen },
  SettingFeedback: { screen: SettingFeedbackScreen },
  SettingHelpCenter: { screen: SettingHelpCenterScreen },
  SettingPrivate: { screen: SettingPrivateScreen },
  SettingWetView: { screen: SettingWetViewScreen },

  DownLineTotal: { screen: DownLineTotalScreen },
  DownLineList: { screen: DownLineListScreen },
  DownLineDetail: { screen: DownLineDetailScreen },

  ProfileChangeAvatar: { screen: ProfileChangeAvatarScreen },

  UpgradeDriver: { screen: UpgradeDriverScreen },

  FormEditor: { screen: FormEditorScreen },

  PublicPickerCountry: { screen: PickerCountryScreen },

  ChatWindow: { screen: ChatScreen }
}

export {
  AuthScreen,
  HomeScreen
}
