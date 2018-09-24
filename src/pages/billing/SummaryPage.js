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
import BillingSummary from './components/BillingSummary';
import ManuallyBilledBanner from './components/ManuallyBilledBanner';
import SuspendedForBilling from './components/SuspendedForBilling';
import { list as getInvoices } from 'src/actions/invoices';

export class BillingSummaryPage extends Component {

  componentDidMount() {
    this.props.fetchAccount({ include: 'billing' });
    this.props.getPlans();
    this.props.getSendingIps();
    this.props.getInvoices();
  }

  render() {
    const { loading, account, billingInfo, sendingIps, invoices } = this.props;

    if (loading) {
      return <Loading />;
    }

    return (
      <Page title='Billing'>
        <ConditionSwitch>
          <SuspendedForBilling condition={isSuspendedForBilling} account={account} />
          <ManuallyBilledBanner condition={not(isSelfServeBilling)} account={account} />
          <BillingSummary condition={defaultCase} account={account} {...billingInfo} invoices={invoices} sendingIps={sendingIps} />
        </ConditionSwitch>
      </Page>
    );
  }
}

const mapStateToProps = (state) => ({
  loading: state.account.loading || state.billing.plansLoading || !state.account.subscription,
  account: state.account,
  billingInfo: selectBillingInfo(state),
  sendingIps: state.sendingIps.list,
  invoices: state.invoices.list
});

export default connect(mapStateToProps, { getInvoices, getSendingIps, getPlans, fetchAccount })(BillingSummaryPage);
