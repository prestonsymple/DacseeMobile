
/* eslint-disable */
import React, { Component, PureComponent } from 'react'
import { StackNavigator, TabNavigator, DrawerNavigator } from 'react-navigation'

/*****************************************************************************************************/
import MainScreen from './route/main/index'
/*****************************************************************************************************/

const defaultStackOptions = {
  navigationOptions: {
    headerStyle: {
      backgroundColor: 'white',
      shadowColor: 'transparent',
      shadowOpacity: 0,
      borderBottomWidth: 0,
      elevation: 0,
    },
    headerTintColor: 'white',
    headerBackTitle: null
  }
}

const AppNavigator = DrawerNavigator({
  DrawerScreen: { 
    screen: StackNavigator({ 
      MainScreen: { screen: MainScreen }
    }, defaultStackOptions)
  }
})

export {
  AppNavigator
}