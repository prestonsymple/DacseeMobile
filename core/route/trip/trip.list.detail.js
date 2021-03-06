import React, { Component, PureComponent } from 'react'
import {
  Text, View, StyleSheet, Image, ScrollView
} from 'react-native'
import InteractionManager from 'InteractionManager'
import { NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'
import { Calendar, CalendarList, Agenda, LocaleConfig } from 'react-native-calendars'
import moment from 'moment'
import { injectIntl } from 'react-intl'

import { Screen, Icons, Redux, Define, System, Session ,TextFont} from '../../utils'
import { Button } from '../../components'
import Resources from '../../resources'
import { application, booking } from '../../redux/actions'

const {height, width} = Screen.window

const styles = StyleSheet.create({
  pageWrap: { width: width, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white' },
  itemWrap: { alignItems: 'center', justifyContent: 'center' },
  itemTitle: { color: '#666', fontSize: TextFont.TextSize(14), fontWeight: '100', marginBottom: 8 },
  itemImageContent: { marginHorizontal: 6, width: 68, height: 68, borderRadius: 33, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderWidth: 3 },
  itemImage: { opacity: 0.7, width: 66, height: 66, borderRadius: 33, borderWidth: 1.5, borderColor: 'white', resizeMode: 'cover' }
})

export default connect( state => ({
  i18n: state.intl.messages
}))(class TripListDetailScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const reducer = global.store.getState()
    return {
      drawerLockMode: 'locked-closed',
      title: reducer.intl.messages.trip_detail,
      headerStyle: {
        backgroundColor: '#1AB2FD',
        shadowColor: 'transparent',
        shadowOpacity: 0,
        borderBottomWidth: 0,
        borderBottomColor: 'transparent',
        elevation: 0,
      },
    }
  }

  constructor(props) {
    super(props)
    const todayUtc = new Date().toISOString()

    this.state = {
      // dateDic: null,
      loading: false,
      // detail: dataContrast.cloneWithRows([]),
      // selectedDate: todayUtc,
      // switchValue: false
      tripDetail: this.props.navigation.state.params.tripDetail,
    }
  }

  async componentWillMount() {
    await InteractionManager.runAfterInteractions()
    this._fetchData()
  }

  async _fetchData(index=0) {
    this.setState({
      loading: true
    })
    // const resp = await Session.booking.get(`v1/bookings?date_from=2018-03-10T22:59:40.632Z&date_to=${new Date().toISOString()}`)

    try {
      // console.log(this.state.selectedDate)
      // const dateFrom = this._getFormatterDate(this.state.selectedDate).dateFrom
      // const dateTo = this._getFormatterDate(this.state.selectedDate).dateTo
      const resp = await Session.Booking.Get('v1/bookings?role=passenger')

      this.setState({
        // dateDic: dateDic,
        loading: false,
        // detail: dataContrast.cloneWithRows(resp.data)
      })
    } catch (e) {
      this.props.dispatch(application.showMessage('无法请求到服务器'))
      this.setState({
        loading: false
      })
    }
  }

  render () {
    const { i18n } = this.props
    const { destination, from, payment_method, fare, booking_at, status, driver_info } = this.state.tripDetail
    // const { fullName } = driver_info
    return (
      <View style={{ flex: 1, backgroundColor: '#1ab2fd', alignItems:'center' }}>
        <Image source={Resources.image.logo} style={{ marginTop:10, height: 80, width: 80, resizeMode: 'contain'}} />
        <View style={{ position: 'absolute', top:100, left: 20, right: 20, bottom: 20, borderRadius: 10, backgroundColor: 'white' }}>
          <ScrollView style={{}}>
            <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
              <Text style={{ fontSize: TextFont.TextSize(13), color: '#999' }}>{i18n.driver_info}</Text>

              {
                driver_info == undefined ?
                  (
                    <View style={{ marginVertical: 10 }}>
                      <Text style={{fontSize:TextFont.TextSize(15),color: '#868686'}}>{i18n.no_driver_info}</Text>
                    </View>
                  ) :
                  (
                    <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center'}}>
                      <Image source={{ uri: driver_info.avatars == undefined ? 'https://storage.googleapis.com/dacsee-service-user/_shared/default-profile.jpg' : driver_info.avatars[driver_info.avatars.length - 1].url }} style={{ width: 60, height: 60 , borderRadius: 30 }} />
                      <Text style={{ marginLeft: 20, fontSize: TextFont.TextSize(18), color: '#333'}}>{ driver_info.fullName }</Text>
                      <Text style={{ fontSize: TextFont.TextSize(15), color: '#666'}}></Text>
                    </View>)
              }
            </View>
            <View style={{ height: 1, backgroundColor: '#e5e5e5' }}></View>

            <View style={{ padding: 20 }}>
              <View style={{ }}>
                <Text style={{ fontSize: TextFont.TextSize(13), color: '#999' }}>{i18n.book_time}</Text>
                <Text style={{ marginTop: 10, fontSize: TextFont.TextSize(15), color: '#555' }}>{ moment(booking_at).format('YYYY-MM-D HH:mm:ss') }</Text>
              </View>
              <View style={{ marginTop: 20 }}>
                <Text style={{ fontSize: TextFont.TextSize(13), color: '#999' }}>{i18n.from}</Text>
                <Text style={{ marginTop: 10, fontSize: TextFont.TextSize(15), color: '#555' }}>{ from.name }</Text>
              </View>
              <View style={{ marginTop: 20 }}>
                <Text style={{ fontSize: TextFont.TextSize(13), color: '#999' }}>{i18n.destination}</Text>
                <Text style={{ marginTop: 10, fontSize: TextFont.TextSize(15), color: '#555' }}>{ destination.name }</Text>
              </View>
              <View style={{ marginTop: 20, height: 1, backgroundColor: '#e5e5e5' }}></View>
            </View>

            <View style={{ paddingHorizontal: 20 }}>
              <Text style={{ fontSize: TextFont.TextSize(15), color:'#555'}}>{i18n.fare_total}</Text>
              <View stye={{ marginTop: 10, flex: 1, flexDirection: 'row'}}>
                {/* <Text style={{ width: 60, fontSize: 14, color: '#555', backgroundColor: 'red' }}>总费用</Text> */}
                <Text style={{ marginTop: 10, fontSize: TextFont.TextSize(15), color: '#555' }}>{ `RM ${parseFloat(fare).toFixed(2)}`}</Text>
              </View>
            </View>

            {/* <View style={{ marginTop: 20, height: 1, backgroundColor: '#e5e5e5' }}></View> */}

          </ScrollView>
        </View>
      </View>
    )
  }
})
