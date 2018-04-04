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
import { Screen, Icons, Redux, Define, System, Session ,TextFont} from '../../utils'
import Resources from '../../resources'
import { application, booking } from '../../redux/actions'


const { height, width } = Screen.window

const styles = StyleSheet.create({
  pageWrap: { width: width, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white' },
  itemWrap: { alignItems: 'center', justifyContent: 'center' },
  itemTitle: { color: '#666', fontSize: TextFont.TextSize(14), fontWeight: '100', marginBottom: 8 },
  itemImageContent: { marginHorizontal: 6, width: 68, height: 68, borderRadius: 33, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderWidth: 3 },
  itemImage: { opacity: 0.7, width: 66, height: 66, borderRadius: 33, borderWidth: 1.5, borderColor: 'white', resizeMode: 'cover' }
})

const dataContrast = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

export default connect(state => ({
  i18n: state.intl.messages || {}
}))(class TripListScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const reducer = global.store.getState()
    return {
      drawerLockMode: 'locked-closed',
      title: reducer.intl.messages.mytrip
    }
  }

  constructor(props) {
    super(props)
    const todayUtc = new Date().toISOString()

    this.state = {
      // dateDic: null,
      loading: false,
      detail: dataContrast.cloneWithRows([]),
      // selectedDate: todayUtc,
      // switchValue: false
    }
  }

  async componentWillMount() {
    // await InteractionManager.runAfterInteractions()
    this._fetchData()
  }

  async _fetchData(index = 0) {
    this.setState({
      loading: true
    })
    // const resp = await Session.booking.get(`v1/bookings?date_from=2018-03-10T22:59:40.632Z&date_to=${new Date().toISOString()}`)

    try {
      // console.log(this.state.selectedDate)
      // const dateFrom = this._getFormatterDate(this.state.selectedDate).dateFrom
      // const dateTo = this._getFormatterDate(this.state.selectedDate).dateTo
      const data = await Session.Booking.Get('v1/bookings?role=passenger')

      this.setState({
        // dateDic: dateDic,
        loading: false,
        detail: dataContrast.cloneWithRows(data)
      })
    } catch (e) {
      this.props.dispatch(application.showMessage('无法连接到服务器'))
      this.setState({
        loading: false
      })
    }
  }

  render() {
    const { detail } = this.state
    const {i18n} = this.props
    return (
      <View style={{ flex: 1 ,paddingBottom:20}}>
        {
          (detail.rowIdentities[0].length === 0) ?
            (
              <ScrollView refreshControl={
                <RefreshControl
                  refreshing={this.state.loading}
                  onRefresh={this._fetchData.bind(this)}
                  title={i18n.pull_refresh}
                  colors={['#ffffff']}
                  progressBackgroundColor={'#1c99fb'}
                />
              } contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }} style={{ flex: 1 }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Image source={Resources.image.joblist_empty} style={{ marginTop: 200, width: 100, height: 100 }} />
                  <Text style={{ marginTop: 20, color: '#777', fontSize: TextFont.TextSize(18), fontWeight: '400' }}>{i18n.no_job}</Text>
                </View>
              </ScrollView>
            ) :
            (<ListView
              refreshControl={
                <RefreshControl
                  refreshing={this.state.loading}
                  onRefresh={() => { this._fetchData.bind(this) }}
                  title={i18n.pull_refresh}
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
                        routeName: 'TripListDetail',
                        params: { tripDetail: row }
                      }))
                    }}
                    activeOpacity={.7}
                  >
                    <ListItem itemData={row} />
                  </TouchableOpacity>
                )
              }}
              // renderSeparator={() => <View style={{ height: 2, backgroundColor: '#f2f2f2' }} />}
              style={{ flex: 1 }}
            />)
        }
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

  _statusInChinese(str) {
    const {i18n} =this.props;
    switch (str) {
    // case 'Pending_Passenger':
    //   return '等待乘客'
    // case 'Pending_Assignment':
    //   return ''
    case 'Pending_Acceptance':
      return i18n.Pending_Acceptance
    // case 'Confirmed':
    //   return ''
    case 'On_The_Way':
      return i18n.On_The_Way
    case 'Arrived':
      return i18n.Arrived
    case 'No_Show':
      return i18n.No_Show
    case 'On_Board':
      return i18n.On_Board
    case 'Completed':
      return i18n.Completed
    case 'Cancelled_by_Passenger':
      return i18n.Cancelled_by_Passenger
    case 'Cancelled_by_Driver':
      return i18n.Cancelled_by_Driver
    case 'Rejected_by_Driver':
      return i18n.Rejected_by_Driver
    case 'No_Taker':
      return i18n.No_Taker
    }
  }

  render() {
    const { itemData, itemDay } = this.props
    const { from, destination, booking_at, payment_method, fare, status } = itemData
    return (
      <View style={{ marginTop: 20, marginLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
        <View style={[
          { width: width - 20, borderRadius: 6, backgroundColor: 'white' },
          { shadowOffset: { width: 0, height: 0 }, shadowColor: '#a2a3a8', shadowOpacity: .5, shadowRadius: 3 }
        ]}>
          <View style={{ margin: 15 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text numberOfLines={1} style={{ fontSize: TextFont.TextSize(18), fontFamily: 'Helvetica', fontWeight: 'bold', color: '#67666c' }}>{from.name}</Text>
            </View>
            <View style={{ marginTop: 5, flexDirection: 'row', alignItems: 'center' }}>
              {/* <Text style={{ fontSize: TextFont.TextSize(13), fontFamily: 'Helvetica', fontWeight: 'bold', color: '#B2B1B6'}}></Text> */}
              <Text style={{ fontSize: TextFont.TextSize(13), fontFamily: 'Helvetica', fontWeight: '500', color: '#B2B1B6' }}>to {destination.name} </Text>
            </View>

            <View style={{ marginTop: 30, flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <View>{Icons.Generator.Material('access-time', TextFont.TextSize(14), '#000000')}</View>
              <Text style={{ marginLeft: 5, fontSize: TextFont.TextSize(14), color: '#5C5B63' }}>{moment(booking_at).format('HH:mm')}</Text>
              <View style={{ marginLeft: 10, }}>{Icons.Generator.Material('payment', TextFont.TextSize(14), '#000000')}</View>
              <Text style={{ marginLeft: 5, fontSize: TextFont.TextSize(14), color: '#5C5B63' }}>{payment_method == 'Cash' ? '现金' : payment_method}</Text>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                {/* <View style={{ marginLeft: 30 }}>{ Icons.Generator.Material('monetization-on', 15, '#bbb') }</View> */}
                <Text style={{ fontSize: TextFont.TextSize(14), marginLeft: 10, fontWeight: 'bold', color: '#6A696F' }}>{fare}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
