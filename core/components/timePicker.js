import React, { Component, PureComponent } from 'react'
import { Text, View, TouchableOpacity, Modal, PixelRatio } from 'react-native'
import {
  Screen, Icons, Define, TextFont
} from '../utils'
import Wheel from './Wheel'
import _ from 'lodash'
import moment from 'moment'
const { height, width } = Screen.window
const pixelSize = 0.6
export default class TimePicker extends PureComponent {
  constructor(props) {
    super(props)
    this.days = [this.getDateStr(0), this.getDateStr(1), this.getDateStr(2)]
    // this.hours = ['0点', '1点', '2点', '3点','4点', '5点', '6点', '7点', '8点', '9点', '10点', '11点', '12点','13点','14点','15点','16点','17点','18点','19点','20点','21点','22点','23点']
    // this.minutes = ['0分','10分','20分','30分','40分','50分']
    this.hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
    this.minutes = [0, 10, 20, 30, 40, 50]

    this.state = {
      hours: this.hours,
      minutes: this.minutes,
      day: this.getDateStr(0),
      hour: this.getDafultHours()[0],
      minute: this.getDafultMinutes()[0],
    }
  }
  componentDidMount() {
    this.setState({
      hours: this.getDafultHours(),
      minutes: this.getDafultMinutes(),
    })
  }


  //获取今天前后n天的日期
  getDateStr(n) {
    let date = new Date()
    date.setDate(date.getDate() + n)//获取n天后的日期
    return moment(date).format('MMM DD ddd')
  }
  getYear(day) {
    let index = _.findIndex(this.days, function (chr) {
      return chr == day
    })
    let date = new Date()
    date.setDate(date.getDate() + index)
    return moment(date).format('YYYY-MM-DD')
  }
  getDafultHours() {
    let HM = this.getNowHM()
    let nowHour = HM.hour
    // let nowMinute = HM.minute
    return this.getDropedDate(this.hours, nowHour)
  }
  getDafultMinutes() {
    let HM = this.getNowHM()
    // let nowHour = HM.hour
    let nowMinute = HM.minute
    return this.getDropedDate(this.minutes, nowMinute)
  }
  getNowHM() {
    let json = {}
    let timestamp = new Date().valueOf()
    let date = new Date(timestamp + 30 * 60 * 1000)
    let h = date.getHours()
    let m = date.getMinutes()

    if (m % 10 > 0) {
      m = (parseInt(m / 10) + 1) * 10
      if (m == 60) {
        h += 1
        m = 0
      }
    } else { m = parseInt(m / 10) * 10 }
    json.hour = h
    json.minute = m
    return json
  }
  getDropedDate(data, pa) {
    let index = _.findIndex(data, function (chr) {
      return chr == pa
    })
    return _.drop(data, index)
  }
  onDayChange(index) {
    let day = this.days[index]
    let HM = this.getNowHM()
    let nowHour = HM.hour
    let nowMinute = HM.minute
    if (this.state.day == this.days[0] && day != this.days[0]) {
      this.setState({ hours: this.hours })
      if (this.state.hour == nowHour) {
        this.setState({ minutes: this.minutes })
      }
    }
    if (day == this.days[0] && this.state.day != day) {
      
      let hours = this.getDropedDate(this.hours, nowHour)
      this.setState({ hours: hours, hour: hours[0] })
      if (this.state.hour == nowHour) {
        let minutes = this.getDropedDate(this.minutes, nowMinute)
        this.setState({ minutes: minutes, minute: minutes[0] })
      }
    }
    this.setState({ day: day })
  }
  onHourChange(index) {
    let hour = this.state.hours[index]
    let HM = this.getNowHM()
    let nowHour = HM.hour
    let nowMinute = HM.minute
    if (this.state.day == this.days[0] && hour == nowHour) {
      let minutes = this.getDropedDate(this.minutes, nowMinute)
      this.setState({ minutes: minutes, hour: hour, minute: minutes[0] })
    }
    if (this.state.day == this.days[0] && this.hour == nowHour && hour != nowHour) {
      this.setState({ hour: hour, minutes: this.minutes })
    }
    this.setState({ hour: hour })
  }
  onMinuteChange(index) {
    this.setState({ minute: this.state.minutes[index] })
  }
  //

  render() {
    let modalHeight = Define.system.ios.x ? 266 + 22 : 266
    let weelHeight = modalHeight - 70
    return (
      <Modal
        animationType='fade'           //渐变
        transparent={true}             // 不透明
        visible={this.props.visible}    // 根据isModal决定是否显示
        onRequestClose={() => this.props.dateChange('now')}  // android必须实现 安卓返回键调用
      >
        <View style={{ width: width, height: height, backgroundColor: 'rgba(57, 56, 67, 0.2)' }}>
          <View style={{ width: width, height: height - modalHeight }}></View>
          <View style={{ height: modalHeight, backgroundColor: '#fff', paddingBottom: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: pixelSize, borderBottomColor: '#ccc', alignItems: 'center', width: width, height: 50 }}>
              <TouchableOpacity style={{ height: 50, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' }} onPress={() => this.props.dateChange('now')} >
                <Text style={{ color: '#1ab2fd', fontSize: TextFont.TextSize(15) }}>{this.props.i18n.cancel}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ height: 50, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' }}
                onPress={() => this.props.dateChange(moment(`${this.getYear(this.state.day)} ${this.state.hour}:${this.state.minute}`).toISOString())} >
                <Text style={{ color: '#ffa03c', fontSize: TextFont.TextSize(15) }}>{this.props.i18n.confirm}</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: width, height: weelHeight }}>
              <Wheel
                style={{ height: weelHeight, width: width / 2 }}
                itemStyle={{ textAlign: 'center' }}
                items={this.days}
                onChange={index => this.onDayChange(index)}
              />
              <Wheel
                style={{ height: weelHeight, width: width / 4 }}
                itemStyle={{ textAlign: 'center' }}
                index={this.state.hours.indexOf(this.state.hour)}
                type={'h'}
                items={this.state.hours}
                onChange={index => this.onHourChange(index)}
              />
              <Wheel
                style={{ height: weelHeight, width: width / 4 }}
                itemStyle={{ textAlign: 'center' }}
                type={'m'}
                index={this.state.minutes.indexOf(this.state.minute)}
                items={this.state.minutes}
                onChange={index => this.onMinuteChange(index)}
              />
            </View>
          </View>
        </View>
      </Modal>
    )
  }
}
