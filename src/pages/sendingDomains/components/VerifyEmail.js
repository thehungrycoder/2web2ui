import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { BaseModal } from 'src/components';
import { Panel, Button, TextField, Grid } from '@sparkpost/matchbox';
import config from 'src/config';
import styles from './VerifyEmail.module.scss';

// actions
import { showAlert } from 'src/actions/globalAlert';
import { verify } from 'src/actions/sendingDomains';



export class VerifyEmail extends Component {
  state = {
    localPart: ''
  }

  verifyEmail = (type) => {
    const { domain: { id, subaccount_id: subaccount }, verify, showAlert } = this.props;
    const { localPart } = this.state;

    const friendlyType = localPart || type.split('_')[0];
    return verify({ id, type, subaccount, mailbox: localPart })
      .then(() => {
        showAlert({ type: 'success', message: `Email sent to ${friendlyType}@${id}` });
      }).catch((err) => {
        showAlert({ type: 'error', message: `Email verification error: ${err.message}` });
      });
  }

  renderAllowAnyoneAt = () => {
    const { domain } = this.props;
    const { localPart } = this.state;

    return (
      <Panel.Section>
        <p>Start sending email from this domain by sending a verification email to any mailbox on your domain using the form below.</p>
        <Grid>
          <Grid.Column xs={6}>
            <p><TextField id='localpart' onChange={this.onChange} connectRight={<strong>{`@${domain.id}`}</strong>} value={localPart}/></p>
          </Grid.Column>
          <Grid.Column xs={6}>
            <div className={styles.ButtonColumn}>{ this.renderVerifyButton(this.verifyWithCustom) }</div>
          </Grid.Column>
        </Grid>
      </Panel.Section>
    );
  }

  onChange = (event) => {
    this.setState({
      localPart: event.currentTarget.value
    });
  }

  renderAllowMailboxVerification = () => {
    const { domain } = this.props;

    return (
      <Panel.Section>
        <p>Start sending email from this domain by sending a verification email to one of the addresses below.</p>
        <Grid>
          <Grid.Column xs={6}>
            <p><strong>{`postmaster@${domain.id}`}</strong></p>
          </Grid.Column>
          <Grid.Column xs={6}>
            <div className={styles.ButtonColumn}> {this.renderVerifyButton(this.verifyWithPostmaster) } </div>
          </Grid.Column>
        </Grid>
        <Grid>
          <Grid.Column xs={6}>
            <p><strong>{`abuse@${domain.id}`}</strong></p>
          </Grid.Column>
          <Grid.Column xs={6}>
            <div className={styles.ButtonColumn}>{this.renderVerifyButton(this.verifyWithAbuse)}</div>
          </Grid.Column>
        </Grid>
      </Panel.Section>
    );
  }

  renderVerifyButton = (eventHandler) => {
    const { verifyLoading } = this.props;

    return (
      <Button plain disabled={verifyLoading} onClick={eventHandler}>{verifyLoading ? 'Sending Email...' : 'Send Email'}</Button>
    );
  }

  verifyWithPostmaster = () => this.verifyEmail('postmaster_at');
  verifyWithAbuse = () => this.verifyEmail('abuse_at');
  verifyWithCustom = () => this.verifyEmail('verification_mailbox', this.state.localPart);

  render() {
    const { open, onCancel } = this.props;
    const renderVerification = config.featureFlags.allow_anyone_at_verification
      ? this.renderAllowAnyoneAt()
      : this.renderAllowMailboxVerification();

    return (
      <BaseModal open={open}>
        <Panel title='Verify through Email' accent sectioned actions={[{ content: 'Close', onClick: onCancel }]}>
          {renderVerification}
        </Panel>
      </BaseModal>
    );
  }
}

const mapStateToProps = ({ sendingDomains: { verifyError, verifyLoading }}) => ({
  verifyError,
  verifyLoading
});

export default withRouter(connect(mapStateToProps, { verify, showAlert })(VerifyEmail));
