import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';

import { Page, Banner } from '@sparkpost/matchbox';
import { UsageReport } from 'src/components';
import Tutorial from './components/Tutorial';
import EmailBanner from './components/EmailBanner';

import { fetch as fetchAccount } from 'src/actions/account';
import { checkSuppression } from 'src/actions/suppressions';
import { list as listSendingDomains } from 'src/actions/sendingDomains';
import { listApiKeys } from 'src/actions/api-keys';

import selectAccountAgeInWeeks from 'src/selectors/accountAge';
import { selectVerifiedDomains, selectReadyForBounce } from 'src/selectors/sendingDomains';
import { selectApiKeysForSending } from 'src/selectors/api-keys';

export class DashboardPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sendingStatus: null
    };
  }

  componentDidMount() {
    this.props.checkSuppression();
    this.props.listSendingDomains();
    this.props.listApiKeys({ id: 0 });
  }

  resendVerification() {
    // TODO do this in redux
    this.setState({ sendingStatus: 'sending' });
  }

  renderVerifyEmailCta() {
    const { currentUser } = this.props;

    if (!currentUser.email_verified) {
      return (
        <EmailBanner
          sendingStatus={this.state.sendingStatus}
          handleResend={() => this.resendVerification()} />
      );
    }
  }

  renderSuppressionBanner() {
    const { accountAgeInWeeks, hasSuppressions } = this.props;

    if (accountAgeInWeeks > 1 && hasSuppressions === false) {
      return (
        <Banner title="Coming from another email service?">
          <p>Welcome! Make sure you import your suppression list from your previous provider to avoid sending to people who have previously opted out, consistently bounced, etc. Learn more about migrating from Mailgun, Mandrill, or SendGrid. <a href="https://www.sparkpost.com/docs/getting-started/getting-started-sparkpost/#important-coming-from-other-email-services" target="_blank" rel="noopener noreferrer">Import your suppressions</a>.</p>
        </Banner>
      );
    }
  }

  render() {
    return (
      <Page title='Dashboard'>

        { this.renderVerifyEmailCta() }

        <UsageReport />

        { this.renderSuppressionBanner() }

        <Tutorial {...this.props} />
      </Page>
    );
  }
}

function mapStateToProps(state) {
  const acctAge = selectAccountAgeInWeeks(state);
  const verifiedDomains = selectVerifiedDomains(state);
  const apiKeysForSending = selectApiKeysForSending(state);
  const readyForBounce = selectReadyForBounce(state);

  return {
    currentUser: state.currentUser,
    accountAgeInWeeks: acctAge,
    hasSuppressions: state.suppressions.hasSuppression,
    hasSendingDomains: state.sendingDomains.list.length > 0,
    hasVerifiedDomains: verifiedDomains.length > 0,
    hasApiKeysForSending: apiKeysForSending.length > 0,
    hasBounceDomains: readyForBounce.length > 0,
    hasSentThisMonth: _.get(state, 'account.usage.month.used', 0) > 0
  };
}

export default withRouter(connect(mapStateToProps, { fetchAccount, checkSuppression, listSendingDomains, listApiKeys })(DashboardPage));
