import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

// components
import { Panel, Grid, Banner, Icon, Button } from '@sparkpost/matchbox';
import { LongTextContainer } from 'src/components';
import SimpleTable from './SimpleTable';
import { SendingDomainSection } from './SendingDomainSection';

// actions
import { showAlert } from 'src/actions/globalAlert';
import { verify } from 'src/actions/sendingDomains';

import { resolveReadyFor } from 'src/helpers/domains';
import config from 'src/config';
import styles from './SetupSending.module.scss';

export class SetupSending extends Component {
  showErrorAlert = ({ message }) => {
    const { id, showAlert } = this.props;

    showAlert({ type: 'error', message: `Unable to verify DKIM record of ${id}. ${message}` });
  };

  verifyDomain = () => {
    const { id, subaccount, verify, showAlert } = this.props;

    return verify({ id, type: 'dkim', subaccount })
      .then((results) => {
        const readyFor = resolveReadyFor(results);
        if (readyFor.dkim) {
          showAlert({ type: 'success', message: `You have successfully verified DKIM record of ${id}` });
        } else {
          this.showErrorAlert({ message: results.dns.dkim_error });
        }
      }).catch((err) => {
        this.showErrorAlert({ message: err.message });
      });
  }

  renderBanner() {
    const readyFor = resolveReadyFor(this.props.domain.status);

    if (readyFor.sending && readyFor.dkim) {
      return (<p>This domain is all set up to send with DKIM-signing. Nice work!</p>);
    } else if (!readyFor.sending && !readyFor.dkim && !config.featureFlags.allow_mailbox_verification) {
      return (<p><strong>To use this domain for sending</strong>, add this TXT record to your DNS settings, paying close attention to the specified hostname.</p>);
    } else if (!readyFor.sending && !readyFor.dkim && config.featureFlags.allow_mailbox_verification) {
      return (<p>We recommend DNS verification, but if you don't have DNS access, you can <a>set this domain up for sending via email</a>.</p>);
    } else if (readyFor.sending && !readyFor.dkim) {
      return (
        <Banner status="warning">
          This domain is "ready for sending" but if you plan to use it for sending, we still recommend that you add this TXT record to make it "ready for DKIM" as well.
        </Banner>
      );
    }
    return null;
  }

  renderVerifyButton() {
    const { verifyLoading } = this.props;
    const buttonText = verifyLoading ? 'Verifying...' : 'Verify TXT Record';

    return (
      <Button plain disabled={verifyLoading} onClick={this.verifyDomain}>{buttonText}</Button>
    );
  }

  renderIcon() {
    const { domain } = this.props;
    const readyFor = resolveReadyFor(domain.status);

    return (
      readyFor.dkim
        ? <Icon name="Check" className={styles.GreenCheck}/>
        : <Icon name="Error" className={styles.RedError}/>
    );
  }

  renderTxtRecordPanel() {
    const { domain: { dkimHostname, dkimValue }} = this.props;

    // Headers
    const typeHeader = <div style={{ width: 40 }}> Type </div>;
    const hostnameHeader = <div style={{ width: 160 }}> Hostname </div>;
    const valueHeader = <div style={{ width: 220 }}> Value <div style={{ float: 'right' }}> { this.renderVerifyButton() } </div></div>;
    // Rows
    const hostnameRow = <LongTextContainer text={dkimHostname}/>;
    const valueRow = <LongTextContainer text={dkimValue}/>;

    return (
      <Panel sectioned>
        <SimpleTable
          header={[null, typeHeader, hostnameHeader, valueHeader]}
          rows={ [[this.renderIcon(), 'TXT', hostnameRow, valueRow ]]}
        />
      </Panel>
    );
  }

  render() {
    return (
      <SendingDomainSection
        title="Set Up For Sending"
        sectioned
      >
        <Grid>
          <Grid.Column xs={12} md={4}>
            {this.renderBanner()}
          </Grid.Column>
          <Grid.Column xs={12} md={8}>
            {this.renderTxtRecordPanel()}
          </Grid.Column>
        </Grid>
      </SendingDomainSection>);
  }
}

const mapStateToProps = ({ sendingDomains: { verifyError, verifyLoading }}) => ({
  verifyError,
  verifyLoading
});

export default withRouter(connect(mapStateToProps, { verify, showAlert })(SetupSending));
