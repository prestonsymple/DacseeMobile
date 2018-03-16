import React, { Component, PureComponent } from 'react'
import { 
  Text, View, Animated, StyleSheet, StatusBar, Image, TouchableOpacity, TouchableHighlight, 
  DeviceEventEmitter, TextInput, Easing, ListView, ScrollView
} from 'react-native'
import InteractionManager from 'InteractionManager'
import { NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'

import { Screen, Icons, Redux, Define, System, Session } from '../../utils'
import { Button } from '../../components'
import Resources from '../../resources'
import { application, booking } from '../../redux/actions'
import WalletTransactionListScreen from '../wallet/wallet.transaction.list'
import IncomeList from '../income/income.list'

const { height, width } = Screen.window

const styles = StyleSheet.create({
  pageWrap: { width: width, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white' },
  itemWrap: { alignItems: 'center', justifyContent: 'center' },
  itemTitle: { color: '#666', fontSize: 14, fontWeight: '100', marginBottom: 8 },
  itemImageContent: { marginHorizontal: 6, width: 68, height: 68, borderRadius: 33, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderWidth: 3 },
  itemImage: { opacity: 0.7, width: 66, height: 66, borderRadius: 33, borderWidth: 1.5, borderColor: 'white', resizeMode: 'cover' }
})

export default class WalletDetailScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      drawerLockMode: 'locked-closed', 
      title: '钱包详情'
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      walletInfo: this.props.navigation.state.params.walletInfo,
    }
  }

  render() {
    const { name, country, countryFlag } = this.state.walletInfo
    return (
      <View style={{ backgroundColor: '#f8f8f8', flex: 1  }}>
        <View style={{ width: width, height: 150, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
          <Image style={{ width: 66, height:66, borderRadius: 33}}
            source={{ uri: countryFlag }}/>
          <Text style={{ fontSize:13, paddingTop: 10 }}>{ country }</Text>
          <Text style={{ fontSize:13, color: '#a5a5a5' }}>{ name }</Text>
        </View>
        <ScrollTabView onNavigate={ () => this.props.navigation.navigate('WalletTransfer', { walletInfo: this.state.walletInfo})} walletInfo={ this.state.walletInfo }/>
      </View>
    )
  }
}

class ScrollTabView extends Component {
  constructor(props) {
    super(props)
    // console.log(this.props.walletInfo)
    this.state = {
      // containerWidth: width,
      currentPage: 0
    }
  }

  // 获取页面
  // _onMomentumScrollBeginAndEnd = (e) => {
  //   let offsetX = e.nativeEvent.contentOffset.x;
  //   let page = Math.round(offsetX / width);
  //   if (this.state.currentPage !== page) {
  //     console.log('当前页面-->'+page);
  //     this.setState({
  //       currentPage: page,
  //     });
  //   }
  // }

  _goToPage(pageNum, scrollAnimation = true) { 
    if (this._scrollView && this._scrollView.scrollTo) {
      this._scrollView.scrollTo({x: pageNum * width, scrollAnimation});
      this.setState({
        currentPage: pageNum,
      });
    }
  }
  _renderTabView() {
    return (
      <View style={{ width: width, height: 50, flexDirection: 'row', backgroundColor: 'white'}} >
        {
          ['概览', '转账记录', '浮动'].map((item, index) => {          
            return (
              <Button key={ index } 
                style={ [{ flex: 1, justifyContent: 'center', alignItems:'center' }, index == this.state.currentPage ? { borderBottomWidth: 3, borderColor: '#FFB639' } : {}]}
                onPress={ () => {                  
                  this.setState({
                    currentPage: index
                  })
                  this._goToPage(index)
                }}>
                <Text style={ [{ fontSize: 15 },  index == this.state.currentPage ? {color: '#FFB639', borderBottomWidth: 3, borderColor: '#FFB639' } : {color: '#a5a5a5', opacity: 0.7}] }>{ item }</Text>
              </Button>
            )
          })
        }
      </View>
    )
  }  

  _renderScrollContent() {
    return (
      <ScrollView 
        ref={ (ref) => {
          this._scrollView = ref
        }}
        style={{ flex: 1}}
        scrollEnabled={false}
        pagingEnabled={true}
        horizontal={true}
        // contentOffset={{x:this.state.currentPage*width, y:0}}
        // onMomentumScrollEnd={this._onMomentumScrollBeginAndEnd}
        
      >
        {
          [<OverView key={1} onNavigate={ this.props.onNavigate } walletInfo={ this.props.walletInfo }/>, 
            <WalletTransactionListScreen key={2} walletInfo={ this.props.walletInfo }/>, 
            <IncomeList key={3} walletInfo={ this.props.walletInfo }/>].map((item, index) => {
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
  constructor(props) {
    super(props)
    this.state = {}
  }

  _renderItem(obj) {
    return (      
      <View key={obj.name} style={{ marginHorizontal: 20, height: 44, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <Text style={{ fontSize: 13, color: '#a5a5a5', }}>{obj.name}</Text>
        <Text style={{ fontSize: 18 }}>{obj.value.toFixed(2)}</Text>
      </View>      
    )
  }

  render() {
    const { availableAmount, floatingDriverAmount, floatingPassengerAmount } = this.props.walletInfo
    return (
      <View style={{ flex: 1, width: width, marginTop: 20 }}>
        {
          this._renderItem({name: '可用余额', value: availableAmount})          
        }
        <View style={{ paddingTop: 30, flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
          <Button onPress={ this.props.onNavigate } style={{ width:240, height: 44, backgroundColor: '#4cb1f7', borderRadius: 4 }}>
            <Text style={{ fontSize: 20, color: 'white' }}>转账</Text>
          </Button>
        </View>        
      </View>    
    )
  }
}