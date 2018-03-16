import React, { Component, PureComponent } from 'react'
import { 
  Text, View, Animated, StyleSheet, StatusBar, Image, TouchableOpacity, TouchableHighlight, 
  DeviceEventEmitter, TextInput, Easing, ListView, ScrollView, RefreshControl, Switch
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

const dataContrast = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

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
      title: '订单列表'
    }
  }

  constructor(props) {
    super(props)
    const todayUtc = new Date().toISOString()
    
    this.state = {
      // dateDic: null,
      loading: false,
      detail: dataContrast.cloneWithRows([]),
      selectedDate: todayUtc,
      switchValue: false
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

  async _fetchData(dateDic) {
    console.log(dateDic)
    this.setState({
      loading: true
    })
    // const resp = await Session.booking.get(`v1/bookings?date_from=2018-03-10T22:59:40.632Z&date_to=${new Date().toISOString()}`)

    try {
      
      
      const resp = await Session.booking.get(`v1/bookings?role=driver&date_from=${dateDic.dateFrom}&date_to=${dateDic.dateTo}`)
    
      // var dateDic = new Object()
      // resp.data.map( (item, index) => {        
      //   const dateStr = moment(Date.parse(item.booking_at)).format('YYYY-MM-D')
        
      //   if (dateDic[dateStr] === undefined) {
      //     // console.log(item)
      //     dateDic[dateStr] = Array(item)          
      //   } else {
      //     dateDic[dateStr].push(item)
      //   }
        
      //   // dateDic[moment(Date.parse(item.booking_at)).format('YYYY-MM-D')] = [item]
      // })
      this.setState({ detail: dataContrast.cloneWithRows(resp.data) })
    } catch (e) {
      this.props.dispatch(application.showMessage('网络情况差，请重试'))
    } finally {
      this.setState({ loading: false })
    }
  }

  _onSwitchValueChange(value) {
    this.setState({
      switchValue: value
    })
  }

  //获取格式化日期时间
  _getFormatterDate(date) {
    const dateStr = moment(date).format('YYYY-MM-D')
    const dateFrom = moment(dateStr + ' 00:00:00').toISOString()
    const dateTo = moment(dateStr + ' 23:59:59').toISOString()
    // console.log(dateFrom, dateTo)
    return { dateFrom: dateFrom, dateTo: dateTo}
  }

  render() {
    const { dateDic, selectedDate, detail, switchValue, loading } = this.state    
    return (                        
      <View style={{ backgroundColor: '#f8f8f8', flex: 1 }}>
        <View style={{ flex: 1 }}>
          <Agenda
            // items = { dateDic }
            // items={
            //   {'2018-03-11': [DEMO_DATA],
            //     '2018-03-12': [DEMO_DATA, DEMO_DATA],
            //     '2018-03-13': [],
            //     '2018-03-14': [DEMO_DATA],
            //   }}
            loadItemsForMonth={(month) => {}}
            onCalendarToggled={(calendarOpened) => {}}
            onDayPress={(day)=>{              
              const dateStr = moment(day.timestamp).toISOString()
              // console.log('clicked', dateStr)
              // this.setState({
              //   selectedDate: dateStr
              // })
              const dateFrom = this._getFormatterDate(dateStr).dateFrom
              const dateTo = this._getFormatterDate(dateStr).dateTo
              this._fetchData({dateFrom: dateFrom, dateTo: dateTo})
            }}
            onDayChange={(day)=>{}}
            selected={selectedDate}                  
            pastScrollRange={3}
            futureScrollRange={1}
            // renderItem={(item, firstItemInDay) => {
            //   return (
            //     // <TouchableOpacity onPress={() => this.props.navigation.navigate('JobsListDetail', { jobDetail: item })} activeOpacity={.7}><ListItem itemData={item} itemDay={firstItemInDay} /></TouchableOpacity>
            //     <TouchableOpacity 
            //       onPress={() => {
            //         this.props.dispatch(NavigationActions.navigate({
            //           routeName: 'JobsListDetail', 
            //           params: { jobDetail: item } 
            //         }))
            //       }}
            //       activeOpacity={.7}
            //     >
            //       <ListItem itemData={item} itemDay={firstItemInDay} />
            //     </TouchableOpacity>
            //   )
            // }
            // }
            // renderDay={(day, item) => {
            //   return (
            //     <View style={{ width: 40, justifyContent: 'center', alignItems: 'center' }}>
            //       {
            //         day !== undefined ?
            //           <Text style={{ fontSize: 30, color: '#b3b3b3'}}>{ day.day }</Text> : 
            //           null
            //       }                      
            //     </View>
            //   );
            // }}
            // renderEmptyData={() => {return (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 15, color: '#a5a5a5' }}>今日暂无行程</Text></View>);}}
            renderKnob={() => {return (<View>{ Icons.Generator.Material('keyboard-arrow-down', 30, '#bbb') }</View>);}}
            renderEmptyDate = {() => {return (<View style={{ margin: 20, alignItems: 'center', backgroundColor: '#d3d3d3',  height: 1}}></View>);}}
            rowHasChanged={(r1, r2) => {return r1._id !== r2._id}}
            theme={{
              // ...calendarTheme,
              agendaDayTextColor: 'yellow',
              agendaDayNumColor: 'green',
              agendaTodayColor: 'red',
              agendaKnobColor: 'blue'
            }}
            // agenda container style
            style={{  }}
          />
          {/* <ScrollView contentContainerStyle={{ width: width, height: 90, backgroundColor: '#1ab2fd' }} 
            horizontal={true}
            pagingEnabled={true}>
            <CalendarItem day={'16'}/>
          </ScrollView> */}
        </View>
        
        <View style={{ flex: 4 }}>
          <View style={{ paddingHorizontal: 20, paddingTop: 20,  flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#333' }}>上线</Text>
            <Switch value={ switchValue } onValueChange={this._onSwitchValueChange.bind(this)} />
          </View>
          <View style={{ flex: 1 }}>
            {
              (detail.rowIdentities[0].length === 0 ) ?
                (
                  <ScrollView refreshControl={
                    <RefreshControl
                      refreshing={loading}
                      onRefresh={this._fetchData.bind(this)}
                      title={'下拉进行刷新'}
                      colors={['#ffffff']}
                      progressBackgroundColor={'#1c99fb'}
                    />
                  } contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }} style={{ flex: 1 }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                      <Image source={Resources.image.joblist_empty} style={{ marginTop: 70, width: 100, height: 100 }} />
                      <Text style={{ marginTop: 20, color: '#777', fontSize: 18, fontWeight: '400' }}>暂无行程</Text>
                    </View>                    
                  </ScrollView>
                ) :
                ( <ListView 
                  refreshControl={
                    <RefreshControl
                      refreshing={this.state.loading}
                      onRefresh={() => {this._fetchData.bind(this)}}
                      title={'下拉进行刷新'}
                      colors={['#ffffff']}
                      progressBackgroundColor={'#1c99fb'}
                    />
                  }
                  dataSource={detail}
                  enableEmptySections={true}
                  renderRow={(row) => {
                    return (
                      <TouchableOpacity 
                        onPress={() => {
                          this.props.dispatch(NavigationActions.navigate({
                            routeName: 'JobsListDetail', 
                            params: { jobDetail: row } 
                          }))
                        }}
                        activeOpacity={.7}
                      >
                        <ListItem itemData={row} />
                      </TouchableOpacity>
                    )}}
                  // renderSeparator={() => <View style={{ height: 2, backgroundColor: '#f2f2f2' }} />}
                  style={{ flex: 1, marginTop: 15 }}
                />)
            }
          </View>
        </View>
        
      </View>

      // <View style={{flex: 1}}>
      //   {
      //     dateDic === null ?
      //       (
      //         <ScrollView refreshControl={
      //           <RefreshControl
      //             refreshing={this.state.loading}
      //             onRefresh={this._fetchData.bind(this)}
      //             title={'下拉进行刷新'}
      //             colors={['#ffffff']}
      //             progressBackgroundColor={'#1c99fb'}
      //           />
      //         } contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', height: Screen.safaContent.height - 48 }} style={{ flex: 1 }}>
      //           <Text style={{ top: -64, color: '#777', fontSize: 15, fontWeight: '400' }}>暂无行程</Text>
      //         </ScrollView>
      //       ) :
      //       (
      //         <View style={{ flex: 1 }}>
      //           <Agenda
      //             items = { dateDic }
      //             // items={
      //             //   {'2018-03-11': [DEMO_DATA],
      //             //     '2018-03-12': [DEMO_DATA, DEMO_DATA],
      //             //     '2018-03-13': [],
      //             //     '2018-03-14': [DEMO_DATA],
      //             //   }}
      //             loadItemsForMonth={(month) => {}}
      //             onCalendarToggled={(calendarOpened) => {}}
      //             onDayPress={(day)=>{}}
      //             onDayChange={(day)=>{}}
      //             selected={selectedDate}                  
      //             pastScrollRange={3}
      //             futureScrollRange={1}
      //             renderItem={(item, firstItemInDay) => {
      //               return (
      //                 <TouchableOpacity onPress={() => this.props.navigation.navigate('JobsListDetail', { jobDetail: item })} activeOpacity={.7}><ListItem itemData={item} itemDay={firstItemInDay} /></TouchableOpacity>
      //               )
      //             }
      //             }
      //             renderDay={(day, item) => {
      //               return (
      //                 <View style={{ width: 40, justifyContent: 'center', alignItems: 'center' }}>
      //                   {
      //                     day !== undefined ?
      //                       <Text style={{ fontSize: 30, color: '#b3b3b3'}}>{ day.day }</Text> : 
      //                       null
      //                   }                      
      //                 </View>
      //               );
      //             }}
      //             renderEmptyData={() => {return (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 15, color: '#a5a5a5' }}>今日暂无行程</Text></View>);}}
      //             renderKnob={() => {return (<View>{ Icons.Generator.Material('keyboard-arrow-down', 30, '#bbb') }</View>);}}
      //             renderEmptyDate = {() => {return (<View style={{ margin: 20, alignItems: 'center', backgroundColor: '#d3d3d3',  height: 1}}></View>);}}
      //             rowHasChanged={(r1, r2) => {return r1._id !== r2._id}}
      //             theme={{
      //               // ...calendarTheme,
      //               agendaDayTextColor: 'yellow',
      //               agendaDayNumColor: 'green',
      //               agendaTodayColor: 'red',
      //               agendaKnobColor: 'blue'
      //             }}
      //             // agenda container style
      //             style={{ flex: 1 }}
      //           />
      //         </View> 
      //       )
      //   }
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
    const { itemData, itemDay } = this.props
    const { from, destination, booking_at, payment_method, fare, status } = itemData

    return (
      <View style={{ marginBottom: 15, marginLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
        <View style={[
          { width: width - 20, borderRadius: 6, backgroundColor: 'white' },
          { shadowOffset: { width: 0, height: 0 }, shadowColor: '#a2a3a8', shadowOpacity: .5, shadowRadius: 3 }
        ]}>          
          <View style={{margin: 15}}>
            <View style={{ flexDirection: 'row', alignItems: 'center'}}>              
              <Text style={{ fontSize: 25, fontFamily: 'Helvetica', fontWeight: 'bold', color: '#333' }}>{ from.name }</Text>
            </View>
            <View style={{ marginTop: 5, flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{ fontSize: 15, fontFamily: 'Helvetica', fontWeight: 'bold', color: '#999'}}>to</Text>
              <Text style={{ marginLeft: 10, fontSize: 15, fontFamily: 'Helvetica', fontWeight: 'bold', color: '#999'}}>{ destination.name } </Text>
            </View>
            
            <View style={{ marginTop:30, flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <View>{ Icons.Generator.Material('access-time', 14, '#bbb') }</View>
              <Text style={{ marginLeft: 5, fontSize: 15, color: '#777' }}>{ moment(Date.parse(booking_at)).format('HH:mm') }</Text>
              <View style={{marginLeft: 10, }}>{ Icons.Generator.Material('payment', 14, '#bbb') }</View>
              <Text style={{ marginLeft: 5,  fontSize: 15, color: '#777' }}>{ payment_method }</Text>              
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>                
                {/* <View style={{ marginLeft: 30 }}>{ Icons.Generator.Material('monetization-on', 14, '#bbb') }</View> */}
                <Text style={{ marginLeft: 10, fontWeight: 'bold', color: '#333' }}>{ fare }</Text>
              </View>              
            </View>
          </View>
        </View>
      </View>
    )
  }
}

// class CalendarItem extends Component {
//   constructor(props) {
//     super(props)
//     this.state={
//       day: this.props.day
//     }
//   }

//   render () {
//     return (
//       <View style={{ flex: 1 }}>
//         <Text style={{}}>三月</Text>
//         <Text style={{}}>16</Text>
//         <Text style={{}}>周一</Text>
//       </View>
//     )
//   }
// }