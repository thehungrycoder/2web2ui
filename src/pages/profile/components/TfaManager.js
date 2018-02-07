import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Panel } from '@sparkpost/matchbox';
import { PanelLoading } from 'src/components';
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
      <Panel sectioned title='2FA' actions={enabled ? enabledActions : disabledActions}>
        <p>Two-factor authentication is currently <strong>{enabled ? 'enabled' : 'disabled'}</strong>.</p>
        <BackupCodesModal
          open={this.state.openModal === 'backupCodes'}
          onClose={this.closeModals}
          generate={this.props.generateBackupCodes}
          codes={this.props.backupCodes}
          pending={this.props.backupCodesPending}
          error={this.props.backupCodesError}
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

const mapStateToProps = ({ currentUser, tfa, tfaBackupCodes: { codes, error, pending }}) => ({
  ...tfa,
  username: currentUser.username,
  statusUnknown: tfa.enabled === null,
  enabled: tfa.enabled === true,
  backupCodes: codes,
  backupCodesPending: pending,
  backupCodesError: error
});

export default connect(mapStateToProps, tfaActions)(TfaManager);
