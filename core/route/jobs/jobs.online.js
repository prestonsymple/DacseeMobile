import React, { PureComponent } from 'react'
import {
  Text, View, Image, TouchableOpacity, ListView, ScrollView, RefreshControl, Switch
} from 'react-native'
import InteractionManager from 'InteractionManager'
import { NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'

import moment from 'moment'

import { Screen, Icons, Session, TextFont } from '../../utils'
import Resources from '../../resources'
import { application, driver } from '../../redux/actions'
import { FormattedMessage } from 'react-intl'
import OnlineListItem from './components/online.listItem'
const { height, width } = Screen.window

const dataContrast = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })


export default connect(state => ({
  ...state.driver,
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
  }

  async componentDidMount() {
    await InteractionManager.runAfterInteractions()
  }

  componentWillReceiveProps(props) {
    // UPDATE WORKING JOBS LIST
    if (props.working && this.props.jobs !== props.jobs) {
      this.setState({ jobs: dataContrast.cloneWithRows(props.jobs) })
    }
  }
  sliderChange(status) {
    if(status===-1){
      console.log('reject')
    }else{
      console.log('accept')
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
            <FormattedMessage id={'online'} />
          </Text>
          <Switch  value={working} onValueChange={(working) => this.props.dispatch(driver.driverSetValue({ working }))} />
        </View>
        {
          working && (jobs.rowIdentities[0].length === 0 ?

            <View style={{ justifyContent: 'center', alignItems: 'center',flex:1 }}>
              <Image source={Resources.image.joblist_empty}  />
              <Text style={{ color: '#999', fontSize: TextFont.TextSize(18), fontWeight: '600', textAlign: 'center', marginTop: 20 }}>
                {'已上线，等待订单中'}
              </Text>
            </View>
            :
            <View style={{ flex: 1 }}>
              <View style={{ backgroundColor: '#fff', height: 48, justifyContent: 'center', width: width, marginVertical: 10 }}>
                <Text style={{ color: '#404040', fontSize: TextFont.TextSize(18), marginLeft: 20 }}>
                  {'等待接受'}
                </Text>
              </View>
              <ListView
                dataSource={jobs}
                enableEmptySections={true}
                renderRow={(row) => (
                  <TouchableOpacity activeOpacity={.7} onPress={this.goJobsListDetail.bind(this,row)}>
                    <OnlineListItem itemData={row}  sliderChange={(status)=>this.sliderChange(status)}/>
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

