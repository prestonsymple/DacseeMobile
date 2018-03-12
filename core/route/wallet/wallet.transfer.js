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

const {height, width} = Screen.window

const styles = StyleSheet.create({
  pageWrap: { width: width, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white' },
  itemWrap: { alignItems: 'center', justifyContent: 'center' },
  itemTitle: { color: '#666', fontSize: 14, fontWeight: '100', marginBottom: 8 },
  itemImageContent: { marginHorizontal: 6, width: 68, height: 68, borderRadius: 33, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderWidth: 3 },
  itemImage: { opacity: 0.7, width: 66, height: 66, borderRadius: 33, borderWidth: 1.5, borderColor: 'white', resizeMode: 'cover' }
})

export default connect(state => ({ data: state.booking }))(class WalletTransferScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      drawerLockMode: 'locked-closed', 
      title: '转账'
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      phoneCountryCode: '+86',
      searchType: 'Phone',
      searchContent: '',
      amount: 0,
      remark: ''
    }
  }

  async _fetchData() {
    const { searchType, searchContent, phoneCountryCode, amount, remark }=this.state
    var body
    if (searchType == 'Phone') {
      body = {
        country: 'CN',
        phoneCountryCode: phoneCountryCode,
        phoneNo: searchContent
      }
    } else if (searchType == 'Email') {
      body = {
        country: 'CN',
        email: searchContent
      }
    } else {
      body = {
        country: 'CN',
        userId: searchContent
      }
    }

    var url = ''
    for (var item in body) {
      url = url + (url == '' ? '' : '&') + item + '=' + body[item]
    }

    await InteractionManager.runAfterInteractions()
    
    const resp = await Session.user.get('v1/search?' + url)
    // console.log('[账户]' + resp)
    const transferInfo = {
      wallet: this.props.navigation.state.params.walletInfo,
      userList: resp.data,
      amount:  amount,
      remark: remark
    }
    // console.log(transferInfo)
    // this.props.navigation.navigate('WalletTransferSelection', { transferInfo: transferInfo })
    resp.data.length == 1 ? this.props.navigation.navigate('WalletTransferSummary', { transferInfo: transferInfo }) : this.props.navigation.navigate('WalletTransferSelection', { transferInfo: transferInfo })
    this.setState({
      
    })
  }

  render() {
    return (      
      <ScrollView style={{ flex: 1, backgroundColor: 'white' }} horizontal={false} keyboardDismissMode={ 'onDrag' } >
        <View style={{ padding:20 }}>
          <View style={{ borderBottomWidth: 1, borderBottomColor: '#a5a5a5'}}>
            <Text style={{ fontSize: 12, opacity: 0.5 }}>Sending Amount</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', height: 40}}>
              <Text style={{ fontSize: 14 }}>RM</Text>
              <TextInput style={{ flex: 1, paddingLeft: 10, fontSize: 14}} placeholder={'0.00'} keyboardType={ 'number-pad' } onChangeText={ (value) => this.setState({ amount: value}) } />
            </View>
          </View>

          <View style={{ paddingTop: 20, borderBottomWidth: 1, borderBottomColor: '#a5a5a5'}}>
            <Text style={{ fontSize: 12, opacity: 0.5 }}>Recipient Account</Text>            
            <CheckBox titles={[ 'Phone', 'Email', 'User ID']} style={{ flex: 1, height: 44, backgroundColor: 'red' }} 
              onPress={ (index, title) => {
                this.setState({
                  searchType: title
                })
              }}/>                   
          </View>
          
          <View style={{ paddingTop: 20, borderBottomWidth: 1, borderBottomColor: '#a5a5a5'}}>
            <Text style={{ fontSize: 12, opacity: 0.5 }}>Recipient Contact Number</Text>
            <View style={{ flex: 1, flexDirection: 'row' }}>              
              {
                this.state.searchType  == 'Phone' ?
                  (
                    <Button style={{ marginRight: 10, height: 40, width: 60, justifyContent: 'center' }}
                      onPress={() => this.props.navigation.navigate('WalletPickerCountry', {
                        onPress: ({ name, code }) => this.setState({ phoneCountryCode: code })
                      })} >
                      <Text style={{}}>{ this.state.phoneCountryCode }</Text>
                    </Button>
                  ) : null
              }
              <TextInput style={{ flex: 1, fontSize: 14, height: 40, justifyContent: 'center' }} placeholder={ this.state.searchType } onChangeText={ (value) => this.setState({searchContent: value}) } />
            </View>                        
          </View>

          <View style={{ paddingTop: 20, borderBottomWidth: 1, borderBottomColor: '#a5a5a5'}}>
            <Text style={{ fontSize: 12, opacity: 0.5 }}>Remarks</Text>
            <TextInput style={{ marginVertical: 10, fontSize: 14, height: 70}} placeholder={'Please Enter'} multiline={true} onChangeText={ (value) => this.setState({ remark: value}) }/>
          </View>

          <View style={{ paddingTop: 30, flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
            <Button onPress={ () => {
              if (this.state.searchContent == '' | this.state.amount == 0 ) { 
                this.props.dispatch(application.showMessage('请输入转账金额和接收人账号'))
              } else {
                this._fetchData()                
              }                
            }       
              // this.props.navigation.navigate('WalletTransferSelection')
            } style={{ width:240, height: 44, backgroundColor: '#4cb1f7', borderRadius: 4 }}>
              <Text style={{ fontSize: 20, color: 'white' }}>CONTINUE</Text>
            </Button>
          </View>
        </View>
      </ScrollView>       
    )
  }
})

class CheckBox extends Component {
  constructor(props) {
    super(props)
    this.state = {
      titles: this.props.titles,
      selectIndex: 0
    }
  }

  render() {
    const { titles, selectIndex } = this.state
    return (
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
        {
          titles.map( (item, index) => {
            return (
              <Button key={ index } onPress={ () => {
                this.setState({
                  selectIndex: index
                })              
                this.props.onPress(index, item)
              }} style={{ height: 40, justifyContent: 'center' }}>
                <Text style={ selectIndex == index ? { fontSize: 17, color: '#FFB639' } : { fontSize: 14, color: '#a5a5a5', opacity: 0.7 } }>{ item }</Text>
              </Button> 
            )             
          })
        }                     
      </View> 
    )
  }
}