// Boilerplate
import React from 'react';
import { StyleSheet, View, Picker, Text } from 'react-native';
import { AppProvider } from '../../../providers';

import { IQRInputWithLabel, IQRTextarea } from '../../../components';
import UploadField from '../common/cmp-upload-file';

// Component Wrapper
const FormSection = ({
  forms = [],
}) => {
  // Default Component Styles
  const styles = StyleSheet.create({
    contStyle: {
      width: '100%',
      padding: 10,
      paddingBottom: 60
    }
  });

  // Props Assign
  const {
    contStyle,
  } = styles;

  // Component Structure
  return (
    <View style={contStyle}>
      {forms.map(f => (
        <View key={f.label}>
          {f.type === 'upload' && (
            <UploadField label={f.label} caption={f.caption} status={f.status} extraBtnLabel={f.extraBtnLabel}/>
          )}
        </View>
      ))}
    </View>
  );
};

// Export Component
export default FormSection;
