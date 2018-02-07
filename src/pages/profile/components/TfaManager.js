import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Panel } from '@sparkpost/matchbox';
import { PanelLoading } from 'src/components';
import { getTfaStatus, generateBackupCodes, clearBackupCodes } from 'src/actions/tfa';
import BackupCodesModal from './BackupCodesModal';

export class TfaManager extends Component {

  state = {
    openModal: null
  };

  componentDidMount() {
    if (this.props.statusUnknown) {
      this.props.getTfaStatus();
    }
  }

  closeModals = () => this.setState({ openModal: null });

  closeBackupModal = () => {
    this.closeModals();
    this.props.clearBackupCodes();
  };

  render() {
    const {
      statusUnknown,
      enabled,
      generateBackupCodes,
      backupCodes,
      backupCodesPending,
      backupCodesError
    } = this.props;

    if (statusUnknown) {
      return <PanelLoading minHeight='100px' />;
    }

    const enabledActions = [{
      content: 'Enable 2FA',
      onClick: () => this.setState({ openModal: 'enable' })
    }];

    const disabledActions = [{
      content: 'Generate New Backup Codes',
      onClick: () => this.setState({ openModal: 'backupCodes' })
    }, {
      content: 'Disable 2FA',
      onClick: () => this.setState({ openModal: 'disable' })
    }];

    return (
      <Panel sectioned title='2FA' actions={enabled ? enabledActions : disabledActions}>
        <p>Two-factor authentication is currently <strong>{enabled ? 'enabled' : 'disabled'}</strong>.</p>
        <BackupCodesModal
          open={this.state.openModal === 'backupCodes'}
          onClose={this.closeModals}
          generate={generateBackupCodes}
          codes={backupCodes}
          pending={backupCodesPending}
          error={backupCodesError}
        />
      </Panel>
    );
  }

}

const mapStateToProps = ({ currentUser, tfa: { backupCodes, backupCodesPending, backupCodesError }}) => ({
  statusUnknown: currentUser.tfa === 'unknown',
  enabled: currentUser.tfa === 'enabled',
  backupCodes,
  backupCodesPending,
  backupCodesError
});

export default connect(mapStateToProps, { getTfaStatus, generateBackupCodes, clearBackupCodes })(TfaManager);
