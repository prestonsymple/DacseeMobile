import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Text, Image, View } from 'react-native';

import _BaseView from '../_base';
import { AppProvider } from '../../providers';
import { AppUserEntity } from '../../entities';
import { IQRView, IQRCirBtn } from '../../components';

class TmpHomeView extends _BaseView {
  constructor(props) {
    super(props);

    // init state
    this.state = {
      ...this.state,
    };

    // init view
    this.setHeaderTitle('Home');
  }

  /*****
   react-native events
   *****/
  render() {
    const {
      bodyCont,
      dcLogo,
      dcDisplay,
      dcTitle,
      dcCaption,
      dcBody,
      dcDeco,
      dcRow,
      inviteCont,
    } = this.styles;

    this.updateRootViewProps();


    return (
      <IQRView {...this.rootViewProps}>
        <View style={bodyCont}>
          <Image
            source={AppProvider.resources.image.logo}
            style={dcLogo}
          />
          <Text style={dcDisplay}>Congratulation!</Text>
          <View style={dcDeco}/>
          <Text style={dcBody}>Now you are a part of DACSEE communities.</Text>
        </View>
        <View style={{
          ...dcRow,
          marginTop: 80
        }}
        >
          <View style={inviteCont}>
            <View style={{ flex: 1, paddingRight: 20 }}>
              <Text style={dcTitle}>Refer a friend</Text>
              <Text style={dcCaption}>Refer a friends to join DACSEE now to get rewards and more!</Text>
            </View>
            <IQRCirBtn
              icon={AppProvider.resources.image.share_icon}
              onPress={this.shareDialog}
              style={{
                contStyle: {
                  backgroundColor: AppProvider.configs.ui.main,
                  width: 60,
                  height: 60
                },
                iconStyle: {
                  width: 30,
                  height: 30
                }
              }}
            />
          </View>
        </View>
      </IQRView>
    );
  }

  /*****
   Custom Style
   *****/
  styles = {
    bodyCont: {
      padding: 20,
      width: '100%'
    },
    dcLogo: {
      width: 100,
      height: 100,
      resizeMode: 'contain',
      marginBottom: 40
    },
    dcDisplay: {
      fontSize: 16,
      fontWeight: '500',
      color: AppProvider.configs.ui.main,
      marginBottom: 15
    },
    dcDeco: {
      borderBottomWidth: 2,
      borderColor: AppProvider.configs.ui.main,
      width: 80,
      marginBottom: 20
    },
    dcBody: {
      fontSize: 26,
      fontWeight: '400',
      color: 'rgba(0, 0, 0, 0.75)'
    },
    dcRow: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end'
    },
    inviteCont: {
      width: '80%',
      backgroundColor: 'rgba(0, 0, 0, 0.07)',
      padding: 20,
      flexDirection: 'row',
      alignItems: 'center'
    },
    dcCaption: {
      fontSize: 14,
      fontWeight: '400',
      color: 'rgba(0, 0, 0, 0.5)'
    },
    dcTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: 'rgba(0, 0, 0, 0.75)'
    }
  };

  /*****
   custom event handlers
   *****/
  shareDialog = () => {
    this.showModal('TmpShare');
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

export default connect(mapStateToProps, mapDispatchToProps)(TmpHomeView);
