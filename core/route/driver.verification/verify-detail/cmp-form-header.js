// Boilerplate
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { IQRCirBtn } from '../../../components';
import { AppProvider } from '../../../providers';

// Component Wrapper
const HeadSection = ({
  step,
  label
}) => {
  // Default Component Styles
  const styles = StyleSheet.create({
    contStyle: {
      width: '100%',
      padding: 10,
      marginBottom: 30
    },
    fCaption: {
      width: '100%',
      textAlign: 'left',
      fontSize: 14,
      fontWeight: '400',
      color: 'rgba(0, 0, 0, 0.5)'
    },
    fTitle: {
      width: '100%',
      textAlign: 'left',
      fontSize: 30,
      fontWeight: '800',
      color: 'rgba(0, 0, 0, 0.95)'
    }
  });

  // Props Assign
  const {
    contStyle,
    fCaption,
    fTitle
  } = styles;

  // Component Structure
  return (
    <View style={contStyle}>
      <Text style={fCaption}>{step}</Text>
      <Text style={fTitle}>{label}</Text>
    </View>
  );
};

// Export Component
export default HeadSection;
