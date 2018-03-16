import { SwitchNavigator, StackNavigator, DrawerNavigator } from 'react-navigation'

import { MODAL_DEFAULT_OPTIONS, DRAWER_DEFAULT_OPTIONS, STACKNAVIGATOR_DEFAULT_OPTIONS } from './define'
import { AuthScreen, HomeScreen } from './route.app'
import Modal from './route.modal'
import AuthComponent from './component.auth'

const AuthNavigator = StackNavigator({
  ...AuthScreen
}, STACKNAVIGATOR_DEFAULT_OPTIONS)

const AppNavigator = DrawerNavigator({
  Drawer: { screen: StackNavigator({
    ...HomeScreen
  }, STACKNAVIGATOR_DEFAULT_OPTIONS)}
}, DRAWER_DEFAULT_OPTIONS)

const ModalContainerNavigator = StackNavigator({
  BaseScreen: { screen: AppNavigator },
  ...Modal.ModalScreen
}, MODAL_DEFAULT_OPTIONS)

export default SwitchNavigator({
  AuthLoading: AuthComponent,
  App: ModalContainerNavigator,
  Auth: AuthNavigator,
}, { initialRouteName: 'AuthLoading' })



