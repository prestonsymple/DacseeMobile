import React, { PureComponent, Component } from 'react'
import {
  Text, View, TouchableOpacity, ListView, TextInput, Image, RefreshControl, ActivityIndicator
} from 'react-native'

import InteractionManager from 'InteractionManager'
import { connect } from 'react-redux'

import { application } from '../../../redux/actions'
import { Icons, Screen, Session, Define, System } from '../../../utils'

const { width, height } = Screen.window

const dataContrast = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1._id !== r2._id, sectionHeaderHasChanged: (s1, s2) => s1 !== s2 })

export default connect(state => ({ }))(class FriendsSearchBase extends Component {

  static navigationOptions = ({ navigation }) => {
    const { search } = navigation.state.params
    return {
      drawerLockMode: 'locked-closed',
      title: '查找朋友'
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      dataSource: dataContrast.cloneWithRows([]),
      countryCode: '+86',
      value: ''
    }
    this.timer
  }

  async componentDidMount() {
    await InteractionManager.runAfterInteractions()
    // const { data } = await Session.user.get(`v1/search?country=CN&userId=${referrer}`)
    // if (!data || data.length === 0) return this.props.dispatch(application.showMessage('该邀请已失效'))
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
  }

  async changeValue(value) {
    const { search } = this.props.navigation.state.params
    const { countryCode } = this.state
    this.setState({ value })
    
    var searchStr = ''
    if (value.length <= 5) return undefined

    if (search === 'Phone') {
      if (!System.Rules.isNumber(value)) return undefined
      searchStr = `&phoneCountryCode=${countryCode}&phoneNo=${value}`
    } else if (search === 'Mail' && System.Rules.isMail(value)) {
      searchStr = `&email=${value}`
    } else if (value.length === 10) {
      searchStr = `&userId=${value}`
    } else {
      return undefined
    }

    this.timer && clearTimeout(this.timer)
    this.timer = setTimeout(async () => {
      const location = await System.Location.Current()
      const { latitude, longitude } = location
      const placeId = await Session.lookup.get(`v1/lookup/nearbyPlaces?latitude=${latitude}&longitude=${longitude}&resultType=countryOnly`)
      const searchRet = await Session.user.get(`v1/search?country=${placeId.data}${searchStr}`)
      this.setState({ dataSource: dataContrast.cloneWithRows(searchRet.data) })
    }, 600)
  }

  render() {
    const { search } = this.props.navigation.state.params
    const { countryCode = '' } = this.state

    return (
      <View style={{ flex: 1 }}>
        <ListView 
          dataSource={this.state.dataSource} 
          enableEmptySections={true}
          renderHeader={() => (
            <View style={{ backgroundColor: '#f8f8f8', borderBottomWidth: 1, borderColor: '#f2f2f2', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 4 }}>
              <View style={{ flexDirection: 'row', borderRadius: 18, backgroundColor: 'white', paddingHorizontal: 15 }}>
                {
                  search.toLocaleLowerCase() === 'phone' ? (
                    <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center', left: -5 }}>
                      <TouchableOpacity onPress={() => this.props.navigation.navigate('PublicPickerCountry', {
                        onPress: ({ name, code }) => this.setState({ countryCode: code })
                      })} activeOpacity={.7} style={{ flexDirection: 'row', height: 26, borderRadius: 16, backgroundColor: '#3b90f7', width: 68, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', fontSize: 13, fontWeight: '400' }}>{countryCode}</Text>
                        { Icons.Generator.Material('arrow-drop-down', 14, 'white') }
                      </TouchableOpacity>
                      <TextInput {...Define.TextInputArgs} 
                        placeholder={'请输入您要搜索的电话号码'}
                        onChangeText={value => this.changeValue(value)} 
                        returnKeyType={'search'}
                        style={{ height: 36, flex: 1, color: '#666', fontSize: 13, marginLeft: 5 }} 
                      />
                    </View>
                  ) : (
                    <TextInput {...Define.TextInputArgs} 
                      onChangeText={value => this.changeValue(value)} 
                      placeholder={'请输入您要搜索的用户账号或邮箱'} 
                      style={{ height: 36, flex: 1, color: '#666', fontSize: 13, marginLeft: 5 }} />
                  )
                }
              </View>
            </View>
          )}
          renderSeparator={() => (<View style={{ paddingLeft: 15 }}><View style={{ height: .8, backgroundColor: '#f2f2f2' }} /></View>)}
          renderRow={({ _id, avatars, fullName, userId }) => (
            <TouchableOpacity activeOpacity={.7} onPress={() => this.props.navigation.navigate('FriendsRequest', { referrer: userId, id: _id })} style={{ height: 58, backgroundColor: 'white', paddingHorizontal: 15 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
                <View style={{ justifyContent: 'center', marginRight: 12 }}>
                  <Image style={{ width: 42, height: 42, borderRadius: 21 }} source={{ uri: avatars[0].url }} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, color: '#666', marginBottom: 2 }}>{ fullName }</Text>
                  <Text style={{ fontSize: 12, color: '#666' }}>{ userId }</Text>
                </View>
                <View>
                  { Icons.Generator.Material('chevron-right', 26, '#999') }
                </View>
              </View>
            </TouchableOpacity>
          )}
          style={{ flex: 1 }}
        />
      </View>
    )
  }
})