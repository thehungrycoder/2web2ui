import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';

import { Page } from '@sparkpost/matchbox';
import { UsageReport } from 'src/components';
import Tutorial from './components/Tutorial';
import EmailBanner from './components/EmailBanner';
import SuppressionBanner from './components/SuppressionBanner';

import { showAlert } from 'src/actions/globalAlert';
import { verifyEmail } from 'src/actions/currentUser';
import { fetch as fetchAccount, getPlans } from 'src/actions/account';
import { checkSuppression } from 'src/actions/suppressions';
import { list as listSendingDomains } from 'src/actions/sendingDomains';
import { listApiKeys } from 'src/actions/api-keys';

import selectAccountAgeInWeeks from 'src/selectors/accountAge';
import { selectVerifiedDomains, selectReadyForBounce } from 'src/selectors/sendingDomains';
import { selectApiKeysForSending } from 'src/selectors/api-keys';

export class DashboardPage extends Component {
  componentDidMount() {
    this.props.checkSuppression();
    this.props.listSendingDomains();
    this.props.getPlans();
    this.props.listApiKeys({ id: 0 });
  }

  resendVerification() {
    const { verifyEmail, showAlert } = this.props;
    return verifyEmail()
      .then(() => showAlert({
        type: 'success',
        message: 'Please click the link in the email we sent you to verify your email.'
      }));
  }

  renderVerifyEmailCta() {
    const { currentUser, verifyingEmail } = this.props;

    if (!currentUser.email_verified) {
      return (
        <EmailBanner
          verifying={verifyingEmail}
          handleResend={() => this.resendVerification()} />
      );
    }
  }

  render() {
    const { accountAgeInWeeks, hasSuppressions } = this.props;

    return (
      <Page title='Dashboard'>

        { this.renderVerifyEmailCta() }

        <UsageReport />
        <SuppressionBanner accountAgeInWeeks={accountAgeInWeeks} hasSuppressions={hasSuppressions} />
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
    verifyingEmail: state.currentUser.verifyingEmail,
    accountAgeInWeeks: acctAge,
    hasSuppressions: state.suppressions.hasSuppression,
    hasSendingDomains: state.sendingDomains.list.length > 0,
    hasVerifiedDomains: verifiedDomains.length > 0,
    hasApiKeysForSending: apiKeysForSending.length > 0,
    hasBounceDomains: readyForBounce.length > 0,
    hasSentThisMonth: _.get(state, 'account.usage.month.used', 0) > 0
  };
}

export default withRouter(connect(mapStateToProps, { fetchAccount, checkSuppression, listSendingDomains, listApiKeys, verifyEmail, showAlert, getPlans })(DashboardPage));
