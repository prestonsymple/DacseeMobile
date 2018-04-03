import React, { Component, PureComponent } from 'react'
import {
  Text, View, Animated, StyleSheet, StatusBar, Image, TouchableOpacity,
  DeviceEventEmitter, TextInput, Easing, ListView, ScrollView, RefreshControl, Switch
} from 'react-native'
import { FormattedMessage } from 'react-intl'
import InteractionManager from 'InteractionManager'
import { NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'
import moment from 'moment'
import { Screen, Icons, Redux, Define, System, Session,TextFont } from '../../utils'
import Resources from '../../resources'
import { application, booking } from '../../redux/actions'

const { height, width } = Screen.window
const dataContrast = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

export default connect(state => ({
  i18n: state.intl.message || {}
}))(class DownLineTotalScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      drawerLockMode: 'locked-closed',
      title: 'DOWNLINE LISTING',
      headerStyle: {
        backgroundColor: '#1AB2FD',
        shadowColor: 'transparent',
        shadowOpacity: 0,
        borderBottomWidth: 0,
        borderBottomColor: 'transparent',
        elevation: 0,
      }
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      data: {}
    }
  }

  async componentWillMount() {
    this._fetchData()
  }

  async _fetchData(index = 0) {
    this.setState({
      loading: true
    })
    try {
      //获取列表
      const data = await Session.User.Get('v1/downline/level/0')
      this.setState({
        loading: false,
        data:data
      })
    } catch (e) {
      this.props.dispatch(application.showMessage('无法连接到服务器'))
      this.setState({
        loading: false
      })
    }
  }
  goDownLineList(lve) {
    this.props.dispatch(NavigationActions.navigate({
      routeName: 'DownLineList',
      params: { level: lve }
    }))
  }
  render() {
    const { i18n } = this.props
    const { data } = this.state
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={{ backgroundColor: '#1AB2FD', paddingLeft: 20 }}>
          <Text style={{ fontSize: TextFont.TextSize(15), color: '#fff', marginBottom: 10 }}>
            <FormattedMessage id={'total_downline'}/>
          </Text>
          <Text style={{ fontSize: TextFont.TextSize(25), fontWeight: 'bold', color: '#fff', marginBottom: 10 }}>{data.total}</Text>
        </View>
        <ScrollView refreshControl={
          <RefreshControl
            refreshing={this.state.loading}
            onRefresh={this._fetchData.bind(this)}
            title={'下拉进行刷新'}
            colors={['#ffffff']}
            progressBackgroundColor={'#1c99fb'}
          />
        }>
          <View style={{ paddingLeft: 20 }}>
            <DownLineCell goDownLineList={(lve) => this.goDownLineList(lve)} cellname='1' value={data.level1} />
            <DownLineCell goDownLineList={(lve) => this.goDownLineList(lve)} cellname='2' value={data.level2} />
            <DownLineCell goDownLineList={(lve) => this.goDownLineList(lve)} cellname='3' value={data.level3} />
          </View>
        </ScrollView>
      </View>
    )
  }
})

class DownLineCell extends PureComponent {
  render() {
    const { cellname, value } = this.props
    return (
      <TouchableOpacity onPress={() => this.props.goDownLineList(cellname)} style={{ paddingTop: 20 }}>        
        <FormattedMessage id={'level'}>
          {
            msg => (
              <Text style={{ fontSize: TextFont.TextSize(13), fontWeight: 'bold', color: '#404040', paddingBottom: 5 }}>
                {msg+' ' + cellname}</Text>
            )
          }
        </FormattedMessage>    
        <Text style={{ fontSize: TextFont.TextSize(13), fontWeight: 'bold', color: '#ccc', paddingBottom: 5 }}>
          <FormattedMessage id={'total_downline'}/>
        </Text>
        <Text style={{ fontSize: TextFont.TextSize(25), fontWeight: '300', color: '#404040', paddingBottom: 5 }}>{value?value:0}</Text>
      </TouchableOpacity>
    )
  }
}
