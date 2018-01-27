// Boilerplate
import React from 'react';
import { StyleSheet, View, TouchableNativeFeedback, Text } from 'react-native';

import { AppProvider } from '../../../providers';
import { IQRAvatar } from '../../../components';

// Component Wrapper
const ListItem = ({
  onPress,
  img,
  label,
  caption
}) => {
  // Default Component Styles
  const styles = StyleSheet.create({
    dcCol: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      borderBottomWidth: 1,
      padding: 20,
      borderColor: 'rgba(0, 0, 0, 0.1)'
    },
    fLabel: {
      width: '100%',
      textAlign: 'left',
      fontSize: 18,
      fontWeight: '400',
      color: 'rgba(0, 0, 0, 0.65)'
    },
    fCaption: {
      fontSize: 14,
      fontWeight: '400',
      color: 'rgba(0, 0, 0, 0.45)',
      width: '100%',
      textAlign: 'left'
    }
  });

  // Props Assign
  const {
    dcCol,
    fLabel,
    fCaption
  } = styles;

  // Component Structure
  return (
    <TouchableNativeFeedback onPress={onPress}>
      <View style={dcCol}>
        <IQRAvatar
          style={{
            contStyle: {
              width: 60,
              height: 60,
              marginRight: 10
            }
          }}
          img={img}
        />
        <View style={{ flex: 1 }}>
          <Text style={fLabel}>{label}</Text>
          <Text style={fCaption}>{caption}</Text>
        </View>
      </View>
    </TouchableNativeFeedback>
  );
};

// Export Component
export default ListItem;
