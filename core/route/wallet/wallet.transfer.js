import React, { Component, PureComponent } from 'react'
import {
  Text, View,  ScrollView
} from 'react-native'
import InteractionManager from 'InteractionManager'
import { connect } from 'react-redux'
import Input from '../../components/input'
import { Screen, Icons, Redux, Define, System, Session ,TextFont} from '../../utils'
import { Button } from '../../components'
import { application, wallet } from '../../redux/actions'
import { FormattedMessage, injectIntl } from 'react-intl';

const {height, width} = Screen.window


export default connect(state => ({
  ...state.wallet,
  i18n: state.intl.messages || {}
}))(class WalletTransferScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    const reducer = global.store.getState()
    return {
      drawerLockMode: 'locked-closed',
      title: reducer.intl.messages.transfer
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      countryCode: this.props.selected_wallet.countryCode,
      phoneCountryCode: '+86',
      searchType: 0,
      searchTitle: 'phone',
      searchContent: '',
      amount: 0,
      remark: '',
      searching: false
    }
  }

  async _fetchData() {
    const { countryCode, searchType, searchContent, phoneCountryCode, amount, remark }=this.state
    var body
    if (searchType == 0) {
      body = {
        country: countryCode,
        phoneCountryCode: phoneCountryCode,
        phoneNo: searchContent
      }
    } else if (searchType == 1) {
      body = {
        country: countryCode,
        email: searchContent
      }
    } else {
      body = {
        country: countryCode,
        userId: searchContent
      }
    }

    var url = ''
    for (var item in body) {
      url = url + (url == '' ? '' : '&') + item + '=' + body[item]
    }

    await InteractionManager.runAfterInteractions()

    try {
      this.setState({
        searching: true
      })
      const resp = await Session.User.Get('v1/search?' + url)
      const transferInfo = {
        userList: resp,
        amount:  amount,
        remark: remark
      }

      if (resp.length == 0) {
        this.props.dispatch(application.showMessage(this.props.i18n.error_unable_find_account))
        this.setState({
          searching: false
        })
      } else {
        resp.length == 1 ?
          this.props.navigation.navigate('WalletTransferSummary', { transferInfo: transferInfo }) :
          this.props.navigation.navigate('WalletTransferSelection', { transferInfo: transferInfo })

        this.setState({
          searching: false
        })
      }
    } catch (e) {
      this.props.dispatch(application.showMessage(this.props.i18n.unable_connect_server_pls_retry_later))
      this.setState({
        searching: false
      })
    }
  }

  render() {
    const { searching } = this.state
    return (
      <ScrollView style={{ flex: 1, backgroundColor: 'white' }} horizontal={false} keyboardDismissMode={ 'interactive' } >
        <View style={{ padding:20 }}>
          <View style={{ borderBottomWidth: 1, borderBottomColor: '#a5a5a5'}}>
            <Text style={{ fontSize: TextFont.TextSize(12), opacity: 0.5 ,marginBottom:5}}>
              <FormattedMessage id={'sending_amount'} />
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', height: 40}}>
              {/* <Text style={{ fontSize: 14 }}>RM</Text> */}
              <Input  style={{ flex: 1, fontSize: TextFont.TextSize(14)}} placeholder={'0.00'} keyboardType={ 'numeric' } onChangeText={ (value) => this.setState({ amount: value}) } />
            </View>
          </View>

          <View style={{ paddingTop: 20, borderBottomWidth: 1, borderBottomColor: '#a5a5a5'}}>
            <Text style={{ fontSize: TextFont.TextSize(12), opacity: 0.5,marginBottom:5 }}>
              <FormattedMessage id={'recipient_account_type'}/>
            </Text>
            <CheckBox titles={[ 'phone', 'email', 'userid']} style={{ flex: 1, height: 44 }}
              onPress={ (index, title) => {
                this.setState({
                  searchType: index,
                  searchTitle: title,
                  accountVal:this.state.searchType==index?this.state.accountVal:''
                })
              }}/>
          </View>

          <View style={{ paddingTop: 20, borderBottomWidth: 1, borderBottomColor: '#a5a5a5'}}>
            <Text style={{ fontSize: TextFont.TextSize(12), opacity: 0.5,marginBottom:5 }}>
              <FormattedMessage id={'recipient_account'}/>
            </Text>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              {
                this.state.searchType  == 0 ?
                  (
                    <Button style={{ marginRight: 10, height: 40, width: 60, justifyContent: 'center' }}
                      onPress={() => this.props.navigation.navigate('PublicPickerCountry', {
                        onPress: ({ name, code }) => this.setState({ phoneCountryCode: code })
                      })} >
                      <Text style={{}}>{ this.state.phoneCountryCode }</Text>
                    </Button>
                  ) : null
              }
              <FormattedMessage id={this.state.searchTitle}>
                {
                  msg => (
                    <Input style={{ flex: 1, fontSize: TextFont.TextSize(14), height: 40, justifyContent: 'center' }}
                      value={this.state.accountVal} placeholder={msg}
                      returnKeyType={'done'} onChangeText={ (value) => this.setState({searchContent: value,accountVal:value}) } />
                  )
                }
              </FormattedMessage>
            </View>
          </View>

          <View style={{ paddingTop: 20, borderBottomWidth: 1, borderBottomColor: '#a5a5a5'}}>
            <Text style={{ fontSize: TextFont.TextSize(12), opacity: 0.5 ,marginBottom:5}}>
              <FormattedMessage id={'remarks'} />
            </Text>
            <FormattedMessage id={'pls_enter_remarks'}>
              {
                msg => (
                  <Input style={{ paddingVertical: 10, fontSize: TextFont.TextSize(14), height: 70 ,textAlignVertical: 'top'}} multiline={true} placeholder={msg} returnKeyType={'done'} onChangeText={ (value) => this.setState({ remark: value}) }/>
                )
              }
            </FormattedMessage>
          </View>

          <View style={{ paddingTop: 30, flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
            <Button disabled={ searching } onPress={ () => {
              let reg= /(^(([0-9]+\.[0-9]{1,2})|([0-9]*[1-9][0-9]*\.[0-9]{1,2})|([0-9]*[1-9][0-9]*))$)/
              if (this.state.amount <= 0 | !reg.test(this.state.amount)) {
                this.props.dispatch(application.showMessage(this.props.i18n.pls_enter_correct_amount))
              } else if (this.state.searchContent == '') {
                this.props.dispatch(application.showMessage(this.props.i18n.pls_enter_correct_account))
              } else {
                this._fetchData()
              }
            }
              // this.props.navigation.navigate('WalletTransferSelection')
            } style={[{ width:240, height: 44, borderRadius: 4 }, searching ? {backgroundColor: '#a5a5a5'} : {backgroundColor: '#4cb1f7'}]}>
              {
                searching ?
                  <Text style={{ fontSize: TextFont.TextSize(20), color: 'white' }}>
                    <FormattedMessage id={'searching'}/>
                  </Text> :
                  <Text style={{ fontSize: TextFont.TextSize(20), color: 'white' }}>
                    <FormattedMessage id={'next'}/>
                  </Text>
              }
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
              <Button key={ index }activeOpacity={1} onPress={ () => {
                this.setState({
                  selectIndex: index
                })
                this.props.onPress(index, item)
              }} style={{ height: 40, justifyContent: 'center' }}>
                <Text style={ selectIndex == index ? { fontSize: TextFont.TextSize(14), color: '#FFB639' } : { fontSize: TextFont.TextSize(14), color: '#a5a5a5', opacity: 0.7 } }>
                  <FormattedMessage id={item} />
                </Text>
              </Button>
            )
          })
        }
      </View>
    )
  }
}
