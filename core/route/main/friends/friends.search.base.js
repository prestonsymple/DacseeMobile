import React, { PureComponent, Component } from 'react'
import {
  Text, View, TouchableOpacity, ListView, TextInput, Image, RefreshControl, ActivityIndicator
} from 'react-native'

import InteractionManager from 'InteractionManager'
import { connect } from 'react-redux'

import { application } from '../../../redux/actions'
import { Icons, Screen, Session, Define, System,TextFont } from '../../../utils'

const { width, height } = Screen.window

const dataContrast = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1._id !== r2._id, sectionHeaderHasChanged: (s1, s2) => s1 !== s2 })

export default connect(state => ({
  i18n: state.intl.messages || {}
}))(class FriendsSearchBase extends Component {

  static navigationOptions = ({ navigation }) => {
    const { search } = navigation.state.params
    const i18n = global.store.getState().intl.messages
    return {
      drawerLockMode: 'locked-closed',
      title: i18n.search_friend
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      dataSource: dataContrast.cloneWithRows([]),
    }
  }

  async componentDidMount() {
    await InteractionManager.runAfterInteractions()
    const { value, countryCode } = this.props.navigation.state.params

    let searchStr = ''
    if (countryCode) {
      searchStr = `&phoneCountryCode=${countryCode}&phoneNo=${value}`
    } else if (!countryCode && System.Rules.isMail(value)) {
      searchStr = `&email=${value}`
    } else {
      searchStr = `&fullNameOrUserId=${value}`
    }

    try {
      const location = await System.Location.Current()
      const { latitude, longitude } = location
      const placeId = await Session.Lookup.Get(`v1/lookup/nearbyPlaces?latitude=${latitude}&longitude=${longitude}&resultType=countryOnly`)
      const searchRet = await Session.User.Get(`v1/search?country=${placeId}${searchStr}`)
      this.setState({ dataSource: dataContrast.cloneWithRows(searchRet) })
    } catch (e) {
      try {
        const searchRet = await Session.User.Get(`v1/search?country=CN&${searchStr}`)
        this.setState({ dataSource: dataContrast.cloneWithRows(searchRet) })
      } catch (err) {
        this.props.dispatch(application.showMessage('请确认输入是否正确，并再次尝试'))
        this.props.navigation.goBack()
      }
    }
  }

  render() {
    const { i18n } = this.props
    return (
      <View style={{ flex: 1 }}>
        {
          (this.state.dataSource.rowIdentities[0].length === 0) ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', top: -44 }}>
              <ActivityIndicator size='large' color='#999' />
              <Text style={{ color: '#666', fontWeight: '600', marginTop: 12 }}>{i18n.pls_wait}</Text>
            </View>
          ) : (
            <ListView
              dataSource={this.state.dataSource}
              enableEmptySections={true}
              renderSeparator={() => (<View style={{ paddingLeft: 15 }}><View style={{ height: .8, backgroundColor: '#f2f2f2' }} /></View>)}
              renderRow={({ _id, avatars, fullName, userId }) => (
                <TouchableOpacity activeOpacity={.7} onPress={() => this.props.navigation.navigate('FriendsRequest', { referrer: userId, id: _id, i18n})} style={{ height: 58, backgroundColor: 'white', paddingHorizontal: 15 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
                    <View style={{ justifyContent: 'center', marginRight: 12 }}>
                      <Image style={{ width: 42, height: 42, borderRadius: 21 }} source={{ uri: avatars[avatars.length - 1].url }} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: TextFont.TextSize(16), color: '#666', marginBottom: 2 }}>{ fullName }</Text>
                      <Text style={{ fontSize: TextFont.TextSize(12), color: '#666' }}>{ userId }</Text>
                    </View>
                    <View>
                      { Icons.Generator.Material('chevron-right', 26, '#999') }
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              style={{ flex: 1 }}
            />
          )
        }
      </View>
    )
  }
})
