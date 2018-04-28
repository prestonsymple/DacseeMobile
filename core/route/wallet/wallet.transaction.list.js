import React, { Component } from 'react'
import {
  Text,
  View,
  ListView,
  RefreshControl,
  Image
} from 'react-native'
import InteractionManager from 'InteractionManager'
import { connect } from 'react-redux'
import moment from 'moment'
import { Screen, Icons, Redux, Define, System, Session, TextFont } from '../../utils'
import { Button } from '../../components'
import Resources from '../../resources'
import { application, wallet as Wallet } from '../../redux/actions'

const { height, width } = Screen.window

const dataContrast = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

export default connect(state => ({
  ...state.wallet,
  i18n: state.intl.messages || {}
}))(class WalletTransactionListScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    const reducer = global.store.getState()
    return {
      drawerLockMode: 'locked-closed',
      title: reducer.intl.messages.wallet
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      detail: dataContrast.cloneWithRows([])
    }
  }

  async componentDidMount() {
    await InteractionManager.runAfterInteractions()
    this._fetchData()
  }

  async _fetchData(index = 0) {
    this.setState({
      loading: true
    })
    try {
      const resp = await Session.Wallet.Get(`v1/walletTransactions?walletType=${this.props.walletInfo.type}`)
      this.setState({
        loading: false,
        detail: dataContrast.cloneWithRows(resp)
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
    const { i18n } = this.props
    return (
      <View style={{ backgroundColor: '#f8f8f8', flex: 1, width: width }}>
        {/* DETAIL */}
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
          renderRow={(row) => <DetailItem data={row} />}
          renderSectionHeader={() => (
            <View style={{ height: 2 }}></View>
          )}
          renderSeparator={() => <View style={{ height: 2, backgroundColor: '#f2f2f2' }} />}
        />
      </View>
    )
  }
})

class DetailItem extends Component {

  render() {
    const { data } = this.props
    const { type, amount, remarks, yourRef } = data
    const timestamp = moment(new Date(data.timestamp).getTime()).format('YYYY-MM-DD HH:mm:ss')
    return (
      <View style={{ paddingHorizontal: 26, paddingVertical: 14, flex: 1, backgroundColor: 'white', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
        {/* <View style={{  }}> */}
        <View style={{ width: 40 }}>
          <Image source={amount > 0 ? Resources.image.transfer_in : Resources.image.transfer_out} />
          {/*{*/}

          {/*amount > 0?*/}
          {/*Icons.Generator.Material('arrow-upward', 18, '#e74a6e') :*/}
          {/*Icons.Generator.Material('arrow-downward', 18, '#6bd19e')*/}
          {/*}*/}
        </View>
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          <Text ellipsizeMode={'middle'} numberOfLines={1} style={{ fontSize: TextFont.TextSize(15), color: '#333', fontWeight: System.Platform.Android ? '400' : '600', marginBottom: 4 }}>{type}</Text>
          {
            yourRef.length === 0 ? (
              <Text style={{ fontSize: TextFont.TextSize(12), color: '#666' }}>{yourRef.toUpperCase()}</Text>
            ) :
              (
                <View>
                  <View style={{ flexDirection: 'row', marginBottom: 4 }}>
                    <Text style={{ fontSize: TextFont.TextSize(12), color: '#666', fontWeight: '400', top: .5 }}>{timestamp}</Text>
                  </View>
                  <Text style={{ fontSize: TextFont.TextSize(12), color: '#666' }}>{yourRef.toUpperCase()}</Text>
                </View>
              )
          }
        </View>
        <View style={{ width: 80, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
          {/* {
            type === 'in' ?
              <Text style={{ fontSize: 18, textAlign: 'right', color: '#e74a6e', fontWeight: '400', fontFamily: 'Cochin', top: System.Platform.Android ? 0 : -2.5, marginRight: 5 }}>+</Text> :
              <Text style={{ fontSize: 18, textAlign: 'right', color: '#6bd19e', fontWeight: '400', fontFamily: 'Cochin', top: System.Platform.Android ? 0 : -2.5, marginRight: 5 }}>-</Text>
          } */}
          <Text style={{ fontSize: TextFont.TextSize(18), textAlign: 'right', color: '#555', fontWeight: System.Platform.Android ? '200' : '400', fontFamily: 'Cochin' }}>{amount.toFixed(2)}</Text>
        </View>
        {/* </View> */}
      </View>
    )
  }
}
