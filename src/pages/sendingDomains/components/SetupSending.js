import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Panel, Grid, Banner, Table, Icon, Button } from '@sparkpost/matchbox';
import { SendingDomainSection } from './SendingDomainSection';
import { showAlert } from 'src/actions/globalAlert';
import { resolveReadyFor } from 'src/helpers/domains';
import { verify } from 'src/actions/sendingDomains';
import config from 'src/config';
import styles from './SendingDomainSection.module.scss';

export class SetupSending extends Component {
  verifyDomain = () => {
    const { id, subaccount, verify, showAlert } = this.props;

    return verify(id, 'dkim', subaccount)
      .then((results) => {
        const readyFor = resolveReadyFor(results);
        if (readyFor.dkim) {
          showAlert({ type: 'success', message: `You have successfully verified DKIM record of ${id}` });
        } else {
          showAlert({ type: 'error', message: `Unable to verify DKIM record of ${id}. ${results.dns.dkim_error}` });
        }
      }).catch((err) => {
        showAlert({ type: 'error', message: `Unable to verify DKIM record of ${id}. ${err.message}` });
      });
  }

  renderBanner() {
    const { domain } = this.props;
    const readyFor = resolveReadyFor(domain.status);

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
    // TODO: what about (!readyFor.sending && readyFor.dkim)?
  }

  renderVerifyButton() {
    const { verifyLoading } = this.props;

    return (
      verifyLoading
        ? <Button plain disabled={true}>Verifying...</Button>
        : <Button plain onClick={this.verifyDomain}>Verify TXT Record</Button>
    );
  }

  renderIcon() {
    const { domain } = this.props;
    const readyFor = resolveReadyFor(domain.status);

    return (
      readyFor.dkim
        ? <Icon name="Check" style={{ color: 'green' }}/>
        : <Icon name="Error" style={{ color: 'red' }}/>
    );
  }

  renderTxtRecordPanel() {
    const { domain, id } = this.props;

    return (
      <Panel sectioned>
        <Table>
          <tbody>
            <Table.Row>
              <Table.HeaderCell style={{ width: 8 }}/>
              <Table.HeaderCell style={{ width: 70 }} className={styles.SendingDomainSection}>
              Type
              </Table.HeaderCell>
              <Table.HeaderCell style={{ width: 160 }} className={styles.SendingDomainSection}>
              Hostname
              </Table.HeaderCell>
              <Table.HeaderCell style={{ width: 220 }} className={styles.SendingDomainSection}>
                Value <div style={{ float: 'right' }}> { this.renderVerifyButton() } </div>
              </Table.HeaderCell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className={styles.SendingDomainSection}>
                {this.renderIcon()}
              </Table.Cell>
              <Table.Cell className={styles.SendingDomainSection}>
                TXT
              </Table.Cell>
              <Table.Cell className={styles.SendingDomainSection}>
                {`${domain.dkim.selector}._domainkey.${id}`}
              </Table.Cell>
              <Table.Cell className={styles.SendingDomainSection}>
                {`v=DKIM1; k=rsa; h=sha256; p=${domain.dkim.public}`}
              </Table.Cell>
            </Table.Row>
          </tbody>
        </Table>
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
