import React, { PureComponent } from 'react'
import {
  Text, View, Image, TouchableOpacity, ListView, ScrollView, RefreshControl, Switch
} from 'react-native'
import InteractionManager from 'InteractionManager'
import { NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'
import { Agenda } from 'react-native-calendars'
import moment from 'moment'

import { Screen, Icons, Session } from '../../utils'
import Resources from '../../resources'
import { application, driver } from '../../redux/actions'
import { FormattedMessage } from 'react-intl'
import font from '../../utils/util.textSize'
const TextSize=font.TextSize
const {height, width} = Screen.window

const dataContrast = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

// LocaleConfig.locales['CN'] = {
//   monthNames: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
//   // monthNamesShort: ['Janv.','Févr.','Mars','Avril','Mai','Juin','Juil.','Août','Sept.','Oct.','Nov.','Déc.'],
//   dayNames: ['周一','周二','周三','周四','周五','周六','周日'],
//   // dayNamesShort: ['Dim.','Lun.','Mar.','Mer.','Jeu.','Ven.','Sam.']
// };

// LocaleConfig.defaultLocale = 'CN';

export default connect(state => ({
  ...state.driver,
  i18n: state.intl.messages || {}
}))(class JobsListScreen extends PureComponent {
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
      jobs: dataContrast.cloneWithRows([])
    }
  }

  async componentWillMount() {
    await InteractionManager.runAfterInteractions()
    this._fetchData()
  }

  componentWillReceiveProps(props) {
    // UPDATE WORKING JOBS LIST
    if (props.working && this.props.jobs !== props.jobs) {
      this.setState({ jobs: dataContrast.cloneWithRows(props.jobs) })
    }
  }

  async _fetchData(dateStr) {
    // console.log(dateStr)
    const resultDate = dateStr == null ? this.state.selectedDate : dateStr
    const dateFrom = this._getFormatterDate(resultDate).dateFrom
    const dateTo = this._getFormatterDate(resultDate).dateTo

    try {
      this.setState({ loading: true })
      const resp = await Session.Booking.Get(`v1/bookings?role=driver&date_from=${dateFrom}&date_to=${dateTo}`)
      this.setState({ detail: dataContrast.cloneWithRows(resp) })
    } catch (e) {
      /*  */
    } finally {
      this.setState({ loading: false })
    }
  }

  //获取格式化日期时间
  _getFormatterDate(date) {
    const dateStr = moment(date).format('YYYY-MM-D')
    const dateFrom = moment(dateStr + ' 00:00:00').toISOString()
    const dateTo = moment(dateStr + ' 23:59:59').toISOString()
    return { dateFrom: dateFrom, dateTo: dateTo}
  }

  render() {
    const { working } = this.props
    const { dateDic, selectedDate, detail, loading, jobs } = this.state

    const refreshControl = working ? (undefined) : (
      <RefreshControl
        refreshing={loading}
        onRefresh={this._fetchData.bind(this)}
        title={'下拉进行刷新'}
        colors={['#ffffff']}
        progressBackgroundColor={'#1c99fb'}
      />
    )

    return (
      <View style={{ backgroundColor: '#f8f8f8', flex: 1 }}>
        {
          !working && (
            <View style={{ flex: 1 }}>
              <Agenda
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
            </View>
          )
        }

        <View style={{ flex: 4 }}>
          <View style={{ paddingHorizontal: 20, paddingTop: 20,  flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#333' }}>
              <FormattedMessage id={'online'}/>
            </Text>
            <Switch value={working} onValueChange={(working) => this.props.dispatch(driver.driverSetValue({ working }))} />
          </View>
          <View style={{ flex: 1 }}>
            {
              (detail.rowIdentities[0].length === 0 && !working) ||
              (jobs.rowIdentities[0].length === 0 && working) && (
                <ScrollView refreshControl={refreshControl} contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }} style={{ flex: 1 }}>
                  <View style={{ marginTop: working ? 108 + 100 : 108, alignItems: 'center' }}>
                    <Image source={Resources.image.joblist_empty} style={{ marginBottom: 18 }} />
                    <Text style={{ color: '#999', fontSize: 18, fontWeight: '600', textAlign: 'center', marginBottom: 6 }}>
                      { working ? '已上线，等待订单中' : this.props.i18n.no_jobs }
                    </Text>
                  </View>
                </ScrollView>
              )
            }
            {
              (detail.rowIdentities[0].length !== 0 && !working) && (
                <ListView
                  refreshControl={refreshControl}
                  dataSource={detail}
                  enableEmptySections={true}
                  renderRow={(row) => (
                    <ListItem
                      itemData={row}
                      onPress={() => this.props.dispatch(NavigationActions.navigate({ routeName: 'JobsListDetail', params: { jobDetail: row } }))}
                    />
                  )}
                  style={{ flex: 1, marginTop: 15 }}
                />
              )
            }
            {
              (jobs.rowIdentities[0].length !== 0 && working) && (
                <ListView
                  refreshControl={refreshControl}
                  dataSource={jobs}
                  enableEmptySections={true}
                  renderRow={(row) => (
                    <ListItem
                      itemData={row}
                      onPress={() => this.props.dispatch(NavigationActions.navigate({ routeName: 'JobsListDetail', params: { jobDetail: row } }))}
                    />
                  )}
                  style={{ flex: 1, marginTop: 15 }}
                />
              )
            }
          </View>
        </View>
      </View>
    )
  }
})

class ListItem extends PureComponent {

  constructor(props) {
    super(props)
    // console.log(this.props.itemData)
    this.state = {
    }
  }

  render() {
    const { itemData, itemDay, onPress = () => {} } = this.props
    const { from, destination, booking_at, payment_method, fare, status } = itemData

    return (
      <TouchableOpacity activeOpacity={.7} onPress={onPress}>
        <View style={{ marginBottom: 15, marginLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
          <View style={[
            { width: width - 20, borderRadius: 6, backgroundColor: 'white' },
            { shadowOffset: { width: 0, height: 0 }, shadowColor: '#a2a3a8', shadowOpacity: .5, shadowRadius: 3 }
          ]}>
            <View style={{margin: 15}}>
              <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                <Text numberOfLines={1} style={{ fontSize: TextSize(25), fontFamily: 'Helvetica', fontWeight: 'bold', color: '#67666c' }}>{ from.name }</Text>
              </View>
              <View style={{ marginTop: 5, flexDirection: 'row', alignItems: 'center'}}>
                {/* <Text style={{ fontSize: TextSize(13), fontFamily: 'Helvetica', fontWeight: 'bold', color: '#B2B1B6'}}></Text> */}
                <Text style={{fontSize: TextSize(15), fontFamily: 'Helvetica', fontWeight: 'bold', color: '#B2B1B6'}}>to { destination.name } </Text>
              </View>

              <View style={{ marginTop:30, flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <View>{ Icons.Generator.Material('access-time', TextSize(15), '#000000') }</View>
                <Text style={{ marginLeft: 5, fontSize: TextSize(15), color: '#5C5B63' }}>{ moment(Date.parse(booking_at)).format('HH:mm') }</Text>
                <View style={{marginLeft: 10, }}>{ Icons.Generator.Material('payment', TextSize(15), '#000000') }</View>
                <Text style={{ marginLeft: 5,  fontSize: TextSize(15), color: '#5C5B63' }}>{ payment_method == 'Cash' ? '现金' : payment_method }</Text>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                  {/* <View style={{ marginLeft: 30 }}>{ Icons.Generator.Material('monetization-on', 15, '#bbb') }</View> */}
                  <Text style={{fontSize: TextSize(15), marginLeft: 10, fontWeight: 'bold', color: '#6A696F' }}>{ fare }</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}
