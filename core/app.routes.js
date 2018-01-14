
/* eslint-disable */
import React, { Component, PureComponent } from 'react'
import { StackNavigator, TabNavigator, DrawerNavigator } from 'react-navigation'

/*****************************************************************************************************/
import MainScreen from './route/main'



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
    headerBackTitle: null
  }
}

const HomeNavigator = DrawerNavigator({
  Drawer: { screen: StackNavigator({ 
    Main: { screen: MainScreen }
  }, defaultStackOptions)}
})

const LoginNavigator = StackNavigator({
  Login: { screen: LoginScreen }
})

export {
  HomeNavigator,
  LoginNavigator
}