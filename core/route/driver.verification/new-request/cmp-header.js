// Boilerplate
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

// Component Wrapper
const HeadSection = ({
  label = 'New Request',
  caption = 'You have receive a request to verify a driver'
}) => {
  // Default Component Styles
  const styles = StyleSheet.create({
    headCont: {
      width: '100%',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      padding: 20,
      borderBottomWidth: 1,
      borderColor: 'rgba(0, 0, 0, 0.5)'
    },
    headTitle: {
      width: '100%',
      fontSize: 24,
      textAlign: 'left',
      fontWeight: '600',
      color: 'rgba(0, 0, 0, 0.75)',
    },
    headCaption: {
      width: '100%',
      textAlign: 'left',
      fontSize: 16,
      fontWeight: '400',
      color: 'rgba(0, 0, 0, 0.4)'
    },
  });

  // Props Assign
  const {
    headCont,
    headTitle,
    headCaption,
  } = styles;

  // Component Structure
  return (
    <View style={headCont}>
      <Text style={headTitle}>{label}</Text>
      <Text style={headCaption}>{caption}</Text>
    </View>
  );
};

// Export Component
export default HeadSection;
