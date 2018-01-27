import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Text,
  View,
  TouchableNativeFeedback,
  ScrollView,
  UIManager,
  LayoutAnimation,
} from 'react-native';

import _BaseView from '../../_base';
import { AppProvider } from '../../../providers';
import { AppUserEntity } from '../../../entities';
import { IQRView, IQRFooter, IQRAvatar } from '../../../components';
import HeadSection from './cmp-header';
import ListItem from './cmp-list';

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

class VerifyListView extends _BaseView {
  constructor(props) {
    super(props);

    // init state
    this.state = {
      ...this.state,
    };

    // init view
    this.setHeaderTitle('Verification List');
  }

  /*****
   react-native events
   *****/
  renderPassenger({ label, caption }, img, onPress) {
    const {
      upCol,
      upLabel,
      upCaption
    } = this.styles;

    return (
      <TouchableNativeFeedback onPress={onPress}>
        <View style={upCol}>
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
            <Text style={upLabel}>{label}</Text>
            <Text style={upCaption}>{caption}</Text>
          </View>
        </View>
      </TouchableNativeFeedback>
    );
  }

  render() {
    const { currentStage } = this.state;
    const {
      headCont,
      searchInput
    } = this.styles;

    this.updateRootViewProps();

    return (
      <IQRView {...this.rootViewProps}>
        <HeadSection/>
        <ScrollView>
          <ListItem
            label="Requestor 1"
            caption="Phone number: +6012 345 6789"
            img={AppProvider.resources.image.test_profile}
            onPress={() => this.newRequestDialog()}
          />
          <ListItem
            label="Requestor 2"
            caption="Pending Acceptance"
          />
          <ListItem
            label="Requestor 3"
            caption="Pending Acceptance"
          />
          <ListItem
            label="Requestor 4"
            caption="Pending Acceptance"
          />
        </ScrollView>
      </IQRView>
    );
  }

  /*****
   Custom Style
   *****/
  styles = {
  };

  /*****
   custom event handlers
   *****/
  newRequestDialog = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    this.showDialog('NewRequest', { onClose: this.closeNewRequest });
  };

  closeNewRequest = (answer) => {
    this.hideDialog('NewRequest');
    if (answer) this.showDialog('VerifyDetail');
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

export default connect(mapStateToProps, mapDispatchToProps)(VerifyListView);
