/* eslint-disable */
import React, { Component, PureComponent } from 'react'
import {
  View, TouchableOpacity, Modal, Text, Animated, Alert, AppState, TextInput, ScrollView, ListView, Platform,
  StatusBar
} from 'react-native'
import InteractionManager from 'InteractionManager'
import * as Progress from 'react-native-progress'
import CodePush from 'react-native-code-push'
import { connect } from 'react-redux'
import { NavigationActions, SafeAreaView } from 'react-navigation'
import { application, address as Address } from '../../redux/actions'

/*****************************************************************************************************/
import { booking } from '../../redux/actions'
import { Search } from '../../native/AMap'
import { System, Icons, Screen, Define, Session ,TextFont } from '../../utils'
import { Button } from '../../components'
import { BOOKING_STATUS } from '../main'
/*****************************************************************************************************/

const dataContrast = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

export default connect(state => ({
  location: state.account.location,
  i18n: state.intl.messages,
  favorite: state.address.favorite
}))(class SelectAddressModal extends Component {

  constructor(props) {
    super(props)
    this.state = {
      searchRet: undefined,
      fav: dataContrast.cloneWithRows(props.favorite)
    }
  }

  // shouldComponentUpdate(props) {
  //   if (props.i18n !== this.props.i18n || props.favorite !== this.props.favorite) {
  //     return true
  //   }
  //   return false
  // }

  componentWillReceiveProps(props) {
    if (props.favorite && props.favorite !== this.props.favorite) {
      this.setState({
        fav: dataContrast.cloneWithRows(props.favorite)
      })
    }
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
  }

  componentDidMount() {
    this._fetchFavoriteData()
  }

  async _fetchFavoriteData() {
    try {
      const resp = await Session.User.Get('v1/favPlaces')
      this.props.dispatch(Address.setValues({ favorite: resp }))
    } catch(e) {
      console.log(e)
    }
  }

  async _addedFavPlace(place) {
    try {
      const body = {
        name: place.name,
        latitude: place.coords.lat,
        longitude: place.coords.lng,
        address: place.address,
        placeId: place.placeId
      }
      const resp = await Session.User.Post('v1/favPlaces/user', body)

      let favorites = this.props.favorite
      favorites.push(resp)
      this.props.dispatch(Address.setValues({ favorite: favorites }))
      this.setState({
        fav: dataContrast.cloneWithRows(favorites)
      })
    } catch(e) {
      console.log(e)
    }
  }

  async _deleteFavPlace(place) {
    try {
      const body = {
        name: place.name,
        latitude: place.coords.lat,
        longitude: place.coords.lng,
        address: place.address,
        placeId: place.placeId
      }

      const favPlace = this.props.favorite.find(pipe => pipe.placeId == place.placeId)
      const resp = await Session.User.Delete(`v1/favPlaces/${favPlace._id}`, body)

      const favorites = this.props.favorite.filter(pipe => pipe.placeId !== resp.placeId)
      this.props.dispatch(Address.setValues({ favorite: favorites }))
    } catch(e) {
      console.log(e)
    }
  }

  onEnterKeywords(keywords) {
    this.timer && clearTimeout(this.timer)
    this.timer = setTimeout(async () => {
      if (keywords.length === 0) return this.setState({ searchRet: undefined })
      try {
        const { lat, lng } = this.props.location
        const city = await Session.Lookup_CN.Get(`v1/map/search/city/${lat},${lng}`)
        const { data } = await Session.Lookup_CN.Get(`v1/map/search/address/${city.data}/${keywords}`)
        this.setState({ searchRet: dataContrast.cloneWithRows(data) })
      } catch (e) {
        console.log(e)
      }
    }, 350)
  }

  render() {
    const { type } = this.props.navigation.state.params
    const { searchRet, fav } = this.state
    const onPressCancel = () => this.props.navigation.goBack()
    const onChangeWords = (words) => this.onEnterKeywords(words)
    const { i18n, favorite } = this.props

    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <StatusBar animated={true} hidden={false} backgroundColor={'white'} barStyle={'dark-content'} />
        {/* NavBar */}
        <View style={{ paddingTop: Define.system.ios.x ? 22 : 0 }}>
          <View style={{ height: Platform.select({ ios: 64, android: 44 }), backgroundColor: 'white', justifyContent: 'flex-end' }}>
            <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', height: 44 }}>
              <View style={{ flex: 1, paddingHorizontal: 12 }}>
                <TextInput
                  {...Define.TextInputArgs}
                  clearTextOnFocus={false}
                  onChangeText={onChangeWords}
                  placeholder={i18n.please_enter_keywords}
                  style={[
                    { height: 44, fontWeight: '400', fontSize: TextFont.TextSize(15), color: '#666' }
                  ]
                } />
              </View>
              <View style={{ height: 22, width: 1, backgroundColor: '#e2e2e2' }} />
              <View style={{ width: 70 }}>
                <Button onPress={onPressCancel} style={{ justifyContent: 'center', height: 44 }}>
                  <Text style={{ fontWeight: '400', fontSize: TextFont.TextSize(15), color: '#888' }}>{i18n.cancel}</Text>
                </Button>
              </View>
            </View>
          </View>
          <View style={{ height: .8, backgroundColor: '#e2e2e2' }} />
        </View>

        {/* List */}
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <ListView
            enableEmptySections={true}
            dataSource={searchRet || fav}
            renderRow={(rowData) => (
              <PickAddressRowItem
                onPress={() => {
                  this.props.dispatch(booking.passengerSetValue({ [type]: rowData }))
                  this.props.dispatch(booking.passengerSetStatus(BOOKING_STATUS.PASSGENER_BOOKING_PICKED_ADDRESS))
                  this.props.navigation.goBack()
                }}
                onPressStar={() => {
                  if (favorite.find(pipe => pipe.placeId == rowData.placeId)) {
                    this._deleteFavPlace(rowData)
                  } else {
                    this._addedFavPlace(rowData)
                  }
                }}
                isAddedFav={favorite.find(pipe => pipe.placeId == rowData.placeId)}
                data={rowData}
              />
            )}
            renderSeparator={() => <View style={{ marginLeft: 15, borderColor: '#eee', borderBottomWidth: 0.8 }} />}
            style={{ flex: 1, borderRadius: 4 }}
          />
        </View>
      </View>
    )
  }
})

class PickAddressRowItem extends PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    const { onPress, onPressStar = () => {}, data } = this.props
    const { address, name } = data
    // const { isAddedFav } = this.state

    return (
      <Button onPress={onPress} style={{ height: 48, flex: 1, backgroundColor: 'white', alignItems: 'flex-start', paddingRight: 15 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <TouchableOpacity activeOpacity={0.7} onPress={onPressStar}>
            <View style={{ width: 48, height: 48 }}>
              <View style={{ marginTop: 12, marginLeft: 10 }}>
                {
                  this.props.isAddedFav ?
                  Icons.Generator.Material('star', 24, '#f3ae3d') :
                  Icons.Generator.Material('star-border', 24, '#e3e3e3')
                }
              </View>
              {/* { type === 'favorite' && Icons.Generator.Material('star', 24, '#f3ae3d') }
              { type === 'history' && Icons.Generator.Material('history', 24, '#999') }
              { type === 'keywords' && Icons.Generator.Material('my-location', 24, '#999') } */}
            </View>
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <Text style={{ color: '#666', fontSize: TextFont.TextSize(15), fontWeight: '400' }}>{ name }</Text>
          </View>
        </View>
      </Button>
    )
  }
}
