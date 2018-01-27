import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View, Dimensions, TouchableNativeFeedback, Image, Text, UIManager, LayoutAnimation, StyleSheet } from 'react-native';

import _BaseView from '../_base';
import { AppProvider } from '../../providers';
import { AppUserEntity } from '../../entities';
import { IQRInputWithLabel, IQRCirBtn } from '../../components';

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true)

const { width } = Dimensions.get('window');

const DCList = ({ label, value }) => {
  /*****
    Custom Style
    *****/
  const styles = StyleSheet.create({
    dcCol: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBottom: 10,
      paddingTop: 10,
      borderColor: 'rgba(0, 0, 0 ,0.1)',
      borderBottomWidth: 1
    },
    fLabel: {
      fontSize: 16,
      fontWeight: '400',
      color: 'rgba(0, 0, 0, 0.45)',
      width: '40%',
      textAlign: 'left'
    },
    fTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: 'rgba(0, 0, 0, 0.75)',
      width: '60%',
      textAlign: 'right'
    }
  });

  const {
    dcCol,
    fLabel,
    fTitle
  } = styles;

  return (
    <View style={dcCol}>
      <Text style={fLabel}>{label}</Text>
      <Text style={fTitle}>{value}</Text>
    </View>
  );
};

class NewBookingDialog extends _BaseView {
  constructor(props) {
    super(props);

    // init state
    this.state = {
      ...this.state,
    };

    // init view
    this.showHeader(false);
  }

  /*****
   react-native events
   *****/

  render() {
    this.updateRootViewProps();

    const {
      dialogView,
      backDrop,
      bodyCont,
      fTitle,
      dcCol,
      fPrice,
      actionCont,
      dcBtn,
      fButton
    } = this.styles;

    const { onClose } = this.props;
    return (
      <View style={backDrop}>
        <View style={dialogView}>
          <View style={bodyCont}>
            <View style={dcCol}>
              <Text style={fTitle}>New Booking</Text>
              <Text style={fPrice}>RM180.00</Text>
            </View>
            <View>
              <DCList label="Pick Up Point" value="KLIA, Sepang"/>
              <DCList label="Destination" value="Sunway Pyramid, Petaling Jaya"/>
              <DCList label="Date & Time" value="28 Jul 2017, 8:30PM"/>
            </View>
          </View>
          <View style={actionCont}>
            <TouchableNativeFeedback onPress={() => onClose(false)}>
              <View style={[dcBtn, { backgroundColor: 'rgba(0, 0, 0, 0.1)', width: '35%' }]}>
                <Text style={fButton}>REJECT</Text>
              </View>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback onPress={() => onClose(true)}>
              <View style={dcBtn}>
                <Text style={fButton}>ACCEPT</Text>
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>
      </View>
    );
  }

  /*****
   Custom Style
   *****/
  styles = StyleSheet.create({
    backDrop: {
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      padding: (width / 100) * 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    dialogView: {
      maxHeight: '100%',
      width: '100%',
      backgroundColor: 'white',
      borderRadius: 3,
      shadowOffset: { width: 10, height: 10 },
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      elevation: 10,
      position: 'relative',
    },
    bodyCont: {
      width: '100%',
      padding: 30
    },
    dcCol: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginBottom: 35
    },
    fTitle: {
      width: '40%',
      textAlign: 'left',
      fontSize: 20,
      fontWeight: '500',
      color: 'rgba(0, 0, 0, 0.75)',
    },
    fPrice: {
      width: '60%',
      textAlign: 'right',
      fontSize: 30,
      fontWeight: '600',
      color: AppProvider.configs.ui.main,
    },
    actionCont: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    dcBtn: {
      width: '65%',
      minHeight: 55,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: AppProvider.configs.ui.acceptColor
    },
    fButton: {
      fontSize: 18,
      fontWeight: '600',
      color: 'rgba(0, 0, 0, 0.75)'
    }
  });

  /*****
   custom event handlers
   *****/
  navPage = () => {
    this.goToView('DriverBooking');
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


export default connect(mapStateToProps, mapDispatchToProps)(NewBookingDialog);
