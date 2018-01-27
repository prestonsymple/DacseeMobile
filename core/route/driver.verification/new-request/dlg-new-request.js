import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View, Dimensions } from 'react-native';

import _BaseView from '../../_base';
import { AppProvider } from '../../../providers';
import { AppUserEntity } from '../../../entities';
import HeadSection from './cmp-header';
import BodySection from './cmp-body';
import FooterSection from './cmp-footer';

const { width } = Dimensions.get('window');

class newRequestDialog extends _BaseView {
  constructor(props) {
    super(props);

    // init state
    this.state = {
      ...this.state,
    };

    // init view
    this.showHeader(false);
  }

  /*****
   react-native events
   *****/
  render() {
    this.updateRootViewProps();

    const {
      dialogView,
      backDrop,
    } = this.styles;

    const { onClose } = this.props;

    return (
      <View style={backDrop}>
        <View style={dialogView}>
          <HeadSection/>
          <BodySection
            name="Requestor 1"
            img={AppProvider.resources.image.test_profile}
          />
          <FooterSection
            closeBtn={() => onClose(false)}
            moreBtn={() => onClose(true)}
          />
        </View>
      </View>
    );
  }

  /*****
   Custom Style
   *****/
  styles = {
    backDrop: {
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      padding: (width / 100) * 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    dialogView: {
      maxHeight: '100%',
      width: '100%',
      backgroundColor: 'white',
      borderRadius: 3,
      shadowOffset: { width: 10, height: 10 },
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      elevation: 10,
      position: 'relative'
    }
  };

  /*****
   custom event handlers
   *****/
  closeDialog() {
    this.hideDialog();
  }

  navView(view) {
    this.hideDialog();
    this.goToView(view);
  }
}

/*****
 store bindings
 *****/
const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  entities: {
    appUser: bindActionCreators(AppUserEntity.actions, dispatch)
  }
});


export default connect(mapStateToProps, mapDispatchToProps)(newRequestDialog);
