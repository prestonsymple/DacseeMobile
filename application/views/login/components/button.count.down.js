import React, { Component } from 'react'
import { Animated, Text, StyleSheet, TouchableOpacity, View } from 'react-native'


export default class CountDownButton extends Component {
  constructor(props) {
    super(props)
    this.state = {
      time: 30,
      started: false
    }
  }
  componentDidMount() {
    if(!this.props.stop){
      this.startInterval()
    }
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.stop){
      this.resetInterval()
    }
  }
  resetInterval(){
    this.timer && clearInterval(this.timer)
    this.setState({ started: false , time: 30})
  }
  startInterval() {
    this.setState({ started: true })
    this.timer = setInterval(() => {
      if (this.state.time === 0) {
        this.timer && clearInterval(this.timer)
        this.setState({ started: false , time: 30})
      }
      this.setState({ time: this.state.time - 1 })
    }, 1000)
  }
  startCountDown = async () => {
    if (!this.state.started) {
      let status=await this.props.sendCode()
      if(status){
        this.startInterval()
      }
    }
  }
  componentWillUnmount() {
    this.timer && clearInterval(this.timer)
  }
  render() {
    const { show, style, i18n } = this.props
    const { time, started } = this.state
    return (
      <TouchableOpacity activeOpacity={started?1:.9} onPress={this.startCountDown} style={[styles.buttonWrap, style]} >
        <Text style={{ textAlign: 'center', fontSize: 15, fontWeight: '600', color: 'white'}}>{started ? `${this.state.time} ${i18n.seconds_later}` : i18n.send_code}</Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  buttonWrap: {
    alignItems: 'center',
    justifyContent: 'center'
  }
})