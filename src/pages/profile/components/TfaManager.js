import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Panel, Icon } from '@sparkpost/matchbox';
import { PanelLoading, LabelledValue } from 'src/components';
import * as tfaActions from 'src/actions/tfa';
import BackupCodesModal from './BackupCodesModal';
import EnableTfaModal from './EnableTfaModal';
import DisableTfaModal from './DisableTfaModal';
import { LINKS } from 'src/constants';

export class TfaManager extends Component {

  state = {
    openModal: null
  };

  componentDidMount() {
    this.props.getTfaBackupStatus();

    if (this.props.statusUnknown) {
      this.props.getTfaStatus();
    }

    if (!this.props.secret) {
      this.props.getTfaSecret();
    }
  }

  closeModals = () => this.setState({ openModal: null });

  closeBackupModal = () => {
    this.closeModals();
    this.props.clearBackupCodes();
  };

  enable = (code) => this.props.toggleTfa({ enabled: true, code });
  disable = (password) => this.props.toggleTfa({ enabled: false, password });

  renderStatusMessage() {
    const { enabled, backupCodes } = this.props;

    if (!enabled) {
      return null;
    }

    if (backupCodes.activeCodes > 0) {
      return <p><small>You currently have {backupCodes.activeCodes} codes remaining.</small></p>;
    }

    // TODO: remove this <br> but settle on styling for this message
    return (
      <p><br /><Icon name="ErrorOutline" size={15} /> <small>We recommend saving a set of backup codes in case you lose or misplace your current device.</small></p>
    );
  }

  render() {
    const { enabled } = this.props;

    if (this.props.statusUnknown) {
      return <PanelLoading minHeight='100px' />;
    }

    const disabledActions = [{
      content: 'Enable 2FA',
      onClick: () => this.setState({ openModal: 'enable' })
    }, {
      content: 'Learn More',
      to: LINKS.LEARN_MORE_TFA,
      external: true
    }];

    const enabledActions = [{
      content: 'Generate New Backup Codes',
      onClick: () => this.setState({ openModal: 'backupCodes' })
    }, {
      content: 'Disable 2FA',
      onClick: () => this.setState({ openModal: 'disable' })
    }];

    return (
      <Panel sectioned title='Two-factor Authentication' actions={enabled ? enabledActions : disabledActions}>
        <LabelledValue label='Status'>
          <h6>{enabled ? 'Enabled' : 'Disabled'}</h6>
        </LabelledValue>
        {this.renderStatusMessage()}
        <BackupCodesModal
          open={this.state.openModal === 'backupCodes'}
          onClose={this.closeModals}
          generate={this.props.generateBackupCodes}
          {...this.props.backupCodes}
        />
        <EnableTfaModal
          open={this.state.openModal === 'enable'}
          onClose={this.closeModals}
          enable={this.enable}
          secret={this.props.secret}
          username={this.props.username}
          togglePending={this.props.togglePending}
          toggleError={this.props.toggleError}
          enabled={enabled}
        />
        <DisableTfaModal
          open={this.state.openModal === 'disable'}
          onClose={this.closeModals}
          disable={this.disable}
          togglePending={this.props.togglePending}
          toggleError={this.props.toggleError}
          enabled={enabled}
        />
      </Panel>
    );
  }

}

const mapStateToProps = ({ currentUser, tfa, tfaBackupCodes }) => ({
  ...tfa,
  username: currentUser.username,
  statusUnknown: tfa.enabled === null,
  enabled: tfa.enabled === true,
  backupCodes: tfaBackupCodes
});

export default connect(mapStateToProps, tfaActions)(TfaManager);
