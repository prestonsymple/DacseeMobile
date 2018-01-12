
/* eslint-disable */
import React, { Component, PureComponent } from 'react'
import { StackNavigator, TabNavigator, DrawerNavigator } from 'react-navigation'

/*****************************************************************************************************/
import MainScreen from './route/main/index'
/*****************************************************************************************************/

const AppNavigator = DrawerNavigator({
  DrawerScreen: { 
    screen: StackNavigator({ 
      MainScreen: { screen: MainScreen }
    })
  }
})

export {
  AppNavigator
}