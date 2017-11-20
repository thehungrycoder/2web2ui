import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';

import { Page, Banner } from '@sparkpost/matchbox';
import { UsageReport } from 'src/components';
import Tutorial from './components/Tutorial';
import EmailBanner from './components/EmailBanner';

import { fetch as fetchAccount } from 'src/actions/account';
import { listSuppressions } from 'src/actions/suppressions';
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
    this.props.listSuppressions({ sources: 'Manually Added', limit: 1 });
    this.props.listSendingDomains();
    this.props.listApiKeys({ subaccount: { id: 0 }});
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

  renderUpgradeCta() {
    const { account } = this.props;

    // if account is free and active
    if (/free/i.test(account.subscription.code) && account.status === 'active') {
      return (
        <Banner
          title='Send more mail'
          status='info'
          action={{
            content: 'Upgrade Now',
            Component: Link,
            to: '/account/billing/plan'
          }}>
          <p>Upgrade now to increase daily limits and start sending more mail.</p>
        </Banner>
      );
    }

  }

  renderSuppressionBanner() {
    const { accountAgeInWeeks, hasSuppressions } = this.props;

    if (accountAgeInWeeks < 1 && !hasSuppressions) {
      return (
        <Banner title="Hey! We noticed you haven't imported a suppression list">
          <p>If you're coming from a previous provider, be sure to also <a href="https://www.sparkpost.com/docs/getting-started/getting-started-sparkpost/#important-coming-from-other-email-services" target="_blank" rel="noopener noreferrer">import your suppressions</a>.</p>
        </Banner>
      );
    }
  }

  render() {
    return (
      <Page title='Dashboard'>

        { this.renderVerifyEmailCta() }
        { this.renderUpgradeCta() }

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
    account: state.account,
    accountAgeInWeeks: acctAge,
    hasSuppressions: state.suppressions.list.length > 0,
    hasSendingDomains: state.sendingDomains.list.length > 0,
    hasVerifiedDomains: verifiedDomains.length > 0,
    hasApiKeysForSending: apiKeysForSending.length > 0,
    hasBounceDomains: readyForBounce.length > 0,
    hasSentThisMonth: state.account.usage.month.used > 0
  };
}

export default withRouter(connect(mapStateToProps, { fetchAccount, listSuppressions, listSendingDomains, listApiKeys })(DashboardPage));
