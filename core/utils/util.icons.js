/* eslint-disable */
import React, { Component } from 'react'
import Material from 'react-native-vector-icons/MaterialIcons'
import Ion from 'react-native-vector-icons/Ionicons'
import Awesome from 'react-native-vector-icons/FontAwesome'
/* eslint-enable */

export default {
  /***
  ****  icons generator
  ***/
  Generator: {
    Material: (name, size = 20, color = '#fff', setter = {}) => {
      return (<Material name={name} size={size} color={color} {...setter} />)
    },
    Ion: (name, size = 20, color = '#fff', setter = {}) => {
      return (<Ion name={name} size={size} color={color} {...setter} />)
    },
    Awesome: (name, size = 20, color = '#fff', setter = {}) => {
      return (<Awesome name={name} size={size} color={color} {...setter} />)
    },
  }
}
