import React, { PureComponent } from 'react'
import {
  Text, View, TouchableOpacity, Image, ScrollView, ActivityIndicator
} from 'react-native'
import { connect } from 'react-redux'
import InteractionManager from 'InteractionManager'
import { NavigationActions } from 'react-navigation'

import { circle, booking } from '../../../redux/actions'
import { Icons, Define ,Screen} from '../../../utils'
import { BOOKING_STATUS } from '..'
const { height, width } = Screen.window
export default connect(state => ({ 
  ...state.circle,
  selected_friends: state.booking.selected_friends,
  selected: state.booking.type === 'circle',
  status: state.booking.status,
  i18n: state.intl.messages
}))(class BookingSelectMyCircle extends PureComponent {

  constructor(props) {
    super(props)
  }

  async componentDidMount() {
    await InteractionManager.runAfterInteractions()
    if (this.props.selected && this.props.init) {
      this.props.dispatch(circle.asyncFetchFriends({ init: true }))
    }
  }

  componentWillReceiveProps(props) {
    if (this.props.selected !== props.selected && props.selected) {
      this.props.dispatch(circle.asyncFetchFriends({ init: true }))
    }
  }

  render() {
    const { selected_friends, selected, loading, friend, status, i18n } = this.props
    let bottom = Define.system.ios.x ? 128 + 22 : 128
    if (status === BOOKING_STATUS.PASSGENER_BOOKING_PICKED_ADDRESS) {
      bottom = Define.system.ios.x ? 168 + 22 : 168
    }

    return selected ? (
      <View style={{ position: 'absolute', bottom, left: 10, right: 10 }}>
        <View style={[
          { backgroundColor: 'white', borderRadius: 28 }, 
          { shadowOffset: { width: 0, height: 2 }, shadowColor: '#999', shadowOpacity: .5, shadowRadius: 3 },
          { height: (width-82)/6+10, paddingHorizontal: 6, paddingVertical: 4.5, justifyContent: 'center', alignItems: 'center' },
          { flexDirection: 'row' }
        ]}>
          {
            (loading) && (
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size='small' color='#d0d0d0' />
              </View>
            )
          }
          {
            (!loading && friend.length === 0) && (
              <TouchableOpacity onPress={() => {
                this.props.dispatch(NavigationActions.navigate({ routeName: 'FriendsCircle' }))
              }} activeOpacity={.7} style={{ borderRadius: 23.5, backgroundColor: '#E5E5E5', flex: 1 }}>
                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  { Icons.Generator.Awesome('plus', 14, '#959595', { style: { top: .5 } }) }
                  <Text style={{ color: '#5d5d5d', marginLeft: 6 }}>{ i18n.add_mycircle }</Text>
                </View>
              </TouchableOpacity>
            )
          }
          {
            (!loading && friend.length !== 0 && (!Array.isArray(selected_friends) || selected_friends.length === 0)) && (
              <View style={{ flexDirection: 'row', flex: 1 }}>
                <TouchableOpacity 
                  onPress={() => this.props.dispatch(booking.passengerSetValue({ selected_friends: 'all' }))} 
                  activeOpacity={.7} style={[
                    { marginRight: 3, justifyContent: 'center', alignItems: 'center', height: 46, borderRadius: 23.5, backgroundColor: '#E5E5E5', flex: 1 },
                    typeof(selected_friends) === 'string' ? { backgroundColor: '#FFB639' } : {  }
                  ]}
                >
                  <Text style={[
                    { color: '#5d5d5d', marginLeft: 6, fontWeight: '600' },
                    selected_friends.length === friend.length ? { color: 'white' } : {  }
                  ]}>{ i18n.friend_all }</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => {
                    this.props.dispatch(booking.passengerSetValue({ selected_friends: [] }))
                    this.props.dispatch(NavigationActions.navigate({ routeName: 'FriendsCircle' }))
                  }} 
                  activeOpacity={.7} 
                  style={{ marginLeft: 3, justifyContent: 'center', alignItems: 'center', height: 46, borderRadius: 23.5, backgroundColor: '#E5E5E5', flex: 1 }}
                >
                  <Text style={{ color: '#5d5d5d', marginLeft: 6, fontWeight: '600' }}>{ i18n.friend_select }</Text>
                </TouchableOpacity>
              </View>
            )
          }
          {
            (!loading && friend.length !== 0 && typeof(selected_friends) !== 'string' && selected_friends.length > 0) && (
              <View style={{ flexDirection: 'row', flex: 1, borderRadius: 50, overflow: 'hidden' }}>
                <ScrollView
                  horizontal={true} 
                  showsHorizontalScrollIndicator={false}
                  style={{ flex: 1 }}
                >
                  { selected_friends.map((pipe, index) => (<SelectButton key={index} data={pipe} />)) }
                </ScrollView>
                <View style={{ marginLeft: 5 }}>
                  <TouchableOpacity onPress={() => {
                    this.props.dispatch(NavigationActions.navigate({ routeName: 'FriendsCircle' }))
                  }} activeOpacity={.7} style={{ backgroundColor: '#7ed321', width: 46, height: 46, borderRadius: 23, justifyContent: 'center', alignItems: 'center' }}>
                    { Icons.Generator.Material('create', 23, 'white') }
                  </TouchableOpacity>
                </View>
              </View>
            )
          }
        </View>
      </View>
    ) : (null)
  }
})

class SelectButton extends PureComponent {
  render() {
    const { data } = this.props
    const { _id, friend_id, friend_info } = data
    const { avatars= [{ url: 'https://storage.googleapis.com/dacsee-service-user/_shared/default-profile.jpg' }], email, fullName, phoneCountryCode, phoneNo, userId } = friend_info

    return (
      <View key={_id} style={{ backgroundColor: '#f2f2f2', marginRight:10, borderRadius: 23 }}>
        <Image style={{ height: (width-82)/6, width: (width-82)/6, borderRadius:  (width-82)/12 }} source={{ uri: avatars[avatars.length - 1].url }} />
        <View style={{ position: 'absolute', bottom: 2, right: 2, borderRadius: 4, width: 8, height: 8, backgroundColor: '#7ed321' }} />
      </View>
    )
  }
}