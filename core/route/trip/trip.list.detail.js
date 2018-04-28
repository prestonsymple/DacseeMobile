import React, { Component, PureComponent } from 'react'
import {
  Text, View, StyleSheet, Image, ScrollView
} from 'react-native'
import InteractionManager from 'InteractionManager'
import { connect } from 'react-redux'
import moment from 'moment'

import { Screen, Icons, Redux, Define, System, Session ,TextFont} from '../../utils'
import Resources from '../../resources'
import { application, booking } from '../../redux/actions'

const {height, width} = Screen.window

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

    this.state = {
      loading: false,
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
    try {
      const resp = await Session.Booking.Get('v1/bookings?role=passenger')

      this.setState({
        loading: false,
      })
    } catch (e) {
      this.props.dispatch(application.showMessage(this.props.i18n.unable_connect_server_pls_retry_later))
      this.setState({
        loading: false
      })
    }
  }

  render () {
    const { i18n } = this.props
    const { destination, from, payment_method, fare, booking_at, status, driver_info } = this.state.tripDetail
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
