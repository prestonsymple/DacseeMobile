import React, { Component, PureComponent } from 'react'
import * as Progress from 'react-native-progress'
import { View, Animated, StyleSheet, TouchableOpacity, TouchableHighlight, TouchableNativeFeedback, Platform, ProgressViewIOS } from 'react-native'


export default class ProgressView extends PureComponent {

  /* TODO: ADD PROPS TYPE */

  render() {
    const { props } = this

    return Platform.select({
      ios: (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' }}>
          <View style={[
            { width: 88, height: 88, borderRadius: 4, backgroundColor: '#FFFFFFEE', justifyContent: 'center', alignItems: 'center' },
            { shadowOffset: { width: 0, height: 2 }, shadowColor: '#666', shadowOpacity: .3, shadowRadius: 3 },
          ]}>
            <Progress.Circle 
              size={50}
              color={'#666666EE'} 
              indeterminate={true} 
              // borderRadius={4}
              // animationType={'decay'}
              // borderColor={'transparent'}
              {...props}
              style={[ styles.progress ]} />
          </View>
        </View>
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
  progress: Object.assign({}, {
  }, Platform.select({
    ios: {
      
    },
    android: {

    }
  }))
})