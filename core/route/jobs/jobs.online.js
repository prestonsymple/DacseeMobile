import React, { PureComponent } from 'react'
import {
  Text, View, Image, TouchableOpacity, ListView, ScrollView, RefreshControl, Switch
} from 'react-native'
import InteractionManager from 'InteractionManager'
import { NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'

import moment from 'moment'

import { Screen, System, Session, TextFont } from '../../utils'
import Resources from '../../resources'
import { application, driver } from '../../redux/actions'
import { FormattedMessage } from 'react-intl'
import OnlineListItem from './components/online.listItem'
const { height, width } = Screen.window
import { JobsAddScreen } from './index'


const dataContrast = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })


export default connect(state => ({
  ...state.driver,
  vehicles: state.account.user.vehicles,
  i18n: state.intl.messages || {}
}))(class JobsOnlineScreen extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      drawerLockMode: 'locked-closed',
      title: '订单列表'
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      jobs: dataContrast.cloneWithRows([])
    }
    this.sound = null
  }

  async componentDidMount() {
    await InteractionManager.runAfterInteractions()
    try {
      this.sound = await System.LoadSound('dacsee.mp3')
    } catch (e) {
      console.log('[音频文件]', '[载入失败]')
    }
  }

  componentWillReceiveProps(props) {
    if (props.working && this.props.jobs !== props.jobs) {
      this.setState({ jobs: dataContrast.cloneWithRows(props.jobs) })
    }
   
    if (
      props.working && this.props.jobs !== props.jobs && 
      props.jobs.length > this.props.jobs.length
    ) {
      if (this.sound) {
        this.sound.play()
      }
    }
  }
  async sliderChange(status, _id) {
    if (status !== 0) {
      try {
        await Session.Booking.Put(`v1/${_id}`, { action: status === -1 ? 'reject' : 'accept' })
        if (status !== -1) {
          this.props.dispatch(NavigationActions.navigate({ routeName: 'JobsListDetail', params: { jobDetail: this.props.jobs.find(pipe => pipe._id === _id) } }))
        }
      } catch (e) {
        this.props.dispatch(application.showMessage('无法连接到服务器，请稍后再试'))
      }
    }
  }
  goJobsListDetail(row) {
    this.props.dispatch(NavigationActions.navigate({ routeName: 'JobsListDetail', params: { jobDetail: row } }))
  }
  render() {
    const { working } = this.props
    const { loading, jobs } = this.state
    return (
      <View style={{ flex: 1, backgroundColor: '#f8f8f8', }}>
        <View style={{ paddingHorizontal: 20, paddingTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: width }}>
          <Text style={{ fontSize: TextFont.TextSize(25), fontWeight: 'bold', color: '#333' }}>
            {this.props.i18n.online}
          </Text>
          <Switch value={working} onValueChange={(working) => {

            if (this.props.vehicles.length === 0) {
              this.props.dispatch(NavigationActions.navigate({ routeName: 'JobsAdd'}))
            } else {
              this.props.dispatch(driver.driverSetValue({working}))
            }
          }
          } />
        </View>
        {
          working && (jobs.rowIdentities[0].length === 0 ?
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
              <Image source={Resources.image.joblist_empty} />
              <Text style={{ color: '#999', fontSize: TextFont.TextSize(18), fontWeight: '600', textAlign: 'center', marginTop: 20 }}>
                {this.props.i18n.wait_for_order}
              </Text>
            </View>
            :
            <View style={{ flex: 1 }}>
              <View style={{ backgroundColor: '#fff', height: 48, justifyContent: 'center', width: width, marginTop: 10 }}>
                <Text style={{ color: '#404040', fontSize: TextFont.TextSize(18), marginLeft: 20 }}>
                  {this.props.i18n.ongoing}
                </Text>
              </View>
              <ListView
                dataSource={jobs}
                enableEmptySections={true}
                renderRow={(row, rowid, keyid) => (
                  <TouchableOpacity activeOpacity={.7} onPress={() => this.goJobsListDetail(row)} style={{ marginTop: keyid == 0 ? 10 : 0 }}>
                    <OnlineListItem itemData={row} sliderChange={(status) => this.sliderChange(status, row._id)} i18n={this.props.i18n} />
                  </TouchableOpacity>
                )}
                style={{ marginBottom: 15 }}
              />
            </View>
          )
        }
      </View>
    )
  }
})

