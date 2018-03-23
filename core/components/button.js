import React, { Component, PureComponent } from 'react'
import { Animated, StyleSheet, TouchableOpacity, TouchableHighlight, TouchableNativeFeedback, Platform, View } from 'react-native'


export default class Button extends PureComponent {

  /* TODO: ADD PROPS TYPE */

  render() {
    const { props } = this

    return Platform.select({
      ios: props.underlayColor ? (
        <TouchableHighlight activeOpacity={0.7} {...props} style={[ styles.buttonWrap, props.style ]}>
          {props.children}
        </TouchableHighlight>
      ) : (
        <TouchableOpacity activeOpacity={0.7} {...props} style={[ styles.buttonWrap, props.style ]} >
          {props.children}
        </TouchableOpacity>
      ),
      android: ( // TODO: Fix Android
        <TouchableOpacity activeOpacity={0.7} {...props} style={[ styles.buttonWrap, props.style ]}>
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