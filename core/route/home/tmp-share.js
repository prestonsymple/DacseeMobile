import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View, Text, ScrollView, Image } from 'react-native';

import _BaseView from '../_base';
import { AppProvider } from '../../providers';
import { AppUserEntity } from '../../entities';
import { IQRView, IQRBtn, IQRFooter } from '../../components';

class TmpShareView extends _BaseView {
  constructor(props) {
    super(props);

    // init state
    this.state = {
      ...this.state,
    };

    // init view
    this.setHeaderTitle('Refer Friends');
  }

  /*****
   react-native events
   *****/
  render() {
    this.updateRootViewProps();

    const {
      imgCont,
      dcQR,
      bodyCont,
      dcDisplay,
      dcDeco,
      dcBody
    } = this.styles;
    return (
      <IQRView {...this.rootViewProps}>
        <ScrollView>
          <View style={imgCont}>
            <Image
              source={AppProvider.resources.image.test_qr}
              style={dcQR}
            />
            <View style={bodyCont}>
              <Text style={dcDisplay}>Refer a friend</Text>
              <View style={dcDeco}/>
              <Text style={dcBody}>Share this QR code to your friends to refer them as your downline.</Text>
            </View>
          </View>
        </ScrollView>
        <IQRFooter
          style={{
            contStyle: {
              borderTopWidth: 1,
              backgroundColor: 'white',
              borderColor: 'rgba(0, 0, 0, 0.2)',
              paddingLeft: 30,
              paddingRight: 30,
              paddingTop: 5,
              paddingBottom: 5,
              bottom: 60
            }
          }}
        >
          <IQRBtn
            label="SHARE"
            style={{
              contStyle: {
                flex: 1,
                width: '100%',
                backgroundColor: AppProvider.configs.ui.acceptColor
              }
            }}
          />
        </IQRFooter>
      </IQRView>
    );
  }

  /*****
   Custom Style
   *****/
  styles = {
    imgCont: {
      width: '100%',
      padding: 10,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    },
    dcQR: {
      width: 250,
      height: 250,
      resizeMode: 'contain'
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
    bodyCont: {
      width: '100%',
      padding: 20,
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
const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  entities: {
    appUser: bindActionCreators(AppUserEntity.actions, dispatch)
  }
});


export default connect(mapStateToProps, mapDispatchToProps)(TmpShareView);
