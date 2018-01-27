// Boilerplate
import React from 'react';
import { StyleSheet, View, Text, Image, TouchableNativeFeedback } from 'react-native';
import { AppProvider } from '../../../providers';

// Component Wrapper
const CmpHeader = ({
  label = 'Upgrade Driver',
  backBtn
}) => {
  // Default Component Styles
  const styles = StyleSheet.create({
    contStyle: {
      width: '100%',
      height: 50,
      backgroundColor: 'white',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      shadowOffset: { width: 10, height: 10 },
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      elevation: 10,
    },
    iconCont: {
      width: '15%',
      height: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    iconStyle: {
      width: 20,
      height: 20,
      resizeMode: 'contain'
    },
    fTitle: {
      flex: 1,
      fontSize: 18,
      fontWeight: '500',
      color: 'rgba(0, 0, 0, 0.85)'
    },
  });

  // Props Assign
  const {
    contStyle,
    iconCont,
    iconStyle,
    fTitle
  } = styles;

  // Component Structure
  return (
    <View style={contStyle}>
      <View style={iconCont}>
        <TouchableNativeFeedback
          background={TouchableNativeFeedback.Ripple('rgba(0, 0, 0, 0.2)', true)}
          onPress={backBtn}
        >
          <View stlye={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          >
            <Image style={iconStyle} source={AppProvider.resources.image.back_icon_2}/>
          </View>
        </TouchableNativeFeedback>
      </View>
      <Text style={fTitle}>{label}</Text>
      <View style={iconCont}/>
    </View>
  );
};

// Export Component
export default CmpHeader;
