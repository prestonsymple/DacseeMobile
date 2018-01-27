import React from 'react';
import { StyleSheet, Text, Image, View, TouchableNativeFeedback, TextInput, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import _BaseView from '../_base';
import { AppProvider } from '../../providers';
import { AppUserEntity } from '../../entities';
import { IQRView } from '../../components';


class LocationModalView extends _BaseView {
  constructor(props) {
    super(props);

    // init state
    this.state = {
      ...this.state,
      searchValue: '',
    };

    // init view
    this.showHeader(false);
  }

  /*****
   react-native events
   *****/
  listRender({ label, icon }) {
    const {
      listCol,
      listIcon,
      listTitle
    } = this.styles;

    return (
      <View style={listCol}>
        <Image style={listIcon} source={icon}/>
        <Text style={listTitle}>{label}</Text>
      </View>
    );
  }

  render() {
    const { searchValue } = this.state;
    const {
      headCont,
      iconStyle,
      searchInput,
      sectionCont,
      listTitle
    } = this.styles;

    this.updateRootViewProps();

    return (
      <IQRView {...this.rootViewProps}>
        <ScrollView>
          <View style={headCont}>
            <TouchableNativeFeedback
              background={TouchableNativeFeedback.Ripple('rgba(0, 0, 0, 1)', true)}
              onPress={() => this.closeModal('LocationModal')}
            >
              <Image style={iconStyle} source={AppProvider.resources.image.back_icon}/>
            </TouchableNativeFeedback>
            <TextInput
              onChangeText={(text) => {
                this.setState({ searchValue: text });
              }}
              value={searchValue}
              style={searchInput}
              placeholder="Where to?"
              underlineColorAndroid="transparent"
              autoCorrect={false}
            />
          </View>
          {!searchValue.length && (
            <View style={{ width: '100%' }}>
              <TouchableNativeFeedback onPress={() => this.closeModal('LocationModal')}>
                { this.listRender({ label: 'KLCC', icon: AppProvider.resources.image.recent_icon }) }
              </TouchableNativeFeedback>
              <TouchableNativeFeedback onPress={() => this.closeModal('LocationModal')}>
                { this.listRender({ label: 'Setiawalk, Puchong', icon: AppProvider.resources.image.recent_icon }) }
              </TouchableNativeFeedback>
              <TouchableNativeFeedback onPress={() => this.closeModal('LocationModal')}>
                { this.listRender({ label: 'Sunway Pyramid', icon: AppProvider.resources.image.recent_icon }) }
              </TouchableNativeFeedback>
              <View style={sectionCont}>
                <Text style={listTitle}>Favourite Location</Text>
              </View>
              <TouchableNativeFeedback onPress={() => this.closeModal('LocationModal')}>
                { this.listRender({ label: 'PFCC', icon: AppProvider.resources.image.location_icon }) }
              </TouchableNativeFeedback>
              <TouchableNativeFeedback onPress={() => this.closeModal('LocationModal')}>
                { this.listRender({ label: 'Limrrkokwing, Cyberjaya', icon: AppProvider.resources.image.location_icon }) }
              </TouchableNativeFeedback>
              <TouchableNativeFeedback onPress={() => this.closeModal('LocationModal')}>
                { this.listRender({ label: 'Raub, Pahang', icon: AppProvider.resources.image.location_icon }) }
              </TouchableNativeFeedback>
            </View>
          )}
          {searchValue.length !== 0 && (
            <View style={{ width: '100%' }}>
              <TouchableNativeFeedback onPress={() => this.closeModal('LocationModal')}>
                { this.listRender({ label: 'Johor Bharu, Johor', icon: AppProvider.resources.image.location_icon }) }
              </TouchableNativeFeedback>
            </View>
          )}
        </ScrollView>
      </IQRView>
    );
  }

  /*****
   Custom Style
   *****/
  styles = StyleSheet.create({
    headCont: {
      width: '100%',
      padding: 15,
      paddingTop: 45,
      borderBottomWidth: 1,
      borderColor: 'rgba(0, 0, 0, 0.5)',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    iconStyle: {
      width: 20,
      height: 20,
      resizeMode: 'contain',
      marginRight: 10
    },
    searchInput: {
      flex: 1,
      height: 45,
      fontSize: 35,
      fontWeight: '600',
      padding: 0,
      color: 'rgba(0, 0, 0, 0.75)',
      backgroundColor: 'transparent',
    },
    listCol: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      minHeight: 55,
      paddingLeft: 35,
      paddingRight: 35,
      borderBottomWidth: 1,
      borderColor: 'rgba(0, 0, 0, 0.1)'
    },
    listIcon: {
      width: 20,
      height: 20,
      resizeMode: 'contain',
      marginRight: 15,
      opacity: 0.75
    },
    listTitle: {
      flex: 1,
      fontSize: 18,
      fontWeight: '400',
      color: 'rgba(0, 0, 0, 0.65)'
    },
    sectionCont: {
      width: '100%',
      minHeight: 45,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingLeft: 35,
      paddingRight: 35,
    }
  });

  /*****
   custom event handlers
   *****/
  closeModal(view) {
    this.hideModal(view);
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

export default connect(mapStateToProps, mapDispatchToProps)(LocationModalView);
