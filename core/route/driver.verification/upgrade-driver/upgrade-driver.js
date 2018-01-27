import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Text, Image, View, TouchableNativeFeedback, ScrollView, UIManager, LayoutAnimation } from 'react-native';

import _BaseView from '../../_base';
import { AppProvider } from '../../../providers';
import { AppUserEntity } from '../../../entities';
import { IQRView, IQRFooter, IQRCirBtn, IQRadBtn, IQRInputWithLabel, IQRSelectWithLabel } from '../../../components';
import CmpHeader from './cmp-header';
import HeadSection from './cmp-form-header';
import FormSection from './cmp-form';

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

class UpgradeDriverView extends _BaseView {
  constructor(props) {
    super(props);

    // init forms
    this.showHeader(false);
    this.personalInfo = [
      {
        label: 'Full Name (As per IC)',
        type: 'input',
        value: ''
      },
      {
        label: 'IC Number',
        type: 'input',
        value: ''
      },
      {
        label: 'Email',
        type: 'input',
        value: '',
        keyboardType: 'email-address'
      },
      {
        label: 'Date of Birth',
        type: 'input',
        value: '',
      },
      {
        label: 'Address',
        type: 'textarea',
        value: '',
      },
      {
        label: 'Mobile Number',
        type: 'input',
        value: '',
        keyboardType: 'phone-pad'
      },
      {
        label: 'Class of Driving License',
        type: 'input',
        value: '',
      },
      {
        label: 'Driving License Expiry Date',
        type: 'input',
        value: '',
      },
      {
        label: 'Driving Experience',
        type: 'select',
        value: '',
        options: [
          {
            value: 'Only drive for myself'
          },
          {
            value: 'Taxi'
          },
          {
            value: 'Limousine/Chauffeur'
          },
          {
            value: 'Other car hailing company'
          }
        ]
      },
    ];
    this.vehicleInfo = [
      {
        label: 'Vehicle Manufacture',
        type: 'select',
        options: [
          {
            value: 'Honda'
          },
          {
            value: 'Porsche'
          },
          {
            value: 'Toyota'
          }
        ]
      },
      {
        label: 'Vehicle Model',
        type: 'input',
        value: ''
      },
      {
        label: 'Vehicle Color',
        type: 'input',
        value: ''
      },
      {
        label: 'Vehicle Plate Number',
        type: 'input',
        value: ''
      },
      {
        label: 'Year of Manufacture',
        type: 'input',
        value: ''
      },
      {
        label: 'Insurance Policy Type',
        type: 'select',
        options: [
          {
            value: 'Comprehensive'
          },
          {
            value: 'Third Party'
          }
        ]
      },
      {
        label: 'Name of Insurance Company Provider',
        type: 'input',
        value: ''
      },
      {
        label: 'Insurance Policy Number',
        type: 'input',
        value: ''
      },
      {
        label: 'Insurance Expiry Date',
        type: 'input',
        value: ''
      },
      {
        label: 'Authorization Letter',
        caption: 'If vehicle not under your personal name, please upload the Authorization letter.',
        type: 'upload',
        status: 'upload',
        value: ''
      },
    ];
    this.emerInfo = [
      {
        label: 'Emergency Contact Name',
        type: 'input',
        value: ''
      },
      {
        label: 'Emergency Contact Number',
        type: 'input',
        value: '',
        keyboardType: 'phone-pad'
      },
      {
        label: 'Relationship',
        type: 'select',
        options: [
          {
            value: 'Spouse'
          },
          {
            value: 'Parents'
          },
          {
            value: 'Sibling'
          },
          {
            value: 'Others'
          }
        ]
      }
    ];
    this.upDoc = [
      {
        label: 'Driver Profile',
        caption: 'Upload one of your recently photo as your profile photo',
        type: 'upload',
        status: 'completed'
      },
      {
        label: 'Insurance Cover Note',
        caption: 'upload a photo of your car insurance photo',
        type: 'upload',
        status: 'upload'
      },
      {
        label: 'Driving License',
        caption: 'upload a photo of your driving license',
        type: 'upload',
        status: 'upload'
      },
      {
        label: 'Medical Check Up Form',
        caption: 'If you are age 55 and above please upload a medical check up form',
        type: 'upload',
        status: 'upload'
      },
      {
        label: 'Public Service Vehicle License (PSV)',
        caption: 'Upload a photo of your public service vehicle license (PSV) (OPTIONAL)',
        type: 'upload',
        status: 'upload'
      }
    ];
    this.questionForm = [
      {
        label: 'Has your driving license ever been suspended',
        type: 'select',
        options: [
          {
            value: 'No'
          },
          {
            value: 'Yes'
          }
        ]
      },
      {
        label: 'Do you have any traffic penalties or offence within the past 5 years',
        type: 'select',
        options: [
          {
            value: 'No'
          },
          {
            value: 'Yes'
          }
        ]
      },
      {
        label: 'Have you ever been convicted in a court of law',
        type: 'select',
        options: [
          {
            value: 'No'
          },
          {
            value: 'Yes'
          }
        ]
      },
      {
        label: 'Are you waiting for any kind of court proceedings against you',
        type: 'select',
        options: [
          {
            value: 'No'
          },
          {
            value: 'Yes'
          }
        ]
      },
      {
        label: 'Do you have any medical condition which may render you unfit to drive safely',
        type: 'select',
        options: [
          {
            value: 'No'
          },
          {
            value: 'Yes'
          }
        ]
      }
    ];
    this.driverVer = [
      {
        label: 'Verifier 1',
        caption: 'Pending',
        type: 'upload',
        status: 'pending'
      },
      {
        label: 'Verifier 2',
        caption: 'Pending',
        type: 'upload',
        status: 'pending'
      },
      {
        label: 'Verifier 3',
        caption: 'Success',
        type: 'upload',
        status: 'completed'
      },
      {
        label: 'Verifier 4',
        caption: 'Rejected',
        type: 'upload',
        status: 'reject'
      }
    ];

    // init state
    this.state = {
      ...this.state,
      uploaded: false,
      currentStage: 'personal',
      forms: this.personalInfo,
      step: 'Step 1',
      label: 'Personal Information'
    };
  }

  /*****
   react-native events
   *****/
  render() {
    const {
      currentStage,
      step,
      label,
      forms
    } = this.state;

    this.updateRootViewProps();

    return (
      <IQRView {...this.rootViewProps}>
        <CmpHeader backBtn={() => this.backModal()}/>
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <View>
            <HeadSection step={step} label={label}/>
            <FormSection forms={forms}/>
          </View>
        </ScrollView>
        {currentStage !== 'pending' && (
          <IQRFooter
            style={{
              contStyle: {
                backgroundColor: 'white',
                height: 80
              }
            }}
          >
            <IQRCirBtn
              style={{
                contStyle: {
                  backgroundColor: AppProvider.configs.ui.main,
                  height: 60,
                  width: 60,
                },
                iconStyle: {
                  height: 30,
                  width: 30,
                }
              }}
              icon={AppProvider.resources.image.next_icon}
              onPress={() => this.changeStage()}
            />
          </IQRFooter>
        )}
        {currentStage === 'pending' && (
          <IQRFooter
            style={{
              contStyle: {
                backgroundColor: 'white',
                height: 80
              }
            }}
          >
            <IQRadBtn
              style={{
                contStyle: {
                  backgroundColor: AppProvider.configs.ui.main,
                  height: 60,
                }
              }}
              label="Get Verification"
              onPress={() => this.changeStage()}
            />
          </IQRFooter>
        )}
      </IQRView>
    );
  }

  /*****
   custom event handlers
   *****/
  changeStage() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
    if (this.state.currentStage === 'personal') {
      return this.setState({
        currentStage: 'vehicle',
        step: 'Step 2',
        label: 'Vehicle Information',
        forms: this.vehicleInfo
      });
    }
    if (this.state.currentStage === 'vehicle') {
      return this.setState({
        currentStage: 'emergency',
        step: 'Step 3',
        label: 'Emergency Contact',
        forms: this.emerInfo
      });
    }
    if (this.state.currentStage === 'emergency') {
      return this.setState({
        currentStage: 'uploadDoc',
        step: 'Step 4',
        label: 'Upload Documents',
        forms: this.upDoc
      });
    }
    if (this.state.currentStage === 'uploadDoc') {
      return this.setState({
        currentStage: 'question',
        step: 'Step 5',
        label: 'Questionnaire',
        forms: this.questionForm
      });
    }
    if (this.state.currentStage === 'question') {
      return this.setState({
        currentStage: 'pending',
        step: 'Step 6',
        label: 'Driver Verification',
        forms: this.driverVer
      });
    }
  }

  backModal() {
    if (this.state.currentStage === 'vehicle') {
      return this.setState({
        currentStage: 'personal',
        step: 'Step 1',
        label: 'Personal Information',
        forms: this.personalInfo
      });
    }
    if (this.state.currentStage === 'emergency') {
      return this.setState({
        currentStage: 'vehicle',
        step: 'Step 2',
        label: 'Vehicle Information',
        forms: this.vehicleInfo
      });
    }
    if (this.state.currentStage === 'uploadDoc') {
      return this.setState({
        currentStage: 'emergency',
        step: 'Step 3',
        label: 'Emergency Contact',
        forms: this.emerInfo
      });
    }
    if (this.state.currentStage === 'question') {
      return this.setState({
        currentStage: 'uploadDoc',
        step: 'Step 4',
        label: 'Upload Documents',
        forms: this.upDoc
      });
    }
    if (this.state.currentStage === 'pending') {
      return this.setState({
        currentStage: 'question',
        step: 'Step 5',
        label: 'Questionnaire',
        forms: this.questionForm
      });
    }
    return this.hideModal();
  }
}

/*****
 store bindings
 *****/
const mapStateToProps = state => ({
  appUser: state.appUser
});
const mapDispatchToProps = dispatch => ({
  entities: {
    appUser: bindActionCreators(AppUserEntity.actions, dispatch)
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(UpgradeDriverView);
