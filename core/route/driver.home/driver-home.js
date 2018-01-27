import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Dimensions, Image, ScrollView, View } from 'react-native';

import _BaseView from '../_base';
import { AppProvider } from '../../providers';
import { AppUserEntity } from '../../entities';
import { IQRView } from '../../components';
import DriverSection from './cmp-section';
import DriverPerform from './cmp-driver-performance';
import DriverWallet from './cmp-driver-wallet';
import DriverComm from './cmp-driver-commission';

const { height, width } = Dimensions.get('window');

class DriverHomeView extends _BaseView {
  constructor(props) {
    super(props);

    // init state
    this.state = {
      ...this.state,
    };

    // init view
    this.setHeaderTitle('DACSEE');
  }

  /*****
   react-native events
   *****/
  render() {
    const {
      testBg,
      mainCont,
      dcCard
    } = this.styles;

    this.updateRootViewProps({ bgColor: 'transparent' });


    return (
      <Image source={AppProvider.resources.image.test_driver_bg} style={testBg}>
        <IQRView {...this.rootViewProps}>
          <ScrollView contentContainerStyle={mainCont}>
            <View style={dcCard}>
              <DriverSection label="My Performance">
                <DriverPerform cancelPts="4.6" ratingPts="4.9" acceptPts="5"/>
              </DriverSection>
              <DriverSection label="My Wallet Balance">
                <DriverWallet currency="MYR" value="300.15"/>
              </DriverSection>
              <DriverSection label="My Driver Floating Commission" onPress>
                <DriverComm
                  value="300.50"
                  currency="token"
                  totalDone="9"
                  total="20"
                  label="trip"
                  timeLeft="3 days"
                />
              </DriverSection>
            </View>
          </ScrollView>
        </IQRView>
      </Image>
    );
  }

  /*****
   Custom Style
   *****/
  styles = {
    mainCont: {
      paddingTop: ((height / 100) * 40) - 20,
      paddingLeft: 10,
      paddingRight: 10,
    },
    testBg: {
      width,
      height,
      resizeMode: 'cover'
    },
    dcCard: {
      width: '100%',
      minHeight: (height / 100) * 60,
      backgroundColor: 'white',
      borderTopLeftRadius: 5,
      borderTopRightRadius: 5,
      paddingBottom: 60,
      shadowOffset: { width: 10, height: 10 },
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      elevation: 10
    }
  };

  /*****
   custom event handlers
   *****/

  startBooking = () => {
    this.goToView('BookingDetail');
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

export default connect(mapStateToProps, mapDispatchToProps)(DriverHomeView);
