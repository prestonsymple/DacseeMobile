
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
      // borderBottomWidth: 0,
      borderBottomColor: '#c8c8c8',
      elevation: 0,
    },
    headerTintColor: '#333',
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