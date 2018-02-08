import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

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
    const { domain: id, subaccount, verifyPostmaster } = this.props;

    return verifyPostmaster({ id, subaccount })
      .then(this.onVerifySuccess(`abuse@${id}`))
      .catch(this.onVerifyFail);
  }

  verifyWithCustom = () => {
    const { domain: id, subaccount, verifyMailbox } = this.props;
    const { localpart } = this.state;
    const error = required(this.state.localPart);

    if (error) {
      return this.setState({ error });
    }

    return verifyMailbox({ id, mailbox: localpart, subaccount })
      .then(this.onVerifySuccess(`${localpart}@${id}`))
      .catch(this.onVerifyFail);
  }

  verifyWithPostmaster = () => {
    const { domain: id, subaccount, verifyPostmaster } = this.props;

    return verifyPostmaster({ id, subaccount })
      .then(this.onVerifySuccess(`postmaster@${id}`))
      .catch(this.onVerifyFail);
  }

  onVerifyFail = (email) => () => {
    this.props.showAlert({ type: 'success', message: `Email sent to ${email}` });
  }

  onVerifySuccess = (error) => {
    this.props.showAlert({ type: 'error', message: `Email verification error: ${error.message}` });
  }

  renderAllowAnyoneAt = () => {
    const { domain } = this.props;
    const { localPart } = this.state;

    return (
      <Panel.Section>
        <p>Start sending email from this domain by sending a verification email to any mailbox on your domain using the form below.</p>
        <Grid>
          <Grid.Column xs={6}>
            <p>
              <TextField
                id="localpart"
                onChange={this.onChange}
                onBlur={this.onBlur}
                connectRight={<strong className={styles.Domain}>{`@${domain.id}`}</strong>}
                value={localPart}
                error={this.state.error}
              />
            </p>
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

export default withRouter(connect(mapStateToProps, { ...sendingDomainsActions, showAlert })(VerifyEmail));
