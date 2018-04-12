/**
 * Created by Rabbit on 2018/4/11.
 */

import React, {Component, PureComponent} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  InteractionManager, ScrollView, TextInput, TouchableOpacity, DeviceEventEmitter
} from 'react-native';
import { Define, Screen, System, Icons } from "../../../utils"
import { connect } from "react-redux"

const { width, height } = Screen.window


// import NavigatorBarSwitcher from '../components/navigator.bar.switcher'
import NavigatorBarSwitcher from '../components/navigator.switcher'
import {FormattedMessage} from "react-intl"

import FriendsCircleComponent from './friends.circle';
import {application} from "../../../redux/actions";


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

  async componentDidMount() {
    const {i18n} = this.props
    const {mycircle} = i18n
    const {setParams} = this.props.navigation
    setParams({mycircle})
    await InteractionManager.runAfterInteractions()
    this.subscription = DeviceEventEmitter.addListener('NAVIGATION.EVENT.ON.PRESS.ADD.FREIENDS', () => this.props.navigation.navigate('FriendsCircleAdd',{i18n}))
  }

  componentWillUnmount() {
    DeviceEventEmitter.emit('FRIENDS.SWITCHER.EMITTER', 1)
    this.subscription && this.subscription.remove()
  }


  render() {
    return (
      <View style={styles.container}>
        <HeaderSearchBar />
      </View>
    );
  }
})

class HeaderSearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      switcherStatus: 0
    };
  }
  render() {
    const titles = ['friends','group'];
    return (
      <View style={{ flex:1 }}>
        <View style={{height:112, backgroundColor: '#1ab2fd'}}>
          <NavigatorBarSwitcher titles={titles} index={0} onPress={(index)=>{this.setState({switcherStatus:index})}}/>
          <View style={{ marginHorizontal: 10, width: width - 20, paddingHorizontal: 18, marginTop:10, backgroundColor: '#1697d7', borderRadius: 21, alignItems: 'center' }}>
            <FormattedMessage id={'search_name_phone_email'}>
              {
                msg => (
                  <TextInput {...Define.TextInputArgs} placeholderTextColor={'#FFFFFF66'} placeholder={msg} style={
                    Platform.select({
                      android: { height: 42, width: width - 56 },
                      ios: { height: 42, width: width - 56 }
                    })} />
                )
              }
            </FormattedMessage>
          </View>
        </View>
        <FriendsContainerSwitcher switcherStatus={this.state.switcherStatus}/>
      </View>
    )
  }
}


const FriendsContainerSwitcher = connect(state => ({ core_mode: state.application.core_mode }))(class FriendsContainerSwitcher extends PureComponent {
  async componentDidMount() {

    await InteractionManager.runAfterInteractions()
    const { switcherStatus } = this.props;

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

    console.log(e.nativeEvent.contentOffset.x);

    if (e.nativeEvent.contentOffset.x !== 0 && e.nativeEvent.contentOffset.x > 0 && e.nativeEvent.contentOffset.x > width/2 - 50){
      DeviceEventEmitter.emit('FRIENDS.SWITCHER.EMITTER', 1)
    }else{
      DeviceEventEmitter.emit('FRIENDS.SWITCHER.EMITTER', 0)
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
        <FriendsCircleComponent/>
        <View style={{height, width, alignItems: 'center', justifyContent:'center', backgroundColor:'orange'}}>
          <Text>1231323</Text>
        </View>
      </ScrollView>
    )
  }
})


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});