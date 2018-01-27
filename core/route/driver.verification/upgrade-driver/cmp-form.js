// Boilerplate
import React from 'react';
import { StyleSheet, View, Picker, Text } from 'react-native';
import { AppProvider } from '../../../providers';

import { IQRInputWithLabel, IQRTextarea } from '../../../components';
import UploadField from '../common/cmp-upload-file';

// Component Wrapper
const FormSection = ({
  forms = []
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
            <UploadField label={f.label} caption={f.caption} status={f.status}/>
          )}
          {f.type === 'input' && (
            <IQRInputWithLabel
              style={{
                inputStyle: {
                  marginBottom: 10
                }
              }}
              label={f.label}
              keyboardType={f.keyboardType}
            />
          )}
          {f.type === 'textarea' && (
            <IQRTextarea
              style={{
                inputStyle: {
                  marginBottom: 10
                }
              }}
              label={f.label}
            />
          )}
          {f.type === 'select' && (
            <View>
              <View>
                <Text style={{
                  fontSize: 15,
                  fontWeight: '500',
                  color: 'rgba(0, 0, 0, 0.6)',
                  marginBottom: 5
                }}
                >{f.label}
                </Text>
              </View>
              <Picker style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)', marginBottom: 10 }}>
                {f.options.map(o => (
                  <Picker.Item label={o.value} value={o.value} key={o.value}/>
                ))}
              </Picker>
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

// Export Component
export default FormSection;
