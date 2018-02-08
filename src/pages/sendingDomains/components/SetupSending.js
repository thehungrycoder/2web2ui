import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

// components
import { Panel, Grid, Banner, Button } from '@sparkpost/matchbox';
import { LongTextContainer } from 'src/components';
import SimpleTable from './SimpleTable';
import ReadyForIcon from './ReadyForIcon';
import VerifyEmail from './VerifyEmail';
import { SendingDomainSection } from './SendingDomainSection';
import { VerifiedIcon } from './Icons';

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

  showErrorAlert = ({ message }) => {
    const { domain: { id }, showAlert } = this.props;

    showAlert({ type: 'error', message: `Unable to verify DKIM record of ${id}. ${message}` });
  };

  verifyDomain = () => {
    const { domain: { id, subaccount_id: subaccount }, verifyDkim, showAlert } = this.props;

    return verifyDkim({ id, subaccount })
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
            <p>
              We recommend DNS verification, but if you don't have DNS access, you
              can <UnstyledLink onClick={this.toggleVerifyViaEmailModal}> set this domain up for
              sending via email.</UnstyledLink>
            </p>
            {this.renderVerifyViaEmailModal()}
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
    const { verifyDkimLoading } = this.props;
    const buttonText = verifyDkimLoading ? 'Verifying...' : 'Verify TXT Record';

    return {
      content: buttonText,
      onClick: this.verifyDomain,
      disabled: verifyDkimLoading
    };
  }

  toggleVerifyViaEmailModal = () => {
    const { open } = this.state;

    this.setState({
      open: !open
    });
  }

  renderVerifyViaEmailModal = () => {
    const { open } = this.state;
    const { domain } = this.props;

    if (!domain) {
      return null;
    }

    return (
      <VerifyEmail domain={domain} open={open} onCancel={this.toggleVerifyViaEmailModal}/>
    );
  }

  renderTxtRecordPanel() {
    const { domain: { dkimHostname, dkimValue, status }} = this.props;
    const readyFor = resolveReadyFor(status);

    if (readyFor.sending && readyFor.dkim) {
      return (
        <Panel sectioned>
          <p><VerifiedIcon/> This domain is all set up to send with DKIM-signing. Nice work!</p>
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

const mapStateToProps = ({ sendingDomains: { verifyDkimError, verifyDkimLoading }}) => ({
  verifyDkimError,
  verifyDkimLoading
});

export default withRouter(connect(mapStateToProps, { verifyDkim, showAlert })(SetupSending));
