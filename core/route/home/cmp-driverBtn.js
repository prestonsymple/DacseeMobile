import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableNativeFeedback,
  LayoutAnimation,
  UIManager,
  ScrollView,
  Dimensions
} from 'react-native';

import _BaseView from '../_base';
import { AppProvider } from '../../providers';
import { AppUserEntity } from '../../entities';
import { IQRAvatar, IQRCirBtn } from '../../components';

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true)

const { width } = Dimensions.get('window');

class DriverBtn extends _BaseView {
  constructor(props) {
    super(props);

    // init state
    this.state = {
      ...this.state,
      isOpen: false,
      selectedDriver: 'nearby'
    };
  }

  /*****
   Custom Style
   *****/
  styles = StyleSheet.create({
    indiNext: {
      width: 15,
      height: 15,
      resizeMode: 'contain',
      opacity: 0.4
    },
    driverCol: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingLeft: 15,
      paddingRight: 15,
      minHeight: 60,
    },
    driverCard: {
      borderRadius: 5,
      shadowOffset: { width: 10, height: 10 },
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      elevation: 10,
      backgroundColor: 'white',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 5
    },
    driverIcon: {
      width: 40,
      height: 40,
      resizeMode: 'contain',
      marginRight: 15,
    },
    driverTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: 'rgba(0, 0, 0, 0.75)',
      flex: 1
    },
    driverCaption: {
      fontSize: 12,
      fontWeight: '400',
      color: 'rgba(0, 0, 0, 0.45)',
      paddingLeft: 15
    },
    driverBox: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      position: 'relative'
    }
  });

  /*****
   custom event handlers
   *****/
  selectTab(selectedDriver) {
    this.setState({ selectedDriver });
  }

  toggleOpen(tab = null, status = this.state.isOpen) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    this.setState({ isOpen: !status });
    if (tab) {
      this.selectTab(tab);
    }
  }

  /*****
   react-native events
   *****/
  render() {
    const { isOpen, selectedDriver } = this.state;
    const { moreCircleFunc } = this.props;
    const avatarSize = width / 6.5;
    const {
      indiNext,
      driverCard,
      driverCol,
      driverIcon,
      driverTitle,
      driverCaption,
      driverBox
    } = this.styles;

    this.updateRootViewProps();

    return (
      <TouchableNativeFeedback onPress={() => this.toggleOpen()} disabled={isOpen}>
        <View style={[driverCard, isOpen && { position: 'absolute', bottom: 60, zIndex: 20 }]}>
          {!isOpen && (
            <View style={driverCol}>
              <Image style={driverIcon} source={AppProvider.resources.image.logo}/>
              <Text style={driverTitle}>NEARBY DRIVER</Text>
              <Image source={AppProvider.resources.image.right_icon} style={indiNext}/>
            </View>
          )}
          {isOpen && (
            <View style={{ width: '100%' }}>
              <TouchableNativeFeedback onPress={() => this.toggleOpen('nearby')}>
                <View style={selectedDriver === 'nearby' ? [driverCol, {
                  backgroundColor: AppProvider.configs.ui.sec,
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                }] : [driverCol, { borderTopLeftRadius: 5, borderTopRightRadius: 5 }]}
                >
                  <Image style={driverIcon} source={AppProvider.resources.image.logo}/>
                  <Text style={driverTitle}>NEARBY DRIVER</Text>
                  <Text style={driverCaption}>5 mins</Text>
                </View>
              </TouchableNativeFeedback>
              <View style={selectedDriver === 'circle' ? [driverCol, {
                flexDirection: 'column',
                backgroundColor: AppProvider.configs.ui.sec,
                paddingTop: 10,
                paddingBottom: 10,
              }] : [driverCol, {
                flexDirection: 'column',
                paddingBottom: 10,
                paddingTop: 10,
                borderBottomWidth: 1,
                borderColor: 'rgba(0, 0, 0, 0.2)'
              }]}
              >
                <View style={[driverBox, { marginBottom: 15 }]}>
                  <Image
                    style={[driverIcon, selectedDriver === 'circle' && { opacity: 0.4 }]}
                    source={AppProvider.resources.image.share_black_icon}
                  />
                  <Text style={driverTitle}>MY CIRCLE</Text>
                  <Text style={driverCaption}>5 mins</Text>
                </View>
                <View style={{ width: '100%', position: 'relative', paddingRight: 40 }}>
                  <ScrollView horizontal contentContainerStyle={{ paddingRight: 40 }}>
                    <View style={driverBox}>
                      <IQRCirBtn
                        style={{
                          contStyle: {
                            backgroundColor: AppProvider.configs.ui.main,
                            width: avatarSize,
                            height: avatarSize,
                            marginRight: 10
                          }
                        }}
                        onPress={() => this.toggleOpen('circle')}
                        label="ANY"
                      />
                      <IQRAvatar
                        onPress={() => this.toggleOpen('circle')}
                        style={{
                          contStyle: {
                            marginRight: 10,
                            width: avatarSize,
                            height: avatarSize,
                          }
                        }}
                        img={AppProvider.resources.image.test_profile}
                      />
                      <IQRAvatar
                        onPress={() => this.toggleOpen('circle')}
                        style={{
                          contStyle: {
                            marginRight: 10,
                            width: avatarSize,
                            height: avatarSize,
                          }
                        }}
                        img={AppProvider.resources.image.test_profile}
                      />
                      <IQRAvatar
                        onPress={() => this.toggleOpen('circle')}
                        style={{
                          contStyle: {
                            marginRight: 10,
                            width: avatarSize,
                            height: avatarSize,
                          }
                        }}
                        img={AppProvider.resources.image.test_profile}
                      />
                      <IQRAvatar
                        onPress={() => this.toggleOpen('circle')}
                        style={{
                          contStyle: {
                            marginRight: 10,
                            width: avatarSize,
                            height: avatarSize,
                          }
                        }}
                        img={AppProvider.resources.image.test_profile}
                      />
                      <IQRAvatar
                        onPress={() => this.toggleOpen('circle')}
                        style={{
                          contStyle: {
                            marginRight: 10,
                            width: avatarSize,
                            height: avatarSize,
                          }
                        }}
                        img={AppProvider.resources.image.test_profile}
                      />
                      <IQRAvatar
                        onPress={() => this.toggleOpen('circle')}
                        style={{
                          contStyle: {
                            marginRight: 10,
                            width: avatarSize,
                            height: avatarSize,
                          }
                        }}
                        img={AppProvider.resources.image.test_profile}
                      />
                      <IQRAvatar
                        onPress={() => this.toggleOpen('circle')}
                        style={{
                          contStyle: {
                            marginRight: 10,
                            width: avatarSize,
                            height: avatarSize,
                          }
                        }}
                        img={AppProvider.resources.image.test_profile}
                      />
                    </View>
                  </ScrollView>
                  <IQRCirBtn
                    onPress={moreCircleFunc}
                    style={{
                      contStyle: {
                        backgroundColor: AppProvider.configs.ui.main,
                        height: avatarSize,
                        width: avatarSize,
                        position: 'absolute',
                        right: 0
                      }
                    }}
                    label="MORE"
                  />
                </View>
              </View>
              <View style={selectedDriver === 'preDriver' ? [driverCol, {
                flexDirection: 'column',
                backgroundColor: AppProvider.configs.ui.sec,
                paddingTop: 10,
                paddingBottom: 10
              }] : [driverCol, { flexDirection: 'column', paddingBottom: 10, paddingTop: 10 }]}
              >
                <View style={[driverBox, { marginBottom: 15 }]}>
                  <Image
                    style={[driverIcon, selectedDriver === 'preDriver' && { opacity: 0.4 }]}
                    source={AppProvider.resources.image.star_0_icon}
                  />
                  <Text style={driverTitle}>MY PREFERRED DRIVER</Text>
                  <Text style={driverCaption}>5 mins</Text>
                </View>
                <View style={{ width: '100%', position: 'relative', paddingRight: 40 }}>
                  <ScrollView horizontal contentContainerStyle={{ paddingRight: 40 }}>
                    <View style={driverBox}>
                      <IQRCirBtn
                        style={{
                          contStyle: {
                            backgroundColor: AppProvider.configs.ui.acceptColor,
                            height: avatarSize,
                            width: avatarSize,
                            marginRight: 10
                          }
                        }}
                        onPress={() => this.toggleOpen('preDriver')}
                        icon={AppProvider.resources.image.add_icon}
                      />
                    </View>
                  </ScrollView>
                </View>
              </View>
            </View>
          )}
        </View>
      </TouchableNativeFeedback>
    );
  }
}

/*****
 store bindings
 *****/
const mapStateToProps = state => ({
  appUser: state.appUser
});

const mapDispatchToProps = dispatch => ({
  entities: {
    appUser: bindActionCreators(AppUserEntity.actions, dispatch)
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(DriverBtn);
