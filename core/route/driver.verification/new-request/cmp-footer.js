// Boilerplate
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppProvider } from '../../../providers';
import { IQRBtn } from '../../../components';

// Component Wrapper
const FooterSection = ({
  closeBtn,
  moreBtn
}) => {
  // Default Component Styles
  const styles = StyleSheet.create({
    actionCont: {
      width: '100%',
      padding: 20,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    }
  });

  // Props Assign
  const {
    actionCont
  } = styles;

  // Component Structure
  return (
    <View style={actionCont}>
      <IQRBtn
        style={{
          contStyle: {
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            flex: 1
          }
        }}
        onPress={closeBtn}
        label="Close"
      />
      <IQRBtn
        style={{
          contStyle: {
            backgroundColor: AppProvider.configs.ui.main,
            flex: 1
          }
        }}
        onPress={moreBtn}
        label="View More"
      />
    </View>
  );
};

// Export Component
export default FooterSection;
