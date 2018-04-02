import React, { Component, PureComponent } from 'react'
import * as Progress from 'react-native-progress'
import {
  View, Animated, StyleSheet, TouchableOpacity, TouchableHighlight, TouchableNativeFeedback,
  Platform, ProgressViewIOS, ScrollView, Text, Image
} from 'react-native'

import { Screen, Icons, Redux ,TextFont} from '../utils'
import { Button } from '../components'
const { height, width } = Screen.window


const styles = StyleSheet.create({
  pageWrap: { width: width - 30, paddingHorizontal: 30, flexDirection: 'row', justifyContent: 'space-between' },
  itemWrap: { alignItems: 'center', justifyContent: 'center' },
  itemTitle: { color: '#666', fontSize: TextFont.TextSize(14), fontWeight: '100', marginBottom: 8 },
  itemImageContent: { marginHorizontal: 6, width: 68, height: 68, borderRadius: 33, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderWidth: 3 },
  itemImage: { opacity: 0.7, width: 66, height: 66, borderRadius: 33, borderWidth: 1.5, borderColor: 'white', resizeMode: 'cover' }
})
// "contain" | "cover" | "stretch" | "center" | "repeat";

export default class SelectCarType extends PureComponent {

  /* TODO: ADD PROPS TYPE */

  constructor(props) {
    super(props)
    this.page = new Animated.Value(0)
    this.checkGroups = props.data.map(pipe => new Animated.Value(0))
  }

  componentWillReceiveProps(props) {
    this.checkGroups = props.data.map(pipe => new Animated.Value(0))
  }

  _onPressButton(index, item) {
    const animateArgs = this
      .checkGroups
      .map(pipe => {
        pipe.stopAnimation()
        return pipe
      })
      .filter((_, i) => index !== i && _._value !== 0)
      .map(pipe => Animated.timing(pipe, { toValue: 0, duration: 200 }))
    Animated.parallel(animateArgs).start()
    Animated.timing(this.checkGroups[index], { toValue: 1, duration: 300 }).start()
  }

  render() {
    const { props } = this
    const { data, style } = props
    const wrapWidth = width - 30
    let n = 0

    return (
      <Animated.View style={[{ flex: 1 }, style]}>
        {/* */}
        <ScrollView
          pagingEnabled={true}
          onScroll={({ nativeEvent }) => {
            const { contentInset, contentOffset, contentSize, layoutMeasurement, velocity, zoomScale } = nativeEvent
            if (contentOffset.x < 0) return
            this.page.setValue(contentOffset.x)
          }}
          scrollEventThrottle={(width - 30) / 15}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ height: 124, justifyContent: 'center', alignItems: 'center' }}
          style={{ }}
        >
          {/* {
            data.map((wrap, index) => {
              return (<View key={`k_${index}`} style={styles.pageWrap}>
                {
                  wrap.map((item) => {
                    const view = (
                      <Button onPress={this._onPressButton.bind(this, n, item)} key={item.key} style={styles.itemWrap}>
                        <Text style={styles.itemTitle}>{ item.title }</Text>
                        <Animated.View style={[styles.itemImageContent, {
                          borderColor: this.checkGroups[n++].interpolate({
                            inputRange: [0, 1],
                            outputRange: ['#DDDDDD', '#FEA81C']
                          })
                        }]}>
                          <Animated.Image style={styles.itemImage} source={{ uri: item.image }} />
                        </Animated.View>
                      </Button>
                    )
                    return view
                  })
                }
              </View>)
            })
          } */}


          {
            data.map((item, index) => {
              const view = (
                <Button onPress={this._onPressButton.bind(this, n, item)} key={item.key} style={styles.itemWrap}>
                  <Text style={styles.itemTitle}>{ item.title }</Text>
                  <Animated.View style={[styles.itemImageContent, {
                    borderColor: this.checkGroups[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: ['#DDDDDD', '#FEA81C']
                    })
                  }]}>
                    <Animated.Image style={styles.itemImage} source={{ uri: item.image }} />
                  </Animated.View>
                </Button>
              )
              return view
            })
          }
        </ScrollView>
        {/**/}
        {/* <View style={{ width: width - 30, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: 30, height: 2, flexDirection: 'row', alignItems: 'center' }}>
            <Animated.View style={[
              { height: 2, marginHorizontal: 1 },
              { backgroundColor: this.page.interpolate({
                inputRange: [0, wrapWidth, wrapWidth * 2],
                outputRange: ['#FEA81C', '#ddd', '#ddd']
              })},
              { width: this.page.interpolate({
                  inputRange: [0, wrapWidth, wrapWidth * 2],
                  outputRange: [10, 6, 6]
              })}
            ]} />
            <Animated.View style={[
              { height: 2, marginHorizontal: 1 },
              { backgroundColor: this.page.interpolate({
                inputRange: [0, wrapWidth, wrapWidth * 2],
                outputRange: ['#ddd', '#FEA81C', '#ddd']
              })},
              { width: this.page.interpolate({
                  inputRange: [0, wrapWidth, wrapWidth * 2],
                  outputRange: [6, 10, 6]
              })}
            ]} />
            <Animated.View style={[
              { height: 2, marginHorizontal: 1 },
              { backgroundColor: this.page.interpolate({
                inputRange: [0, wrapWidth, wrapWidth * 2],
                outputRange: ['#ddd', '#ddd', '#FEA81C']
              })},
              { width: this.page.interpolate({
                inputRange: [0, wrapWidth, wrapWidth * 2],
                outputRange: [6, 6, 10]
              })}
            ]} />
          </View>
        </View> */}
      </Animated.View>
    )
  }
}

