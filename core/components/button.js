import React, { Component, PureComponent } from 'react'
import { Animated, StyleSheet, TouchableOpacity, TouchableHighlight, TouchableNativeFeedback, Platform, View } from 'react-native'


export default class Button extends PureComponent {

  /* TODO: ADD PROPS TYPE */

  render() {
    const { props } = this

    return Platform.select({
      ios: props.underlayColor ? (
        <TouchableHighlight {...props} style={[ styles.buttonWrap, props.style ]} activeOpacity={0.7}>
          {props.children}
        </TouchableHighlight>
      ) : (
        <TouchableOpacity {...props} style={[ styles.buttonWrap, props.style ]} activeOpacity={0.7}>
          {props.children}
        </TouchableOpacity>
      ),
      android: ( // TODO: Fix Android
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