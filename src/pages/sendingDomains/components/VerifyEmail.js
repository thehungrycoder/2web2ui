import React, { Component } from 'react';
import { connect } from 'react-redux';

import { BaseModal } from 'src/components';
import { Panel, Button, TextField, Grid } from '@sparkpost/matchbox';
import config from 'src/config';
import styles from './VerifyEmail.module.scss';
import { required } from 'src/helpers/validation';

// actions
import { showAlert } from 'src/actions/globalAlert';
import * as sendingDomainsActions from 'src/actions/sendingDomains';

export class VerifyEmail extends Component {
  state = {
    localPart: ''
  }

  verifyWithAbuse = () => {
    const { id, subaccount, verifyAbuse } = this.props;

    return verifyAbuse({ id, subaccount })
      .then(this.onVerifySuccess(`abuse@${id}`))
      .catch(this.onVerifyFail);
  }

  verifyWithCustom = () => {
    const { id, subaccount, verifyMailbox } = this.props;
    const { localPart } = this.state;
    const error = required(localPart);

    if (error) {
      return this.setState({ error });
    }

    return verifyMailbox({ id, mailbox: localPart, subaccount })
      .then(this.onVerifySuccess(`${localPart}@${id}`))
      .catch(this.onVerifyFail);
  }

  verifyWithPostmaster = () => {
    const { id, subaccount, verifyPostmaster } = this.props;

    return verifyPostmaster({ id, subaccount })
      .then(this.onVerifySuccess(`postmaster@${id}`))
      .catch(this.onVerifyFail);
  }

  onVerifySuccess = (email) => () => {
    this.props.showAlert({ type: 'success', message: `Email sent to ${email}` });
  }

  onVerifyFail = (error) => {
    this.props.showAlert({ type: 'error', message: `Email verification error: ${error.message}` });
  }

  renderAllowAnyoneAt = () => {
    const { id } = this.props;
    const { localPart } = this.state;

    return (
      <Panel.Section>
        <p>Start sending email from this domain by sending a verification email to any mailbox on your domain using the form below.</p>
        <Grid>
          <Grid.Column xs={6}>
            <div>
              <TextField
                id="localPart"
                onChange={this.onChange}
                onBlur={this.onBlur}
                connectRight={<strong className={styles.Domain}>{`@${id}`}</strong>}
                value={localPart}
                error={this.state.error}
              />
            </div>
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

  onBlur = ({ currentTarget }) => {
    this.setState({ error: required(currentTarget.value) });
  }

  renderAllowMailboxVerification = () => {
    const { id } = this.props;

    return (
      <Panel.Section>
        <p>Start sending email from this domain by sending a verification email to one of the addresses below.</p>
        <Grid>
          <Grid.Column xs={6}>
            <p><strong>{`postmaster@${id}`}</strong></p>
          </Grid.Column>
          <Grid.Column xs={6}>
            <div className={styles.ButtonColumn}> {this.renderVerifyButton(this.verifyWithPostmaster) } </div>
          </Grid.Column>
        </Grid>
        <Grid>
          <Grid.Column xs={6}>
            <p><strong>{`abuse@${id}`}</strong></p>
          </Grid.Column>
          <Grid.Column xs={6}>
            <div className={styles.ButtonColumn}>{this.renderVerifyButton(this.verifyWithAbuse)}</div>
          </Grid.Column>
        </Grid>
      </Panel.Section>
    );
  }

  renderVerifyButton = (eventHandler) => {
    const { submitting } = this.props;

    return (
      <Button
        plain
        disabled={submitting}
        onClick={eventHandler}
      >
        {submitting ? 'Sending Email...' : 'Send Email'}
      </Button>
    );
  }

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

const mapStateToProps = (state) => ({
  submitting: state.sendingDomains.verifyEmailLoading
});

export default connect(mapStateToProps, { ...sendingDomainsActions, showAlert })(VerifyEmail);
