import React, { PureComponent } from 'react'
import {
  Text, View, Image, TouchableOpacity, ListView, ScrollView, RefreshControl, Switch
} from 'react-native'
import InteractionManager from 'InteractionManager'
import { NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'
import Schedule from './components/schedule'
import moment from 'moment'

import { Screen, Icons, Session, TextFont } from '../../utils'
import Resources from '../../resources'
import { application, driver } from '../../redux/actions'
import { FormattedMessage } from 'react-intl'
import OfflineListItem from './components/offline.listItem'
const { height, width } = Screen.window

const dataContrast = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })



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
      selectedDate: todayUtc
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
    const { loading } = this.state
    return (
      <View style={{ flex: 1 }}>
        <Schedule
          _onRefresh={(date) => this._fetchData(date)}>
          {this.rederJobsList()}
        </Schedule>
      </View>
    )
  }
  rederJobsList() {
    const { detail, loading } = this.state
    const refreshControl =
      <RefreshControl
        refreshing={loading}
        onRefresh={this._fetchData.bind(this)}
        title={'下拉进行刷新'}
        colors={['#ffffff']}
        progressBackgroundColor={'#1c99fb'}
      />
    if (detail.rowIdentities[0].length === 0) {
      return (
        <ScrollView refreshControl={refreshControl}
          contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
          style={{ flex: 1, marginTop: 104 }}>
          <View style={{ flex: 1, justifyContent: 'center',marginTop: 20, alignItems: 'center' }}>
            <Image source={Resources.image.joblist_empty} style={{ marginTop: 200, width: 100, height: 100 }} />
            <Text style={{ marginTop: 20, color: '#777', fontSize: TextFont.TextSize(18), fontWeight: '400' }}>暂无行程</Text>
          </View>
        </ScrollView>
      )
    }
    return (
      <ListView
        refreshControl={refreshControl}
        dataSource={detail}
        enableEmptySections={true}
        renderRow={(row,rowid,index) => (
          <OfflineListItem key={rowid}
            itemIndex={index}
            itemData={row}
            onPress={() => this.goJobsListDetail(row)}
          />
        )}
        style={{ marginTop: 104 }}
      />
    )
  }
})

