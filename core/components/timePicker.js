import React, { Component, PureComponent } from 'react'
import { Text, View, TouchableOpacity, Modal,PixelRatio } from 'react-native'
import {
  Screen, Icons, Define,TextFont
} from '../utils'
import Wheel from './Wheel'
import _ from 'lodash'
const { height, width } = Screen.window
const pixelSize = (function() {
  let pixelRatio = PixelRatio.get()
  if (pixelRatio >= 3) return 0.333
  else if (pixelRatio >= 2) return 0.5
  else return 1
})()
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
      hours: this.hours,
      minutes: this.minutes,
      date: '',
    }
  }
  componentDidMount(){
    this.setState({
      hours: this.getDafultHours(),
      minutes: this.getDafultMinutes(),
    })
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
    return this.getDropedDate(this.hours,nowHour)
  }
  getDafultMinutes() {
    let HM = this.getNowHM()
    // let nowHour = HM.hour
    let nowMinute = HM.minute
    return this.getDropedDate(this.minutes,nowMinute)
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
  getDropedDate(data,pa){
    let index = _.findIndex(data, function (chr) {
      return chr == pa
    })
    return _.drop(data, index)
  }
  onDateChange(index) {

    let date = this.dates[index]
    let HM = this.getNowHM()
    let nowHour = HM.hour
    let nowMinute = HM.minute
    if (date == this.dates[0]&&this.date!=date) {
      setTimeout(()=>{
        this.setState({ hours: this.getDropedDate(this.hours,nowHour) },()=>{
          this.hour=this.state.hours[0]
        })
        if (this.hour == nowHour) {
          this.setState({ minutes:this.getDropedDate(this.minutes,nowMinute) },()=>{
            this.minute=this.state.minutes[0]
          })
        }
      },0)

    }
    if (this.date == this.dates[0]&&date!= this.dates[0]){
      this.setState({ hours: this.hours })
      if (this.hour == nowHour) {
        this.setState({ minutes: this.minutes })
      }
    }
    this.date = date
  }
  onHourChange(index) {
    this.hindex=index
    let hour = this.state.hours[index]
    let HM = this.getNowHM()
    let nowHour = HM.hour
    let nowMinute = HM.minute
    if (this.date == this.dates[0] && hour == nowHour) {
      this.hour = hour
      this.setState({ minutes:this.getDropedDate(this.minutes,nowMinute) },()=>{
        this.minute=this.state.minutes[0]
      })
    }
    if (this.date == this.dates[0] && this.hour == nowHour&&hour!=nowHour) {
      this.hour = hour
      this.setState({ minutes: this.minutes })
    }
    this.hour = hour
  }
  onMinuteChange(index) {
    this.mindex=index
    this.minute = this.state.minutes[index]
  }
  //

  render() {
    let modalHeight = Define.system.ios.x ?  242 + 22 : 242
    let weelHeight=modalHeight- 70
    return (
      <Modal
        animationType='fade'           //渐变
        transparent={true}             // 不透明
        visible={this.props.visible}    // 根据isModal决定是否显示
        onRequestClose={() => this.props.wheelCancel('now')}  // android必须实现 安卓返回键调用
      >
        <View style={{ width: width, height: height, backgroundColor: 'rgba(57, 56, 67, 0.2)' }}>
          <TouchableOpacity style={{ width: width, height: height -modalHeight }} onPress={() => this.props.wheelCancel('now')} ></TouchableOpacity>
          <View style={{ height:modalHeight, backgroundColor: '#fff', paddingBottom: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: pixelSize, borderBottomColor: '#ccc', alignItems: 'center', width: width, height: 50 }}>
              <TouchableOpacity style={{ height: 50, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' }} onPress={()=>this.props.wheelCancel('now')} >
                <Text style={{ color: '#1ab2fd', fontSize: TextFont.TextSize(15) }}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ height: 50, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' }} onPress={()=>this.props.wheelSubmit(this.date+this.hour+'点'+this.minute+'分')} >
                <Text style={{ color: '#ffa03c', fontSize: TextFont.TextSize(15) }}>确定</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: width,height: weelHeight }}>
              <Wheel
                style={{ height: weelHeight, width: width / 2 }}
                itemStyle={{ textAlign: 'center' }}
                items={this.dates}
                onChange={index => this.onDateChange(index)}
              />
              <Wheel
                style={{ height: weelHeight, width: width / 4 }}
                itemStyle={{ textAlign: 'center' }}
                index={this.state.hours.indexOf(this.hour)}
                type={'h'}
                items={this.state.hours}
                onChange={index => this.onHourChange(index)}
              />
              <Wheel
                style={{ height: weelHeight, width: width / 4 }}
                itemStyle={{ textAlign: 'center' }}
                type={'m'}
                index={this.state.minutes.indexOf(this.minute)}
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
