
/* eslint-disable */
import React, { Component, PureComponent } from 'react'
import { View } from 'react-native'
import { StackNavigator, TabNavigator, DrawerNavigator } from 'react-navigation'

/*****************************************************************************************************/
import MainScreen from './route/main'
import DrawerContent from './route/main/drawer'


import LoginScreen from './route/login'
/*****************************************************************************************************/

const defaultStackOptions = {
  navigationOptions: {
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
    Main: { screen: MainScreen }
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