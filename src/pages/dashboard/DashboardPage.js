import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';

import { Page } from '@sparkpost/matchbox';
import { UsageReport } from 'src/components';
import Tutorial from './components/Tutorial';
import VerifyEmailBanner from 'src/components/verifyEmailBanner/VerifyEmailBanner';
import SuppressionBanner from './components/SuppressionBanner';

import { fetch as fetchAccount } from 'src/actions/account';
import { checkSuppression } from 'src/actions/suppressions';
import { list as listSendingDomains } from 'src/actions/sendingDomains';
import { listApiKeys } from 'src/actions/api-keys';

import selectAccountAgeInWeeks from 'src/selectors/accountAge';
import { selectVerifiedDomains, selectNotBlockedDomains } from 'src/selectors/sendingDomains';
import { selectApiKeysForSending } from 'src/selectors/api-keys';

export class DashboardPage extends Component {
  componentDidMount() {
    this.props.checkSuppression();
    this.props.listSendingDomains();
    this.props.listApiKeys({ id: 0 });
  }

  render() {
    const { accountAgeInWeeks, currentUser, hasSuppressions } = this.props;

    return (
      <Page title='Dashboard'>
        {currentUser.email_verified === false && (
          <VerifyEmailBanner verifying={currentUser.verifyingEmail} />
        )}
        <UsageReport accountAgeInWeeks={accountAgeInWeeks} />
        <SuppressionBanner accountAgeInWeeks={accountAgeInWeeks} hasSuppressions={hasSuppressions} />
        <Tutorial {...this.props} />
      </Page>
    );
  }
}

function mapStateToProps(state) {
  const acctAge = selectAccountAgeInWeeks(state);
  const notBlockedDomains = selectNotBlockedDomains(state);
  const verifiedDomains = selectVerifiedDomains(state);
  const apiKeysForSending = selectApiKeysForSending(state);

  return {
    currentUser: state.currentUser,
    accountAgeInWeeks: acctAge,
    hasSuppressions: state.suppressions.hasSuppression,
    hasSendingDomains: notBlockedDomains.length > 0,
    hasVerifiedDomains: verifiedDomains.length > 0,
    hasApiKeysForSending: apiKeysForSending.length > 0,
    hasSentThisMonth: _.get(state, 'account.usage.month.used', 0) > 0
  };
}

export default withRouter(connect(mapStateToProps, { fetchAccount, checkSuppression, listSendingDomains, listApiKeys })(DashboardPage));
