
import React from 'react'
import { TouchableOpacity, Platform } from 'react-native'
import { Icons } from '../utils'

const _HEADER_BACK_BUTTON = (navigation) => (
  <TouchableOpacity 
    activeOpacity={0.7} 
    style={{ top: 1, width: 54, paddingLeft: 8, justifyContent: 'center', alignItems: 'flex-start' }} 
    onPress={() => navigation.goBack()}
  >
    { Icons.Generator.Material('keyboard-arrow-left', 30, 'white') }
  </TouchableOpacity>
)

const STACKNAVIGATOR_DEFAULT_OPTIONS = {
  navigationOptions: ({ navigation }) => {
    let options = {
      headerStyle: {
        backgroundColor: '#1AB2FD',
        shadowColor: 'transparent',
        shadowOpacity: 0,
        borderBottomWidth: Platform.select({ ios: .6, android: .5 }),
        borderBottomColor: '#eee',
        elevation: 0,
      },
      headerTintColor: 'white',
      headerBackTitle: null,
    }
    if (!('index' in navigation.state)) options = Object.assign(options, {
      headerLeft: _HEADER_BACK_BUTTON(navigation)
    })
    return options
  }
}

import DrawerContent from './component.drawer'
const DRAWER_DEFAULT_OPTIONS = {
  drawerOpenRoute: 'DrawerOpen',
  drawerCloseRoute: 'DrawerClose',
  drawerToggleRoute: 'DrawerToggle',
  initialRouteName: 'Drawer',
  contentComponent: DrawerContent,
  contentOptions: {
    activeTintColor: '#e91e63',
  }
}

const MODAL_DEFAULT_OPTIONS = { 
  mode: 'modal', headerMode: 'none' 
}

export {
  STACKNAVIGATOR_DEFAULT_OPTIONS,
  DRAWER_DEFAULT_OPTIONS,
  MODAL_DEFAULT_OPTIONS
}