import React, { Component } from 'react';
import { StyleSheet, Text, Image, View, TouchableNativeFeedback } from 'react-native';

import { AppProvider } from '../../providers';

const CmpOption = ({
  timeMethod,
  paymentMethod,
  pressTime = null,
  pressPayment = null
}) => {
  /*****
   Custom Style
   *****/
  const styles = StyleSheet.create({
    bodyCard: {
      width: '100%',
      borderRadius: 5,
      paddingTop: 10,
      backgroundColor: AppProvider.configs.ui.main,
      shadowOffset: { width: 10, height: 10 },
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      elevation: 9,
      marginTop: -10,
    },
    dcCol: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: '100%'
    },
    itemCont: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      padding: 10,
      borderColor: 'rgba(0, 0, 0, 0.2)'
    },
    dcIcon: {
      width: 18,
      height: 18,
      resizeMode: 'contain',
      marginRight: 10,
      opacity: 0.4
    },
    dcText: {
      fontSize: 15,
      fontWeight: '500',
      color: 'rgba(0, 0, 0, 0.75)'
    }
  });

  /*****
   custom event handlers
   *****/

  /*****
   react-native events
   *****/

  const {
    bodyCard,
    dcCol,
    itemCont,
    dcIcon,
    dcText
  } = styles;

  return (
    <View style={bodyCard}>
      <View style={dcCol}>
        <TouchableNativeFeedback onPress={pressTime}>
          <View style={[itemCont, { borderRightWidth: 1 }]}>
            <Image style={dcIcon} source={AppProvider.resources.image.time_icon}/>
            <Text style={dcText}>{timeMethod}</Text>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback onPress={pressPayment}>
          <View style={itemCont}>
            <Image style={dcIcon} source={AppProvider.resources.image.payment_icon}/>
            <Text style={dcText}>{paymentMethod}</Text>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback>
          <View style={[itemCont, { borderLeftWidth: 1, flex: 2 }]}>
            <Image style={dcIcon} source={AppProvider.resources.image.payment_icon}/>
            <Text style={dcText}>Remarks</Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    </View>
  );
};

export default CmpOption;
