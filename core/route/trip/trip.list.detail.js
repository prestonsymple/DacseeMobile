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

export default connect(() => ({ }))(class TripListDetailScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      drawerLockMode: 'locked-closed', 
      title: '行程详情'
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
      const resp = await Session.booking.get('v1/bookings?role=passenger')

      this.setState({
        // dateDic: dateDic,
        loading: false,
        // detail: dataContrast.cloneWithRows(resp.data)
      })
    } catch (e) {
      this.props.dispatch(application.showMessage('网络情况差，请重试'))
      this.setState({
        loading: false        
      })
    }    
  }

  render () {
    const { detail } = this.state 
    return (
      <View style={{ flex: 1, backgroundColor: '#1ab2fd', alignItems:'center' }}>
        <Image source={Resources.image.logo} style={{height: 80, width: 80, resizeMode: 'contain'}} />
        <View style={{ }}></View>
      </View>
    )
  }
})