import React, { Component, PureComponent } from 'react'
import {
  Text, View, Animated, StyleSheet, StatusBar, Image, TouchableOpacity, TouchableHighlight,
  DeviceEventEmitter, TextInput, Easing, ListView, ScrollView
} from 'react-native'
import InteractionManager from 'InteractionManager'
import { NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'

import { Screen, Icons, Redux, Define, System, Session,TextFont } from '../../utils'
import { Button } from '../../components'
import Resources from '../../resources'
import { application, wallet as Wallet } from '../../redux/actions'
import WalletTransactionListScreen from '../wallet/wallet.transaction.list'
import IncomeList from '../income/income.list'

const { height, width } = Screen.window

const styles = StyleSheet.create({
  pageWrap: { width: width, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white' },
  itemWrap: { alignItems: 'center', justifyContent: 'center' },
  itemTitle: { color: '#666', fontSize: TextFont.TextSize(14), fontWeight: '100', marginBottom: 8 },
  itemImageContent: { marginHorizontal: 6, width: 68, height: 68, borderRadius: 33, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderWidth: 3 },
  itemImage: { opacity: 0.7, width: 66, height: 66, borderRadius: 33, borderWidth: 1.5, borderColor: 'white', resizeMode: 'cover' }
})

export default connect(state => ({
  ...state.wallet,
  i18n: state.intl.messages || {}
}))(class WalletDetailScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    const reducer = global.store.getState()
    return {
      drawerLockMode: 'locked-closed',
      title: reducer.intl.messages.wallet_detail
    }
  }

  // constructor(props) {
  //   super(props)

  //   this.state = {
  //     walletInfo: this.props.selected_wallet
  //   }
  //   console.log('选中的钱包', props.selected_wallet)
  // }

  render() {
    const { selected_wallet,i18n } = this.props
    const { name, country, countryFlag, availableAmount } = selected_wallet
    let countryName=name.split(' ')[0]
    let walletName=name.split(' ')[1]

    console.log(availableAmount)
    return (
      <View style={{ backgroundColor: '#f8f8f8', flex: 1  }}>
        <View style={{ width: width, height: 150, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
          <Image style={{ width: 66, height:66, borderRadius: 33}}
            source={{ uri: countryFlag }}/>
          {/* <Text style={{ fontSize:13, paddingTop: 10 }}>{ country }</Text>
          <Text style={{ fontSize:13, color: '#a5a5a5' }}>{ name }</Text> */}
          <Text style={{ fontSize:TextFont.TextSize(13), paddingTop: 10 }}>{ countryName }</Text>
          <Text style={{ fontSize:TextFont.TextSize(13), color: '#a5a5a5' }}>{ walletName }</Text>
        </View>
        <ScrollTabView onNavigate={ () => availableAmount == 0 ? this.props.dispatch(application.showMessage(this.props.i18n.lack_balance)) : this.props.navigation.navigate('WalletTransfer')} walletInfo={ selected_wallet }/>
      </View>
    )
  }
})

class ScrollTabView extends Component {
  constructor(props) {
    super(props)
    // console.log(this.props.walletInfo)
    this.state = {
      // containerWidth: width,
      currentPage: 0
    }
  }

  _goToPage(pageNum, scrollAnimation = true) {
    if (this._scrollView && this._scrollView.scrollTo) {
      this._scrollView.scrollTo({x: pageNum * width, scrollAnimation})
      this.setState({
        currentPage: pageNum,
      })
    }
  }
  _renderTabView() {
    let array = ['overView', 'transaction']
    if(this.props.walletInfo.type == 'DS-US') array.push('floating_comm')
    return (
      <View style={{ width: width, height: 50, flexDirection: 'row', backgroundColor: 'white'}} >
        {
          array.map((item, index) => {
            return (
              <Button key={ index }
                style={ [{ flex: 1, justifyContent: 'center', alignItems:'center' }, index == this.state.currentPage ? { borderBottomWidth: 3, borderColor: '#FFB639' } : {}]}
                onPress={ () => {
                  this.setState({
                    currentPage: index
                  })
                  this._goToPage(index)
                }}>
                <Text style={ [{ fontSize: TextFont.TextSize(15) },  index == this.state.currentPage ? {color: '#FFB639' } : {color: '#a5a5a5', opacity: 0.7}] }>
                  <FormattedMessage id={item}/>
                </Text>
              </Button>
            )
          })
        }
      </View>
    )
  }

  _renderScrollContent() {
    let array = [<OverView key={1} onNavigate={ this.props.onNavigate } walletInfo={ this.props.walletInfo }/>,
      <WalletTransactionListScreen key={2} walletInfo={ this.props.walletInfo }/>]
    if(this.props.walletInfo.type == 'DS-US') array.push(<IncomeList key={3} walletInfo={ this.props.walletInfo }/>)
    return (
      <ScrollView
        ref={ (ref) => {
          this._scrollView = ref
        }}
        style={{ flex: 1}}
        scrollEnabled={false}
        pagingEnabled={true}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        // contentOffset={{x:this.state.currentPage*width, y:0}}
        // onMomentumScrollEnd={this._onMomentumScrollBeginAndEnd}

      >
        {
          array.map((item, index) => {
            return (
              item
            )
          })
        }
      </ScrollView>
    )
  }

  render() {
    return (
      <View style={{ flex: 1}}>
        <View style={{ height: 1, backgroundColor: '#D8D8D8', opacity: 0.5}}></View>
        { this._renderTabView()}
        { this._renderScrollContent()}
      </View>
    )
  }
}

// OverView
class OverView extends Component {
  _renderItem(obj) {
    return (
      <View key={obj.name} style={{ marginHorizontal: 20, height: 44, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <Text style={{ fontSize: TextFont.TextSize(13), color: '#a5a5a5', }}>
          <FormattedMessage id={obj.name} value={TextFont.TextSize(18)}/>
        </Text>
        <Text style={{ fontSize: TextFont.TextSize(18) }}>{obj.value.toFixed(2)}</Text>
      </View>
    )
  }

  render() {
    const { availableAmount, floatingDriverAmount, floatingPassengerAmount } = this.props.walletInfo
    // console.log(availableAmount, floatingDriverAmount, floatingPassengerAmount)
    return (
      <View style={{ flex: 1, width: width, marginTop: 20 }}>
        {
          this._renderItem({name: 'available_balance', value: availableAmount})
        }
        {/*  {
          this._renderItem({name: '可用余额（乘客）', value: floatingPassengerAmount})
        }
        {
          this._renderItem({name: '可用余额（司机）', value: floatingDriverAmount})
        } */}
        <View style={{ paddingTop: 30, flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
          <Button onPress={ this.props.onNavigate } style={{ width:240, height: 44, backgroundColor: '#4cb1f7', borderRadius: 4 }}>
            <Text style={{ fontSize: TextFont.TextSize(20), color: 'white' }}>
              <FormattedMessage id={'transfer'}/>
            </Text>
          </Button>
        </View>
      </View>
    )
  }
}
