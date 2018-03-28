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
import { FormattedMessage } from 'react-intl'
import FONT from '../../utils/util.textSize'
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
    this._fetchData()
  }

  async _fetchData(dateStr) {
    // console.log(dateStr)
    const resultDate = dateStr == null ? this.state.selectedDate : dateStr
    const dateFrom = this._getFormatterDate(resultDate).dateFrom
    const dateTo = this._getFormatterDate(resultDate).dateTo
    this.setState({
      loading: true
    })
    // const resp = await Session.booking.get(`v1/bookings?date_from=2018-03-10T22:59:40.632Z&date_to=${new Date().toISOString()}`)

    try {
      const resp = await Session.Booking.Get(`v1/bookings?role=driver&date_from=${dateFrom}&date_to=${dateTo}`)
      this.setState({ detail: dataContrast.cloneWithRows(resp) })
    } catch (e) {
      console.log(e)
      this.props.dispatch(application.showMessage('无法请求到服务器'))
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
              this.setState({
                selectedDate: dateStr
              })
              this._fetchData(dateStr)
            }}
            onDayChange={(day)=>{}}
            selected={selectedDate}
            pastScrollRange={50}
            futureScrollRange={50}
            renderKnob={() => {return (<View>{ Icons.Generator.Material('keyboard-arrow-down', 30, '#bbb') }</View>)}}
            renderEmptyDate = {() => {return (<View style={{ margin: 20, alignItems: 'center', backgroundColor: '#d3d3d3',  height: 1}}></View>)}}
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
        </View>

        <View style={{ flex: 4 }}>
          <View style={{ paddingHorizontal: 20, paddingTop: 20,  flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#333' }}>
              <FormattedMessage id={'online'}/>
            </Text>
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
                      <Text style={{ marginTop: 20, color: '#777', fontSize: FONT.TextSize(18), fontWeight: '400' }}>
                        <FormattedMessage id={'no_job'}/>
                      </Text>
                    </View>
                  </ScrollView>
                ) :
                ( <ListView
                  refreshControl={
                    <RefreshControl
                      refreshing={this.state.loading}
                      onRefresh={this._fetchData.bind(this)}
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
              <Text numberOfLines={1} style={{ fontSize: FONT.TextSize(20), fontFamily: 'Helvetica', fontWeight: 'bold', color: '#67666c' }}>{ from.name }</Text>
            </View>
            <View style={{ marginTop: 5, flexDirection: 'row', alignItems: 'center'}}>
              {/* <Text style={{ fontSize: FONT.TextSize(13), fontFamily: 'Helvetica', fontWeight: 'bold', color: '#B2B1B6'}}></Text> */}
              <Text style={{fontSize: FONT.TextSize(13), fontFamily: 'Helvetica', fontWeight: 'bold', color: '#B2B1B6'}}>to { destination.name } </Text>
            </View>

            <View style={{ marginTop:30, flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <View>{ Icons.Generator.Material('access-time', FONT.TextSize(14), '#000000') }</View>
              <Text style={{ marginLeft: 5, fontSize: FONT.TextSize(14), color: '#5C5B63' }}>{ moment(Date.parse(booking_at)).format('HH:mm') }</Text>
              <View style={{marginLeft: 10, }}>{ Icons.Generator.Material('payment', FONT.TextSize(14), '#000000') }</View>
              <Text style={{ marginLeft: 5,  fontSize: FONT.TextSize(14), color: '#5C5B63' }}>{ payment_method == 'Cash' ? '现金' : payment_method }</Text>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                {/* <View style={{ marginLeft: 30 }}>{ Icons.Generator.Material('monetization-on', 14, '#bbb') }</View> */}
                <Text style={{fontSize: FONT.TextSize(20), marginLeft: 10, fontWeight: 'bold', color: '#6A696F' }}>{ fare }</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
