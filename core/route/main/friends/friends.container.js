/**
 * Created by Rabbit on 2018/4/11.
 */

import React, {Component, PureComponent} from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  InteractionManager, ScrollView, TextInput, TouchableOpacity, DeviceEventEmitter
} from 'react-native'
import { Define, Screen, System, Icons } from '../../../utils'
import { connect } from 'react-redux'

const { width, height } = Screen.window


// import NavigatorBarSwitcher from '../components/navigator.bar.switcher'
import NavigatorBarSwitcher from '../components/navigator.switcher'
import {FormattedMessage} from 'react-intl'
import FriendsGroupList from './friends.group.list'
import FriendsCircleComponent from './friends.circle'


export default connect(state => ({
  account: state.account,
  booking: state.booking,
  ...state.circle,
  i18n: state.intl.messages || {}
}))(class friends extends Component{

  static navigationOptions = ({ navigation }) => {
    const reducer = global.store.getState()
    return {
      drawerLockMode: 'locked-closed',
      headerRight: (
        <TouchableOpacity
          activeOpacity={0.7}
          style={{ top: -0.5, width: 54, paddingRight: 20, justifyContent: 'center', alignItems: 'flex-end' }}
          onPress={() => DeviceEventEmitter.emit('NAVIGATION.EVENT.ON.PRESS.ADD.FREIENDS')}
        >
          {Icons.Generator.Material('add', 28, 'white', { style: { left: 8 } })}
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: '#1AB2FD',
        shadowColor: 'transparent',
        shadowOpacity: 0,
        borderBottomWidth: 0,
        borderBottomColor: 'transparent',
        elevation: 0,
      },
      title: reducer.intl.messages.mycircle,
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      switcherStatus: 0
    }
  }

  async componentDidMount() {
    const {i18n} = this.props
    const {mycircle} = i18n
    const {setParams} = this.props.navigation
    setParams({mycircle})
    await InteractionManager.runAfterInteractions()
    // this.subscription = DeviceEventEmitter.addListener('NAVIGATION.EVENT.ON.PRESS.ADD.FREIENDS', () => this.props.navigation.navigate('FriendsCircleAdd',{i18n}))
    this.subscription = DeviceEventEmitter.addListener('NAVIGATION.EVENT.ON.PRESS.ADD.FREIENDS', () => this.props.navigation.navigate('FriendsGroupAdd',{i18n}))
  }

  componentWillUnmount() {
    this.subscription && this.subscription.remove()
  }


  onSwitch = (index) => {
    this.setState({switcherStatus:index})
  }

  render() {
    const titles = ['friends','group']
    return (
      <View style={styles.container}>
        <NavigatorBarSwitcher titles={titles} index={this.state.switcherStatus} onPress={this.onSwitch}/>
        <FriendsContainerSwitcher switcherStatus={this.state.switcherStatus} onScroll={this.onSwitch}/>
      </View>
    )
  }
})

const FriendsContainerSwitcher = connect(state => ({ core_mode: state.application.core_mode }))(class FriendsContainerSwitcher extends Component {
  async componentDidMount() {

    await InteractionManager.runAfterInteractions()
    const { switcherStatus } = this.props

    this.scrollView.scrollTo({ x: switcherStatus === 0 ? 0 : width, animated: false })

    // 修复Android初始化加载延迟问题, Tab页切换不对
    if (System.Platform.Android) {
      await new Promise((resolve) => setTimeout(() => resolve(), 200))
      this.scrollView.scrollTo({ x: switcherStatus === 0 ? 0 : width, animated: false })
    }
  }

  componentWillReceiveProps(props) {
    if (props.switcherStatus !== this.props.switcherStatus) {
      this.scrollView.scrollTo({ x: props.switcherStatus === 0 ? 0 : width, animated: false })
    }
  }

  onScroll = (e) => {

    if (e.nativeEvent.contentOffset.x !== 0 && e.nativeEvent.contentOffset.x > 0 && e.nativeEvent.contentOffset.x > width/2 - 50){
      this.props.onScroll(1)
    }else{
      this.props.onScroll(0)
    }
  }

  render() {
    const VIEW_SETTER = {
      scrollEnabled: true,
      horizontal: true,
      pagingEnabled:true,
      showsHorizontalScrollIndicator: false,
      ref: (e) => this.scrollView = e
    }
    return (
      <ScrollView {...VIEW_SETTER} onScroll={this.onScroll} scrollEventThrottle={0}>
        <FriendsCircleComponent />
        <FriendsGroupList />
      </ScrollView>
    )
  }
})


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
