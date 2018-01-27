import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Text,
  Image,
  View,
  LayoutAnimation,
  UIManager,
  TouchableNativeFeedback,
  ScrollView,
} from 'react-native';

import _BaseView from '../_base';
import { AppProvider } from '../../providers';
import { AppUserEntity } from '../../entities';
import { IQRView, IQRFormList } from '../../components';
import CmpSearch from './cmp-search';
import CmpOption from './cmp-option';
import CarTypeCard from './cmp-carType';
import DriverBtn from './cmp-driverBtn';

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true)

class HomeView extends _BaseView {
  constructor(props) {
    super(props);

    // init state
    this.state = {
      ...this.state,
      paymentMethod: 'CASH',
      timeMethod: 'NOW',
      currentStage: 'init'
    };

    // init view
    this.setHeaderTitle('Home');
  }

  /*****
   react-native events
   *****/
  render() {
    const { currentStage, timeMethod, paymentMethod } = this.state;
    const {
      bodyCont,
      footerCont,
      footerText,
      priceCont,
      priceText
    } = this.styles;

    this.updateRootViewProps();

    return (
      <IQRView {...this.rootViewProps}>
        <Image
          source={AppProvider.resources.image.test_bg}
          style={{ flex: 1, width: '100%', zIndex: -1 }}
        >
          <ScrollView contentContainerStyle={{ padding: 10, minHeight: '100%' }}>
            <View style={bodyCont}>
              <View style={{ width: '100%' }}>
                <CmpSearch
                  clickFrom={() => this.locationModal()}
                  clickTo={() => this.changeStage('carSelection')}
                />
                {currentStage === 'carSelection' && (
                  <CmpOption
                    timeMethod={timeMethod}
                    paymentMethod={paymentMethod}
                    pressTime={() => this.timeDialog()}
                    pressPayment={() => this.paymentDialog()}
                  />
                )}
              </View>
              {currentStage === 'carSelection' && (
                <View style={{ width: '100%' }}>
                  <CarTypeCard/>
                  <DriverBtn
                    moreCircleFunc={() => this.goToView('CircleListing')}
                  />
                  <TouchableNativeFeedback onPress={() => this.navPage('BookingDetail')}>
                    <View style={footerCont}>
                      <Text style={footerText}>BOOK DACSEE</Text>
                      <View style={priceCont}>
                        <Text style={priceText}>RM 50.00</Text>
                      </View>
                    </View>
                  </TouchableNativeFeedback>
                </View>
              )}
            </View>
          </ScrollView>
        </Image>
      </IQRView>
    );
  }

  /*****
   Custom Style
   *****/
  styles = {
    bodyCont: {
      width: '100%',
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBottom: 60,
    },
    footerCont: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: 45,
      borderRadius: 5,
      backgroundColor: AppProvider.configs.ui.main,
      marginTop: 5,
      shadowOffset: { width: 10, height: 10 },
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      elevation: 10
    },
    footerText: {
      color: 'rgba(0, 0, 0, 0.75)',
      fontSize: 16,
      fontWeight: '600',
    },
    priceCont: {
      padding: 5,
      paddingLeft: 10,
      paddingRight: 10,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      marginLeft: 10,
      borderRadius: 50,
    },
    priceText: {
      fontSize: 16,
      fontWeight: '600',
      color: 'white'
    }
  };

  /*****
   custom event handlers
   *****/
  locationModal() {
    this.showModal('LocationModal');
  }

  changeStage(stage) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    this.updateState('currentStage', stage);
  }

  navPage(view) {
    this.goToView(view);
  }

  onPaymentSelect = (value) => {
    this.hideDialog();
    this.setState({ paymentMethod: value });
  };


  paymentDialog() {
    this.showDialog('SelectDialog', {
      options: [
        { label: 'Cash', value: 'CASH' },
        { label: 'DACSEE Token', value: 'DACSEE' },
      ],
      onSelect: this.onPaymentSelect,
      disableSearch: true,
    });
  }

  onTimeSelect = (value) => {
    this.hideDialog();
    this.setState({ timeMethod: value });
  };

  timeDialog() {
    this.showDialog('SelectDialog', {
      options: [
        { label: 'NOW', value: 'NOW' },
        { label: 'ADVANCE BOOKING', value: 'ADV' },
      ],
      disableSearch: true,
      onSelect: this.onTimeSelect
    });
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeView);
