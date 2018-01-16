import React, { Component, PureComponent } from 'react'
import { Animated, StyleSheet, TouchableOpacity, TouchableHighlight, TouchableNativeFeedback, Platform } from 'react-native'


export default class Button extends PureComponent {

  /* TODO: ADD PROPS TYPE */

  render() {
    const { props } = this

    return Platform.select({
      ios: (
        <TouchableOpacity {...props} style={[ styles.buttonWrap, props.style ]} activeOpacity={0.7}>
          {props.children}
        </TouchableOpacity>
      ),
      android: (
        <TouchableOpacity {...props} style={[ styles.buttonWrap, props.style ]} activeOpacity={0.7}>
          {props.children}
        </TouchableOpacity>
      )
    })
  }
}

const styles = StyleSheet.create({
  buttonWrap: Object.assign({}, {
    alignItems: 'center',
    justifyContent: 'center'
  }, Platform.select({
    ios: {
      
    },
    android: {

    }
  }))
})