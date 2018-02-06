import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

// components
import { Panel } from '@sparkpost/matchbox';
import { LabelledValue } from 'src/components';
import { SendingDomainSection } from './SendingDomainSection';

// actions
import { showAlert } from 'src/actions/globalAlert';
import { verify } from 'src/actions/sendingDomains';

import { resolveReadyFor } from 'src/helpers/domains';
import config from 'src/config';

export class SetupSending extends Component {
  showErrorAlert = ({ message }) => {
    const { domain: { id }, showAlert } = this.props;

    showAlert({ type: 'error', message: `Unable to verify DKIM record of ${id}. ${message}` });
  };

  verifyDomain = () => {
    const { domain: { id, subaccount_id: subaccount }, verify, showAlert } = this.props;

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

  renderText() {
    const readyFor = resolveReadyFor(this.props.domain.status);
    let content = null;

    if (!readyFor.sending && !readyFor.dkim) {
      content = <p><strong>To use this domain for sending</strong>, add this TXT record to your DNS settings, paying close attention to the specified hostname.</p>;

      // Append second paragraph for mailbox verification
      if (config.featureFlags.allow_mailbox_verification) {
        content = (
          <React.Fragment>
            {content}
            <p>We recommend DNS verification, but if you don't have DNS access, you can <a>set this domain up for sending via email</a>.</p>
          </React.Fragment>
        );
      }
    }

    if (readyFor.sending && !readyFor.dkim) {
      content = <p>This domain is <strong>ready for sending</strong>, but if you plan to use it for sending, we still recommend that you add this TXT record to make it <strong>ready for DKIM</strong> as well.</p>;
    }

    return content;
  }

  getVerifyAction() {
    const { verifyLoading } = this.props;
    const buttonText = verifyLoading ? 'Verifying...' : 'Verify TXT Record';

    return {
      content: buttonText,
      onClick: this.verifyDomain,
      disabled: verifyLoading
    };
  }

  renderTxtRecordPanel() {
    const { domain: { dkimHostname, dkimValue, status }} = this.props;
    const readyFor = resolveReadyFor(status);

    if (readyFor.sending && readyFor.dkim) {
      return (
        <Panel sectioned>
          <p>This domain is all set up to send with DKIM-signing. Nice work!</p>
        </Panel>
      );
    }

    return (
      <Panel title='DNS Settings' sectioned actions={[this.getVerifyAction()]}>
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

const mapStateToProps = ({ sendingDomains: { verifyError, verifyLoading }}) => ({
  verifyError,
  verifyLoading
});

export default withRouter(connect(mapStateToProps, { verify, showAlert })(SetupSending));
