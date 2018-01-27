// Boilerplate
import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableNativeFeedback, Image } from 'react-native';
import { AppProvider } from '../../providers';

// Construct Component
const CmpSearch = ({
  clickFrom = null,
  clickTo = null,
  pickUp = 'Pick Up Location',
  destination = 'Destination',
}) => {
  // Default Component Styles
  const styles = StyleSheet.create({
    contStyle: {
      width: '100%',
      backgroundColor: 'white',
      borderRadius: 5,
      padding: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      shadowOffset: { width: 10, height: 10 },
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      elevation: 10
    },
    iconStyle: {
      height: 60,
      width: 50,
      resizeMode: 'contain'
    },
    inputCont: {
      width: '100%',
      padding: 10,
      borderColor: 'rgba(0, 0, 0, 0.2)'
    },
    inputStyle: {
      width: '100%',
      fontSize: 18,
      padding: 0,
      fontWeight: '500',
      color: 'rgba(0, 0, 0, 0.75)',
    }
  });

    // Props Assign
  const {
    contStyle, iconStyle, inputCont, inputStyle
  } = styles;

    // Component Structure
  return (
    <View style={contStyle}>
      <Image style={iconStyle} source={AppProvider.resources.image.fromTo_icon}/>
      <View style={{ flex: 1 }}>
        <TouchableNativeFeedback onPress={clickFrom}>
          <View style={[inputCont, { borderBottomWidth: 1 }]}>
            <Text style={inputStyle}>{pickUp}</Text>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback onPress={clickTo}>
          <View style={inputCont}>
            <Text style={inputStyle}>{destination}</Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    </View>
  );
};

// Export Component
export default CmpSearch;
