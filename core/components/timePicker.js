import React, { Component, PureComponent } from 'react'
import { Text, View, TouchableOpacity, Modal } from 'react-native'
import {
  Screen, Icons, Define
} from '../utils'
import Wheel from './Wheel'
import _ from 'lodash'
const { height, width } = Screen.window


export default class TimePicker extends PureComponent {
  constructor(props) {
    super(props)
    this.dates = [this.getDateStr(0), this.getDateStr(1), this.getDateStr(2)]
    // this.hours = ['0点', '1点', '2点', '3点','4点', '5点', '6点', '7点', '8点', '9点', '10点', '11点', '12点','13点','14点','15点','16点','17点','18点','19点','20点','21点','22点','23点']
    // this.minutes = ['0分','10分','20分','30分','40分','50分']
    this.hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
    this.minutes = [0, 10, 20, 30, 40, 50]
    this.date = this.getDateStr(0)
    this.hour = this.getDafultHours()[0]
    this.minute = this.getDafultMinutes()[0]
    this.state = {
      showTP: this.props.showTP,
      hours: this.getDafultHours(),
      minutes: this.getDafultMinutes(),
      date: '',
    }
  }
  componentWillReceiveProps(props) {
    if (props.showTP != this.props.showTP) {
      this.setState({ showTP: props.showTP })
    }
  }
  //获取今天前后n天的日期
  getDateStr(n) {
    let date = new Date()
    date.setDate(date.getDate() + n)//获取n天后的日期
    let w = ''
    let day = date.getDay()
    // let y = date.getFullYear()
    let m = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)//获取当前月份的日期，不足10补0
    let d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()//获取当前几号，不足10补0
    switch (day) {
    case 0:
      w = '星期日'
      break
    case 1:
      w = '星期一'
      break
    case 2:
      w = '星期二'
      break
    case 3:
      w = '星期三'
      break
    case 4:
      w = '星期四'
      break
    case 5:
      w = '星期五'
      break
    case 6:
      w = '星期六'
      break
    }
    return m + '月' + d + '日 ' + w
  }
  getDafultHours() {
    let HM = this.getNowHM()
    let nowHour = HM.hour
    // let nowMinute = HM.minute
    let index = _.findIndex(this.hours, function (chr) {
      return chr == nowHour
    })
    return _.drop(this.hours, index)
  }
  getDafultMinutes() {
    let HM = this.getNowHM()
    // let nowHour = HM.hour
    let nowMinute = HM.minute
    let index = _.findIndex(this.minutes, function (chr) {
      return chr == nowMinute
    })
    return _.drop(this.minutes, index)
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
  onDateChange(index) {
    let date = this.dates[index]
    let HM = this.getNowHM()
    let nowHour = HM.hour
    let nowMinute = HM.minute
    if (date == this.dates[0]) {
      let index = _.findIndex(this.hours, function (chr) {
        return chr == nowHour
      })
      this.setState({ hours: _.drop(this.hours, index) })
      if (this.hour == nowHour) {
        let index = _.findIndex(this.minutes, function (chr) {
          return chr == nowMinute
        })
        this.setState({ minutes: _.drop(this.minutes, index) })
      }
    }
    if (this.date == this.dates[0]) {
      this.setState({ hours: this.hours })
      if (this.hour == nowHour) {
        this.setState({ minutes: this.minutes })
      }
    }
    this.date = date
  }
  onHourChange(index) {
    let hour = this.state.hours[index]
    let HM = this.getNowHM()
    let nowHour = HM.hour
    let nowMinute = HM.minute
    if (this.date == this.dates[0] && hour == nowHour) {
      let index = _.findIndex(this.minutes, function (chr) {
        return chr == nowMinute
      })
      this.setState({ minutes: _.drop(this.minutes, index) })
    }
    if (this.date == this.dates[0] && this.hour == nowHour) {

      this.setState({ minutes: this.minutes })
    }
    this.hour = hour
  }
  onMinuteChange(index) {
    this.minute = this.state.minutes[index]
  }
  render() {
    return (
      <Modal
        animationType='fade'           //渐变
        transparent={true}             // 不透明
        visible={this.state.showTP}    // 根据isModal决定是否显示
        onRequestClose={() => this.setState({ showTP: false })}  // android必须实现 安卓返回键调用
      >
        <View style={{ width: width, height: height, backgroundColor: 'rgba(57, 56, 67, 0.2)' }}>
          <TouchableOpacity style={{ width: width, height: height / 2 }} onPress={() => this.setState({ showTP: false })} ></TouchableOpacity>
          <View style={{ height: height / 2, backgroundColor: '#fff', paddingBottom: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 0.5, borderBottomColor: '#ccc', alignItems: 'center', width: width, height: 50 }}>
              <TouchableOpacity style={{ height: 50, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' }} onPress={() => this.setState({ showTP: false })} >
                <Text style={{ color: '#1ab2fd', fontSize: 15 }}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ height: 50, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' }} onPress={() => this.setState({ showTP: false })} >
                <Text style={{ color: '#ffa03c', fontSize: 15 }}>确定</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: width, }}>
              <Wheel
                style={{ height: (height / 2) - 80, width: width / 2 }}
                itemStyle={{ textAlign: 'center' }}
                items={this.dates}
                onChange={index => this.onDateChange(index)}
              />
              <Wheel
                style={{ height: (height / 2) - 80, width: width / 4 }}
                itemStyle={{ textAlign: 'center' }}
                type={'h'}
                items={this.state.hours}
                onChange={index => this.onHourChange(index)}
              />
              <Wheel
                style={{ height: (height / 2) - 80, width: width / 4 }}
                itemStyle={{ textAlign: 'center' }}
                type={'m'}
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
