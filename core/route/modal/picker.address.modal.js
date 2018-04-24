/* eslint-disable */
import React, { Component, PureComponent } from 'react'
import {
  View, TouchableOpacity, Modal, Text, Animated, Alert, AppState, TextInput, ScrollView, ListView, Platform,
  StatusBar
} from 'react-native'
import InteractionManager from 'InteractionManager'
import * as Progress from 'react-native-progress'
import CodePush from 'react-native-code-push'
import Axios from 'axios'
import lodash from 'lodash'
import { connect } from 'react-redux'
import { NavigationActions, SafeAreaView } from 'react-navigation'

/*****************************************************************************************************/
import { application, booking, address as Address } from '../../redux/actions'
import { System, Icons, Screen, Define, Session ,TextFont } from '../../utils'
import { Button } from '../../components'
import { BOOKING_STATUS } from '../main'
/*****************************************************************************************************/

const dataContrast = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

export default connect(state => ({
  location: state.account.location,
  i18n: state.intl.messages,
  map_mode: state.application.map_mode,
  favorite: state.address.favorite,
  from: state.booking.from
}))(class SelectAddressModal extends Component {

  constructor(props) {
    super(props)
    const favorite = props.favorite.map(pipe => Object.assign({}, pipe, { star: true }))
    this.state = {
      data: [],
      dataSource: dataContrast.cloneWithRows(favorite)
    }
    this._keywords = ''
  }

  componentWillReceiveProps(props) {
    if (props.favorite && props.favorite !== this.props.favorite && this._keywords.length === 0) {
      this.setState({ dataSource: dataContrast.cloneWithRows(props.favorite) })
    }

    if (props.favorite && props.favorite !== this.props.favorite && this._keywords.length !== 0) {
      const data = this.state.data.map(pipe => Object.assign({}, pipe, { 
        star: props.favorite.find(sub => pipe.placeId === sub.placeId) !== undefined
      }))
      this.setState({ dataSource: dataContrast.cloneWithRows(data) })
    }
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
  }

  async componentDidMount() {
    await InteractionManager.runAfterInteractions()
    if (this.props.favorite.length === 0) this._fetchData()
  }

  async _fetchData() {
    try {
      const resp = await Session.User.Get('v1/favPlaces')
      const favorite = resp.map(pipe => Object.assign({}, pipe, { star: true }))
      this.props.dispatch(Address.setValues({ favorite }))
    } catch(e) {
      /*  */
    }
  }

  async onPressStar(row) {
    try {
      const { 
        _id = (this.props.favorite.find(pipe => pipe.placeId === row.placeId) || {})._id,
        coords
      } = row
      const { lat, lng } = coords
      const body = Object.assign({}, row, { latitude: lat, longitude: lng })

      let favorite = lodash.cloneDeep(this.props.favorite)
      if (_id) { 
        // ROMOVE
        const resp = await Session.User.Delete(`v1/favPlaces/${_id}`, body)
        favorite = favorite.filter(pipe => pipe.placeId !== row.placeId)
      } else {
        // APPEND
        const resp = await Session.User.Post('v1/favPlaces/user', body)
        favorite.push(resp)
      }
      
      favorite = favorite.map(pipe => Object.assign(pipe, { star: true }))
      this.props.dispatch(Address.setValues({ favorite }))
    } catch(e) {
      /*  */
    }
  }

  onEnterKeywords(keywords) {
    this._keywords = keywords
    if (keywords.length === 0) {
      this.setState({ dataSource: dataContrast.cloneWithRows(this.props.favorite) })
    } else {
      this.setState({ dataSource: dataContrast.cloneWithRows([]) })
      this.timer && clearTimeout(this.timer)
      this.timer = setTimeout(async () => {
        try {
          const { map_mode, from = { coords: {} }, location, favorite } = this.props
          const { lat = location.lat, lng = location.lng } = from.coords
          
          if (map_mode === 'GOOGLEMAP') {
            const { data } = await Axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${1000 * 100}&keyword=${keywords}&key=AIzaSyA5BPIUMN2CkQq9dpgzBr6XYOAtSdHsYb0`)
            const { results } = data
            const resultMap = results.map(pipe => ({
              star: favorite.find(sub => pipe.place_id === sub.placeId),
              placeId: pipe.place_id, name: pipe.name, address: pipe.vicinity,
              coords: {
                lng: pipe.geometry.location.lng, lat: pipe.geometry.location.lat
              }
            }))
            this.setState({ dataSource: dataContrast.cloneWithRows(resultMap), data: resultMap }) 
          } else {
            const city = await Session.Lookup_CN.Get(`v1/map/search/city/${lat},${lng}`)
            let { data } = await Session.Lookup_CN.Get(`v1/map/search/address/${city.data}/${keywords}`)
            data = data.map(pipe =>Object.assign({}, pipe, {
              star: favorite.find(sub => pipe.placeId === sub.placeId) 
            }))
            this.setState({ dataSource: dataContrast.cloneWithRows(data), data }) 
          }
        } catch (e) { /*  */ }
      }, 400)
    }
  }

  render() {
    const { type } = this.props.navigation.state.params
    const { dataSource } = this.state
    const { favorite, i18n } = this.props
    const onPressCancel = () => this.props.navigation.goBack()
    const onChangeWords = (words) => this.onEnterKeywords(words)

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
            dataSource={dataSource}
            renderRow={(rowData) => (
              <PickAddressRowItem
                onPress={() => {
                  this.props.dispatch(booking.passengerSetValue({ [type]: rowData }))
                  this.props.dispatch(booking.passengerSetStatus(BOOKING_STATUS.PASSGENER_BOOKING_PICKED_ADDRESS))
                  this.props.navigation.goBack()
                }}
                onPressStar={() => this.onPressStar(rowData)}
                data={ rowData }
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

  render() {
    const { onPress, onPressStar = () => {}, data } = this.props
    const { address, name, star } = data
    // const { isAddedFav } = this.state

    return (
      <Button onPress={onPress} style={{ height: 48, flex: 1, backgroundColor: 'white', alignItems: 'flex-start', paddingHorizontal: 15 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <TouchableOpacity activeOpacity={0.7} onPress={onPressStar}>
            <View style={{ width: 48, height: 48 }}>
              <View style={{ marginTop: 12, marginLeft: 10 }}>
                {
                  star ?
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
