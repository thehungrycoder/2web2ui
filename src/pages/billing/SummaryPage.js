import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Page } from '@sparkpost/matchbox';
import { fetch as fetchAccount, getPlans } from 'src/actions/account';
import { list as getSendingIps } from 'src/actions/sendingIps';
import { selectBillingInfo } from 'src/selectors/accountBillingInfo';
import ConditionSwitch, { defaultCase } from 'src/components/auth/ConditionSwitch';
import { not } from 'src/helpers/conditions';
import { isSuspendedForBilling, isSelfServeBilling } from 'src/helpers/conditions/account';
import { Loading } from 'src/components';
import { ManuallyBilledBanner } from './components/Banners';
import BillingSummary from './components/BillingSummary';
import SuspendedForBilling from './components/SuspendedForBilling';

export class BillingSummaryPage extends Component {

  componentDidMount () {
    this.props.fetchAccount({ include: 'billing' });
    this.props.getPlans();
    this.props.getSendingIps();
  }

  render () {
    const { loading, account, billingInfo, sendingIps } = this.props;

    if (loading) {
      return <Loading />;
    }

    return (
      <Page title='Billing'>
        <ConditionSwitch>
          <SuspendedForBilling condition={isSuspendedForBilling} account={account} />
          <ManuallyBilledBanner condition={not(isSelfServeBilling)} account={account} />
          <BillingSummary condition={defaultCase} account={account} {...billingInfo} sendingIps={sendingIps} />
        </ConditionSwitch>
      </Page>
    );
  }
}

const mapStateToProps = (state) => ({
  loading: state.account.loading || state.billing.plansLoading || !state.account.subscription,
  account: state.account,
  billingInfo: selectBillingInfo(state),
  sendingIps: state.sendingIps.list
});

export default connect(mapStateToProps, { getSendingIps, getPlans, fetchAccount })(BillingSummaryPage);
