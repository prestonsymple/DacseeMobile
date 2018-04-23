
import React, { Component, PureComponent } from 'react'
import {
  Text, View, Animated, StyleSheet, StatusBar, Image, TouchableOpacity, TouchableHighlight,
  DeviceEventEmitter, TextInput, Easing, ListView, ScrollView, RefreshControl
} from 'react-native'
import InteractionManager from 'InteractionManager'
import { NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'

import { Screen, Icons, Redux, Define, System, Session ,TextFont} from '../../utils'
import { Button } from '../../components'
import Resources from '../../resources'
import { application, wallet as Wallet } from '../../redux/actions'

const { height, width } = Screen.window

const dataContrast = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

// export default connect(state => ({ data: state.booking })) // TEST
export default connect(state => ({
  ...state.wallet,
  i18n: state.intl.messages || {}
}))(class WalletBalanceScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const reducer = global.store.getState()
    return {
      drawerLockMode: 'locked-closed',
      title: reducer.intl.messages.wallet_lis
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      detail: dataContrast.cloneWithRows(this.props.walletList)
    }
  }

  async componentDidMount() {
    console.log('重载路由')
    // await InteractionManager.runAfterInteractions()
    this._fetchData()
  }

  componentWillReceiveProps(props) {
    if (this.props.walletList !== props.walletList) {
      this.setState({ detail: dataContrast.cloneWithRows(props.walletList) })
    }
  }

  async _fetchData() {
    this.setState({
      loading: true
    })
    // this.props.dispatch(application.showHUD())
    try {
      const resp = await Session.Wallet.Get('v1/wallets')
      this.props.dispatch(Wallet.setValues({ walletList: resp }))
      this.setState({
        detail: dataContrast.cloneWithRows(resp),
        loading: false
      })
    } catch (e) {
      this.props.dispatch(application.showMessage('无法连接到服务器'))
      this.setState({
        loading: false
      })
    } finally {
      // this.props.dispatch(application.hideHUD())
    }
  }

  render() {
    const { detail } = this.state
    const {i18n} = this.props
    const wrapWidth = width

    return (
      <View style={{ backgroundColor: '#f8f8f8', flex: 1 }}>
        <ListView
          refreshControl={
            <RefreshControl
              refreshing={this.state.loading}
              onRefresh={this._fetchData.bind(this)}
              title={i18n.pull_refresh}
              colors={['#ffffff']}
              progressBackgroundColor={'#1c99fb'}
            />
          }
          dataSource={detail}
          enableEmptySections={true}
          renderRow={(row) => <TouchableOpacity onPress={() => {

            this.props.dispatch(Wallet.setValues({ selected_wallet: row}))
            this.props.navigation.navigate('WalletDetail')
          }} activeOpacity={.7}><ListItem data={row} i18n={i18n}/></TouchableOpacity>}
          // renderSeparator={() => <View style={{ height: 2, backgroundColor: '#f2f2f2' }} />}
          style={{ flex: 1, height: 30, marginTop: 15 }}
        />
      </View>
    )
  }
})

class ListItem extends Component {
  render() {
    const { data, i18n} = this.props
    const { type, name, countryName, countryCode, countryFlag, availableAmount, floatingDriverAmount, floatingPassengerAmount } = data
    return (
      <View style={{ marginBottom: 15, width, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <View style={[
          { width: width - 30, borderRadius: 6, backgroundColor: 'white' },
          { shadowOffset: { width: 0, height: 0 }, shadowColor: '#a2a3a8', shadowOpacity: .5, shadowRadius: 3 },
          {  }
        ]}>

          <View style={{ flex: 1, flexDirection: 'column', height: 106 }}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <Image style={{ marginLeft: 15, width: 66, height: 66, borderRadius: 33}}
                source={{ uri: countryFlag }}/>

              <View style={{ marginLeft: 10, justifyContent: 'center'}}>
                <Text style={{ fontSize: TextFont.TextSize(13) }}>{ countryName }</Text>
                <Text style={{ fontSize: TextFont.TextSize(11), color: '#a5a5a5' }}>{ name }</Text>
              </View>

              <View style={{ flex: 1, marginRight: 15, justifyContent: 'center', alignItems: 'flex-end' }}>
                <Text style={{ fontSize: TextFont.TextSize(11), color: '#a5a5a5' }}>
                  <FormattedMessage id={'available_balance'}/>
                </Text>
                <View style={{ flexDirection: 'row'}}>
                  {/* <Text style={{ fontSize: 15, marginTop: 12}}>RM</Text> */}
                  <Text style={{ fontSize: TextFont.TextSize(27)}}>{ availableAmount.toFixed(2) }</Text>
                </View>
              </View>
            </View>
            <View style={{ backgroundColor: '#D8D8D8', opacity: 0.5, height: 1}}></View>
          </View>

          {
            floatingDriverAmount === undefined & floatingPassengerAmount === undefined ?
              null :
              <FloatingAmounView amount={{ floatingDriverAmount: floatingDriverAmount, floatingPassengerAmount: floatingPassengerAmount}} i18n={i18n}/>
          }

        </View>
      </View>
    )
  }
}

class FloatingAmounView extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { floatingPassengerAmount, floatingDriverAmount } = this.props.amount
    const height = (floatingDriverAmount === undefined ? 0 : 50) + (floatingPassengerAmount === undefined ? 0 : 50)
    return (
      <View style={{ backgroundColor: 'white', width: width - 30, marginTop: 1, borderRadius: 6, flexDirection: 'column', height: height}}>
        {
          floatingPassengerAmount === undefined ?
            null :
            <View style={{ flex: 1, paddingLeft:15, paddingTop: 10}}>
              <Text style={{ fontSize: TextFont.TextSize(11), color: '#a5a5a5' }}>{this.props.i18n.float_balance_passenger}</Text>
              <Text style={{ fontSize: TextFont.TextSize(13) }}>{ floatingPassengerAmount.toFixed(2) }</Text>
            </View>
        }
        {
          floatingDriverAmount === undefined ?
            null :
            <View style={{ flex: 1, paddingLeft:15, paddingTop: 5}}>
              <Text style={{ fontSize: TextFont.TextSize(11), color: '#a5a5a5' }}>{this.props.i18n.float_balance_driver}</Text>
              <Text style={{ fontSize: TextFont.TextSize(13) }}>{ floatingDriverAmount.toFixed(2) }</Text>
            </View>
        }
      </View>
    )
  }
}
