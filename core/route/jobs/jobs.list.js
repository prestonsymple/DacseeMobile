import React, { Component, PureComponent } from 'react'
import { 
  Text, View, Animated, StyleSheet, StatusBar, Image, TouchableOpacity, TouchableHighlight, 
  DeviceEventEmitter, TextInput, Easing, ListView, ScrollView, RefreshControl
} from 'react-native'
import InteractionManager from 'InteractionManager'
import { NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'
import { Calendar, CalendarList, Agenda, LocaleConfig } from 'react-native-calendars'
import moment from 'moment'

import { Screen, Icons, Redux, Define, System, Session } from '../../utils'
import { Button } from '../../components'
import Resources from '../../resources'
import { application, booking } from '../../redux/actions'

const {height, width} = Screen.window

const styles = StyleSheet.create({
  pageWrap: { width: width, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white' },
  itemWrap: { alignItems: 'center', justifyContent: 'center' },
  itemTitle: { color: '#666', fontSize: 14, fontWeight: '100', marginBottom: 8 },
  itemImageContent: { marginHorizontal: 6, width: 68, height: 68, borderRadius: 33, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderWidth: 3 },
  itemImage: { opacity: 0.7, width: 66, height: 66, borderRadius: 33, borderWidth: 1.5, borderColor: 'white', resizeMode: 'cover' }
})

// const dataContrast = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

// LocaleConfig.locales['CN'] = {
//   monthNames: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
//   // monthNamesShort: ['Janv.','Févr.','Mars','Avril','Mai','Juin','Juil.','Août','Sept.','Oct.','Nov.','Déc.'],
//   dayNames: ['周一','周二','周三','周四','周五','周六','周日'],
//   // dayNamesShort: ['Dim.','Lun.','Mar.','Mer.','Jeu.','Ven.','Sam.']
// };

// LocaleConfig.defaultLocale = 'CN';

export default connect(() => ({ }))(class JobsListScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      drawerLockMode: 'locked-closed', 
      title: '行程列表'
    }
  }

  constructor(props) {
    super(props)
    const todayUtc = new Date().toISOString()
    
    this.state = {
      dateDic: null,
      loading: false,
      // detail: dataContrast.cloneWithRows([])
      selectedDate: moment(Date.parse(todayUtc)).format('YYYY-MM-D')
    }
  }

  async componentWillMount() {
    await InteractionManager.runAfterInteractions()
    
    // const obj = { dateFrom: new Date().toISOString(), dateTo: new Date().toISOString() }
    // for (var item in obj) {
    //   console.log(item)
    // }

    this._fetchData()
    
  }

  async _fetchData(index=0) {
    this.setState({
      loading: true
    })
    // const resp = await Session.booking.get(`v1/bookings?date_from=2018-03-10T22:59:40.632Z&date_to=${new Date().toISOString()}`)

    try {
      const resp = await Session.booking.get('v1/bookings')
    
      var dateDic = new Object()
      resp.data.map( (item, index) => {
        // console.log(item)
        // console.log(moment(Date.parse(item.booking_at)).format('YYYY-MM-D'))
        const dateStr = moment(Date.parse(item.booking_at)).format('YYYY-MM-D')
        
        // console.log(dateDic[dateStr])
        if (dateDic[dateStr] === undefined) {
          // console.log(item)
          dateDic[dateStr] = Array(item)
        } else {
          dateDic[dateStr].concat(Array(item))
        }
        // dateDic[moment(Date.parse(item.booking_at)).format('YYYY-MM-D')] = [item]
      })
      this.setState({
        dateDic: dateDic,
        loading: false
        // detail: dataContrast.cloneWithRows(resp.data)
      })
    } catch (e) {
      this.props.dispatch(application.showMessage('网络情况差，请重试'))
      this.setState({
        loading: false
        // detail: dataContrast.cloneWithRows(resp.data)
      })
    }    
  }

  render() {
    const { dateDic, selectedDate } = this.state
    // const wrapWidth = width
    // const key = moment(Date.parse(selectedDate)).format('YYYY-MM-D')
    // console.log(key)
    // console.log(dateDic)
    return (  
      <View style={{flex: 1}}>
        {
          dateDic === null ?
            (
              <ScrollView refreshControl={
                <RefreshControl
                  refreshing={this.state.loading}
                  onRefresh={this._fetchData.bind(this)}
                  title={'下拉进行刷新'}
                  colors={['#ffffff']}
                  progressBackgroundColor={'#1c99fb'}
                />
              } contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', height: Screen.safaContent.height - 48 }} style={{ flex: 1 }}>
                <Text style={{ top: -64, color: '#777', fontSize: 15, fontWeight: '400' }}>暂无行程</Text>
              </ScrollView>
            ) :
            (
              <Agenda
                items = { dateDic }
                // items={
                //   {
                //     key: dateDic[key],
                //   }}
                // items={
                //   {'2018-03-11': [DEMO_DATA],
                //     '2018-03-12': [DEMO_DATA, DEMO_DATA],
                //     '2018-03-13': [],
                //     '2018-03-14': [DEMO_DATA],
                //   }}
                // callback that gets called when items for a certain month should be loaded (month became visible)
                loadItemsForMonth={(month) => {
                  // console.log(month)
                }}
                // callback that fires when the calendar is opened or closed
                onCalendarToggled={(calendarOpened) => {
                  // console.log(calendarOpened)
                }}
                // callback that gets called on day press
                onDayPress={(day)=>{
                  // console.log(day)
                  this.setState({
                    selected: day.dateString
                  })
                }}
                // callback that gets called when day changes while scrolling agenda list
                onDayChange={(day)=>{
                  // console.log('day changed')
                }}
                // initially selected day
                selected={selectedDate}
                // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                // minDate={'2018-03-10'}
                // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
                // maxDate={'2018-03-30'}
                // Max amount of months allowed to scroll to the past. Default = 50
                pastScrollRange={50}
                // Max amount of months allowed to scroll to the future. Default = 50
                futureScrollRange={50}
                // specify how each item should be rendered in agenda
                renderItem={(item, firstItemInDay) => {
                  // console.log(firstItemInDay)
                  // console.log(item)
                  return (
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('JobsListDetail', { jobDetail: item })} activeOpacity={.7}><ListItem itemData={item} /></TouchableOpacity>
                  )
                }
                }
                // specify how each date should be rendered. day can be undefined if the item is not first in that day.
                renderDay={(day, item) => {return (<View />);}}
                // specify how empty date content with no items should be rendered
                renderEmptyData={() => {return (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 15, color: '#a5a5a5' }}>今日暂无行程</Text></View>);}}
                // specify how agenda knob should look like
                renderKnob={() => {return (<View>{ Icons.Generator.Material('keyboard-arrow-down', 30, '#bbb') }</View>);}}
                // specify what should be rendered instead of ActivityIndicator
                // renderEmptyDate = {() => {return (<View><Text>今天没有</Text></View>);}}
                // specify your item comparison function for increased performance
                rowHasChanged={(r1, r2) => {return r1._id !== r2._id}}
                // Hide knob button. Default = false
                // By default, agenda dates are marked if they have at least one item, but you can override this if needed
                // markedDates={{
                //   '2018-03-16': {selected: true, marked: true},
                //   '2018-03-17': {marked: true},
                //   '2018-03-18': {disabled: true}
                // }}
                // agenda theme
                theme={{
                  // ...calendarTheme,
                  agendaDayTextColor: 'yellow',
                  agendaDayNumColor: 'green',
                  agendaTodayColor: 'red',
                  agendaKnobColor: 'blue'
                }}
                // agenda container style
                style={{}}
              />
            )
        }
      </View>   
      

      // <View style={{ backgroundColor: '#f8f8f8', flex: 1 }}>
      //   <ListView 
      //     dataSource={detail}
      //     enableEmptySections={true}
      //     renderRow={(row) => <TouchableOpacity onPress={() => this.props.navigation.navigate('JobsListDetail', { jobDetail: row })} activeOpacity={.7}><ListItem data={row} /></TouchableOpacity>}
      //     // renderSeparator={() => <View style={{ height: 2, backgroundColor: '#f2f2f2' }} />}
      //     style={{ flex: 1, marginTop: 15 }}
      //   />
      // </View>
    )
  }
})

class ListItem extends Component {

  constructor(props) {
    super(props)
    // console.log(this.props.itemData)
    this.state = {
    }
  }

  _statusInChinese(str) {
    switch(str) {
    // case 'Pending_Passenger':
    //   return '等待乘客'
    // case 'Pending_Assignment':
    //   return ''
    case 'Pending_Acceptance':
      return '等待接单'
    // case 'Confirmed':
    //   return ''
    case 'On_The_Way':
      return '司机即将到达'
    case 'Arrived':
      return '司机已到达'
    case 'No_Show':
      return '乘客未抵达'
    case 'On_Board':
      return '乘客已上车'
    case 'Completed':
      return '订单完成'
    case 'Cancelled_by_Passenger':
      return '乘客已取消'
    case 'Cancelled_by_Driver':
      return '司机已取消'
    case 'Rejected_by_Driver':
      return '司机已拒绝'
    case 'No_Taker':
      return '订单无人应答'
    }
  }

  render() {
    const { itemData } = this.props
    const { from, destination, booking_at, payment_method, fare, status } = itemData
    return (
      <View style={{ marginTop: 15, width, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <View style={[
          { width: width - 30, borderRadius: 6, backgroundColor: 'white' },
          { shadowOffset: { width: 0, height: 0 }, shadowColor: '#a2a3a8', shadowOpacity: .5, shadowRadius: 3 }
        ]}>
          <View style={{margin: 15}}>
            <View style={{ flexDirection: 'row', alignItems: 'center'}}>
              <View style={{ marginLeft: 3, height: 6, width: 6, borderRadius: 3, backgroundColor: 'green' }}></View>
              <Text style={{ marginLeft: 15, fontSize: 15 }}>{ from.name }</Text>
            </View>
            <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{ marginLeft: 3, height: 6, width: 6, borderRadius: 3, backgroundColor: 'red' }}></View>
              <Text style={{ marginLeft: 15, fontSize: 15 }}>{ destination.name } </Text>
            </View>
            <View style={{ marginTop: 15, flexDirection: 'row', alignItems: 'center'}}>
              <View>{ Icons.Generator.Material('access-time', 14, '#bbb') }</View>
              <Text style={{ marginLeft: 10, fontSize: 13, color: '#a5a5a5' }}>{ moment(Date.parse(booking_at)).format('YYYY-MM-D HH:mm') }</Text>
            </View>
            <View style={{ marginTop:15, flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <View>{ Icons.Generator.Material('payment', 14, '#bbb') }</View>
              <Text style={{ marginLeft: 10 }}>{ payment_method }</Text>
              <View style={{ marginLeft: 30 }}>{ Icons.Generator.Material('monetization-on', 14, '#bbb') }</View>
              <Text style={{ marginLeft: 10 }}>{ fare }</Text>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>                
                <Text style={{ fontSize: 16 }}>{ this._statusInChinese(status) }</Text>
                <View>{ Icons.Generator.Material('chevron-right', 20, '#bbb') }</View>
              </View>              
            </View>
          </View>
        </View>
      </View>
    )
  }
}