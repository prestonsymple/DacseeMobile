import React, { PureComponent } from 'react'
import {
  Text, View, Image, TouchableOpacity, ListView, ScrollView, RefreshControl, Switch
} from 'react-native'
import InteractionManager from 'InteractionManager'
import { NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'
import Schedule from './components/schedule'
import moment from 'moment'

import { Screen, Icons, Session,TextFont } from '../../utils'
import Resources from '../../resources'
import { application, driver } from '../../redux/actions'
import { FormattedMessage } from 'react-intl'
import ListItem from './components/list.item'
const { height, width } = Screen.window

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
    return { dateFrom: dateFrom, dateTo: dateTo }
  }
  goJobsListDetail(row) {
    this.props.dispatch(NavigationActions.navigate({ routeName: 'JobsListDetail', params: { jobDetail: row } }))
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
        <Schedule
          workingChange={(working) => this.props.dispatch(driver.driverSetValue({working}))}
          dataSource={detail}
          _onRefresh={(date) => this._fetchData(date)}
          goJobsListDetail={(row) => this.props.dispatch(NavigationActions.navigate({ routeName: 'JobsListDetail', params: { jobDetail: row } }))}
          working={working} />
        {
          (jobs.rowIdentities[0].length === 0 && working) && (
            <ScrollView refreshControl={refreshControl} contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }} style={{ flex: 1 }}>
              <View style={{ marginTop: working ? 108 + 100 : 108, alignItems: 'center' }}>
                <Image source={Resources.image.joblist_empty} style={{ marginBottom: 18 }} />
                <Text style={{ color: '#999', fontSize: TextFont.TextSize(18), fontWeight: '600', textAlign: 'center', marginBottom: 6 }}>
                  {/*  <FormattedMessage id={'already_online'}/> */}
                  {'已上线，等待订单中'}
                </Text>
              </View>
            </ScrollView>
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
    )
  }
})

