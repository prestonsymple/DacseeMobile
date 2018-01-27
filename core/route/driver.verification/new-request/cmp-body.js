// Boilerplate
import React from 'react';
import { StyleSheet, View, Text, Image, TouchableNativeFeedback } from 'react-native';
import { IQRAvatar } from '../../../components';
import { AppProvider } from '../../../providers';

// Component Wrapper
const BodySection = ({
  name,
  img
}) => {
  // Default Component Styles
  const styles = StyleSheet.create({
    bodyCont: {
      width: '100%',
      padding: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start'
    },
    fTitle: {
      width: '100%',
      textAlign: 'left',
      fontSize: 18,
      fontWeight: '400',
      color: 'rgba(0, 0, 0, 0.65)'
    }
  });

  // Props Assign
  const {
    bodyCont,
    fTitle
  } = styles;

  // Component Structure
  return (
    <View style={bodyCont}>
      <IQRAvatar
        img={img}
      />
      <View style={{ flex: 1, marginLeft: 15 }}>
        <Text style={fTitle}>{name}</Text>
      </View>
    </View>
  );
};

// Export Component
export default BodySection;
