import React, { PureComponent } from 'react'
import { View, Animated, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'

import { Screen } from '../../../utils' 
import { application } from '../../../redux/actions'
import { FormattedMessage } from 'react-intl';

const { width } = Screen.window

const BUTTON_WIDTH = 88

export default connect(state => ({ 
  core_mode: state.application.core_mode,
  status: state.booking.status,
  hidden: (state.booking.status >= 1) || (state.driver.working)
}))(class NavigationBarSwipe extends PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      index: new Animated.Value(props.core_mode === 'driver' ? 0 : 1)
    }
  }

  onPress(index) {
    this.props.dispatch(application.setCoreMode(index === 0 ? 'driver' : 'passenger'))
    Animated.timing(this.state.index, { duration: 200, toValue: index, useNativeDriver: true }).start()
  }

  render() {
    const { index } = this.state
    const { hidden } = this.props
    const translateX = index.interpolate({ inputRange: [0, 1], outputRange: [0, 88] })
    const opacity_0 = index.interpolate({ inputRange: [0, 1], outputRange: [1, .4] })
    const opacity_1 = index.interpolate({ inputRange: [0, 1], outputRange: [.4, 1] })

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
                <Animated.Text style={{ fontWeight: '600', color: 'white', opacity: opacity_0 }}>
                  <FormattedMessage id={'driver'} />
                </Animated.Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => this.onPress(1)} 
                activeOpacity={1} 
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: 44, flexDirection: 'row' }}
              >
                <FormattedMessage id={'passenger'} >
                  {
                    msg => (
                      <Animated.Text style={{ fontWeight: '600', color: 'white', opacity: opacity_1 }}>{msg}</Animated.Text>
                    )
                  }                
                </FormattedMessage>                
              </TouchableOpacity>
            </View>
          )
        }
      </View>
    )
  }
})