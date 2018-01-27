import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Text, Image, View, TouchableNativeFeedback, ScrollView, UIManager, LayoutAnimation } from 'react-native';

import _BaseView from '../../_base';
import { AppProvider } from '../../../providers';
import { AppUserEntity } from '../../../entities';
import { IQRView, IQRFooter, IQRCirBtn, IQRadBtn, IQRBtn, IQRInputWithLabel, IQRSelectWithLabel } from '../../../components';
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
        label: 'Abdo',
        caption: 'Full Name (As per IC)',
        type: 'upload',
        status: 'completed',
      },
      {
        label: '1234567890',
        caption: 'IC Number',
        type: 'upload',
        status: 'completed',
      },
      {
        label: 'abdo@emailc.com',
        caption: 'Email',
        type: 'upload',
        status: 'question',
      },
      {
        label: '01 Jan 1993',
        caption: 'Email',
        type: 'upload',
        status: 'question',
      },
      {
        label: '012 345 6789',
        caption: 'Mobile Number',
        type: 'upload',
        status: 'question',
      },
      {
        label: 'Class D',
        caption: 'Class of Driving License',
        type: 'upload',
        status: 'question',
      },
      {
        label: '09 Nov 2018',
        caption: 'Driving License Expiry Date',
        type: 'upload',
        status: 'question',
      },
      {
        label: 'Self Driver',
        caption: 'Driving Experience',
        type: 'upload',
        status: 'question',
      },
    ];
    this.vehicleInfo = [
      {
        label: 'Honda',
        caption: 'Vehicle Manufacture',
        type: 'upload',
        status: 'question'
      },
      {
        label: 'Civic',
        caption: 'Vehicle Model',
        type: 'upload',
        status: 'question'
      },
      {
        label: 'White',
        caption: 'Vehicle Color',
        type: 'upload',
        status: 'question'
      },
      {
        label: 'VU 1234',
        caption: 'Vehicle Plate Number',
        type: 'upload',
        status: 'question'
      },
      {
        label: '2018',
        caption: 'Year of Manufacture',
        type: 'upload',
        status: 'question',
      },
      {
        label: 'Third Party',
        caption: 'Insurance Policy Type',
        type: 'upload',
        status: 'question',
      },
      {
        label: 'AIA',
        caption: 'Name of Insurance Company Provider',
        type: 'upload',
        status: 'question'
      },
      {
        label: 'A0100289',
        caption: 'Insurance Policy Number',
        type: 'upload',
        status: 'question'
      },
      {
        label: '09 Nov 2019',
        caption: 'Insurance Expiry Date',
        type: 'upload',
        status: 'question'
      },
      {
        label: 'Authorization Letter',
        caption: 'Check the validity of the authorization Letter.',
        type: 'upload',
        status: 'question',
      },
    ];
    this.emerInfo = [
      {
        label: 'Abdo Mom',
        caption: 'Emergency Contact Name',
        type: 'upload',
        status: 'question'
      },
      {
        label: '012 345 6789',
        caption: 'Emergency Contact Number',
        type: 'upload',
        status: 'question',
      },
      {
        label: 'Mother',
        caption: 'Relationship',
        type: 'upload',
        status: 'question',
      }
    ];
    this.upDoc = [
      {
        label: 'Driver Profile',
        caption: 'Please verify the driver profile picture',
        type: 'upload',
        status: 'question',
        extraBtnLabel: 'VIEW DOCUMENT'
      },
      {
        label: 'Insurance Cover Note',
        caption: 'Verify the insurance',
        type: 'upload',
        status: 'question',
        extraBtnLabel: 'VIEW DOCUMENT'
      },
      {
        label: 'Driving License',
        caption: 'Verify the Driving Insurance',
        type: 'upload',
        status: 'question',
        extraBtnLabel: 'VIEW DOCUMENT',
      },
      {
        label: 'Medical Check Up Form',
        caption: 'Verify the Medical Check Up Form',
        type: 'upload',
        extraBtnLabel: 'VIEW DOCUMENT',
        status: 'question'
      },
      {
        label: 'Public Service Vehicle License (PSV)',
        caption: 'Verify the public service vehicle license (PSV)',
        extraBtnLabel: 'VIEW DOCUMENT',
        type: 'upload',
        status: 'question'
      }
    ];
    this.questionForm = [
      {
        label: 'NO',
        caption: 'Has your driving license ever been suspended',
        type: 'upload',
        status: 'question'
      },
      {
        label: 'NO',
        caption: 'Do you have any traffic penalties or offence within the past 5 years',
        type: 'upload',
        status: 'question'
      },
      {
        label: 'NO',
        caption: 'Have you ever been convicted in a court of law',
        type: 'upload',
        status: 'question',
      },
      {
        label: 'NO',
        caption: 'Are you waiting for any kind of court proceedings against you',
        type: 'upload',
        status: 'question',
      },
      {
        label: 'NO',
        caption: 'Do you have any medical condition which may render you unfit to drive safely',
        type: 'upload',
        status: 'question',
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
            {currentStage === 'question' && (
              <View>
                <IQRBtn
                  style={{
                    contStyle: {
                      backgroundColor: AppProvider.configs.ui.acceptColor,
                      height: 60,
                    }
                  }}
                  label="Verified & Accepted as a New Driver"
                  onPress={() => this.changeStage()}
                />
                <IQRBtn
                  style={{
                    contStyle: {
                      backgroundColor: AppProvider.configs.ui.rejectColor,
                      height: 60,
                    }
                  }}
                  label="Not Accepted"
                  onPress={() => this.changeStage()}
                />
              </View>
            )}
          </View>
        </ScrollView>
        {currentStage !== 'question' && (
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
