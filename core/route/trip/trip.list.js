import React, { Component } from 'react'
import {
  Text, View,Image, TouchableOpacity,  ListView, ScrollView, RefreshControl
} from 'react-native'
import InteractionManager from 'InteractionManager'
import { NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'
import moment from 'moment'
import { Screen, Icons, Redux, Define, System, Session ,TextFont} from '../../utils'
import Resources from '../../resources'
import { application, booking } from '../../redux/actions'

const { height, width } = Screen.window

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

    this.state = {
      loading: false,
      detail: dataContrast.cloneWithRows([]),
    }
  }

  async componentWillMount() {
    await InteractionManager.runAfterInteractions()
    this._fetchData()
  }

  async _fetchData(index = 0) {
    this.setState({
      loading: true
    })
    try {
      const data = await Session.Booking.Get('v1/bookings?role=passenger')
      this.setState({
        loading: false,
        detail: dataContrast.cloneWithRows(data)
      })
    } catch (e) {
      this.props.dispatch(application.showMessage(this.props.i18n.unable_connect_server_pls_retry_later))
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
              style={{ flex: 1 }}
            />)
        }
      </View>
    )
  }
})

class ListItem extends Component {

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
              <Text style={{ marginLeft: 5, fontSize: TextFont.TextSize(14), color: '#5C5B63' }}>{moment(booking_at).format('YY-MM-DD HH:mm')}</Text>
              <View style={{ marginLeft: 10, }}>{Icons.Generator.Material('payment', TextFont.TextSize(14), '#000000')}</View>
              <Text style={{ marginLeft: 5, fontSize: TextFont.TextSize(14), color: '#5C5B63' }}>{payment_method }</Text>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                {/* <View style={{ marginLeft: 30 }}>{ Icons.Generator.Material('monetization-on', 15, '#bbb') }</View> */}
                <Text style={{ fontSize: TextFont.TextSize(14), marginLeft: 10, fontWeight: 'bold', color: '#6A696F' }}>{ `RM ${parseFloat(fare).toFixed(2)}`}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
