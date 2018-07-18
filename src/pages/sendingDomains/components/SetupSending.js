import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

// components
import { Panel, UnstyledLink } from '@sparkpost/matchbox';
import { LabelledValue } from 'src/components';
import VerifyEmail from './VerifyEmail';
import { SendingDomainSection } from './SendingDomainSection';
import { VerifiedIcon, ErrorIcon } from './Icons';

// actions
import { showAlert } from 'src/actions/globalAlert';
import { verifyDkim } from 'src/actions/sendingDomains';

import { resolveReadyFor } from 'src/helpers/domains';
import config from 'src/config';

export class SetupSending extends Component {
  state = {
    // verify via email modal
    open: false
  };

  verifyDomain = () => {
    const { domain: { id, subaccount_id: subaccount }, verifyDkim, showAlert } = this.props;

    return verifyDkim({ id, subaccount })
      .then((results) => {
        const readyFor = resolveReadyFor(results);

        if (readyFor.dkim) {
          showAlert({ type: 'success', message: `You have successfully verified DKIM record of ${id}` });
        } else {
          showAlert({
            type: 'error',
            message: `Unable to verify DKIM record of ${id}. ${results.dns.dkim_error}`
          });
        }
      });
  }

  renderText() {
    const { domain } = this.props;
    const readyFor = resolveReadyFor(domain.status);
    let content = null;

    if (!readyFor.sending && !readyFor.dkim) {
      content = <p><strong>To use this domain for sending</strong>, add this TXT record to your DNS settings, paying close attention to the specified hostname.</p>;

      // Append second paragraph for mailbox verification
      if (config.featureFlags.allow_mailbox_verification) {
        content = (
          <React.Fragment>
            {content}
            <p>
              We recommend DNS verification, but if you don't have DNS access, you
              can <UnstyledLink id="verify-with-email" onClick={this.toggleVerifyViaEmailModal}> set
              this domain up for sending via email.</UnstyledLink>
            </p>
            {this.state.open && (
              <VerifyEmail
                id={domain.id}
                open={this.state.open}
                onCancel={this.toggleVerifyViaEmailModal}
                subaccount={domain.subaccount_id}
              />
            )}
          </React.Fragment>
        );
      }
    }

    if (readyFor.sending && !readyFor.dkim) {
      content = <p>This domain is <strong>ready for sending</strong>, but if you plan to use it for sending, we still recommend that you add this TXT record to make it <strong>ready for DKIM</strong> as well.</p>;
    }

    return content;
  }

  toggleVerifyViaEmailModal = () => {
    this.setState({ open: !this.state.open });
  }

  renderTxtRecordPanel() {
    const { domain: { dkimHostname, dkimValue, status }, verifyDkimLoading } = this.props;
    const readyFor = resolveReadyFor(status);
    const verified = readyFor.sending && readyFor.dkim;

    const titleIcon = verified ? <VerifiedIcon/> : <ErrorIcon/>;
    const verifyButtonContent = verified ? 'Re-verify TXT Record' : 'Verify TXT Record';

    return (
      <Panel
        actions={[{
          id: 'verify-dkim',
          content: verifyDkimLoading ? 'Verifying...' : verifyButtonContent,
          onClick: this.verifyDomain,
          disabled: verifyDkimLoading,
          color: 'orange'
        }]}
        sectioned
        title={<Fragment>{titleIcon} <span>DNS Settings</span></Fragment>}
      >
        <LabelledValue label='Type'><p>TXT</p></LabelledValue>
        <LabelledValue label='Hostname'><p>{dkimHostname}</p></LabelledValue>
        <LabelledValue label='Value'><p>{dkimValue}</p></LabelledValue>
      </Panel>
    );
  }

  render() {
    return (
      <SendingDomainSection title="Set Up For Sending">
        <SendingDomainSection.Left>
          {this.renderText()}
        </SendingDomainSection.Left>
        <SendingDomainSection.Right>
          {this.renderTxtRecordPanel()}
        </SendingDomainSection.Right>
      </SendingDomainSection>
    );
  }
}

const mapStateToProps = ({ sendingDomains: { verifyDkimError, verifyDkimLoading }}) => ({
  verifyDkimError,
  verifyDkimLoading
});

export default withRouter(connect(mapStateToProps, { verifyDkim, showAlert })(SetupSending));
