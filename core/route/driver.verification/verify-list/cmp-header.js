// Boilerplate
import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { AppProvider } from '../../../providers';

// Component Wrapper
const HeadSection = ({
  placeHolder = 'Search',
  value = null
}) => {
  // Default Component Styles
  const styles = StyleSheet.create({
    headCont: {
      width: '100%',
      padding: 20,
      borderBottomWidth: 1,
      borderColor: 'rgba(0, 0, 0, 0.35)'
    },
    searchInput: {
      width: '100%',
      textAlign: 'left',
      fontSize: 30,
      fontWeight: '800',
      color: 'rgba(0, 0, 0, 0.95)',
    }
  });

  // Props Assign
  const {
    headCont,
    searchInput
  } = styles;

  // Component Structure
  return (
    <View style={headCont}>
      <TextInput style={searchInput} value={value} placeholder={placeHolder} underlineColorAndroid="transparent"/>
    </View>
  );
};

// Export Component
export default HeadSection;
