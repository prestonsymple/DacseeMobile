/**
 * Created by Rabbit on 2018/4/12.
 */

import React, { PureComponent } from 'react'
import {View, Animated, TouchableOpacity, DeviceEventEmitter} from 'react-native'
import { connect } from 'react-redux'

import { Screen } from '../../../utils'
import { application } from '../../../redux/actions'

const { width } = Screen.window

const BUTTON_WIDTH = 88

export default class NavigationBarSwipe extends PureComponent {

  constructor(props) {
    super(props)
    const index = this.props.index
    this.state = {
      value: new Animated.Value(index),
    }
  }

  componentWillReceiveProps(nextProps) {

    Animated.timing(this.state.value, { duration: 200, toValue: nextProps.index, useNativeDriver: true }).start()
  }

  onPress = (index) => {

    Animated.timing(this.state.value, { duration: 200, toValue: index, useNativeDriver: true }).start()

    this.props.onPress(index)
  }

  render() {
    const { value } = this.state
    const { hidden, i18n } = this.props
    const translateX = value.interpolate({ inputRange: [0, 1], outputRange: [0, 88] })
    const opacity_0 = value.interpolate({ inputRange: [0, 1], outputRange: [1, .4] })
    const opacity_1 = value.interpolate({ inputRange: [0, 1], outputRange: [.4, 1] })
    const titles = this.props.titles

    /** TODO 标题文字是没有国际化的，之后需要将titles[0]改成 i18[titles[0]] */
    return (
      <View style={{ backgroundColor: '#1AB2FD', width, alignItems: 'center', height: hidden ? 0 : 50 }}>
        {
          (true) && (
            <View style={{ backgroundColor: '#0e618a', flexDirection: 'row', width: BUTTON_WIDTH * 2, borderRadius: 22 }}>
              <Animated.View style={[
                { transform: [{ translateX }] },
                { position: 'absolute', left: 0, height: 44, borderRadius: 22, width: BUTTON_WIDTH, backgroundColor: '#ffb639' }
              ]} />

              <TouchableOpacity
                onPress={() => this.onPress(0)}
                activeOpacity={1}
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: 44, flexDirection: 'row' }}
              >
                <Animated.Text style={{ fontWeight: '600', color: 'white', opacity: opacity_0 }}>{ titles[0] }</Animated.Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.onPress(1)}
                activeOpacity={1}
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: 44, flexDirection: 'row' }}
              >
                <Animated.Text style={{ fontWeight: '600', color: 'white', opacity: opacity_1 }}>{ titles[1] }</Animated.Text>
              </TouchableOpacity>
            </View>
          )
        }
      </View>
    )
  }
}