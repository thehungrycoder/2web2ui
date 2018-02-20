import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Page } from '@sparkpost/matchbox';
import { Loading } from 'src/components';
import { PendingPlanBanner, SuspendedBanner } from './components/Banners';
import ChangePlan from './forms/ChangePlan';

import { getPlans } from 'src/actions/account';
import { getBillingCountries } from 'src/actions/billing';
import { canChangePlanSelector } from 'src/selectors/accountBillingInfo';
import { billingCreate, billingUpdate, updateSubscription } from 'src/actions/billing';
import { showAlert } from 'src/actions/globalAlert';

export class ChangePlanPage extends Component {
  componentWillMount() {
    this.props.getPlans();
    this.props.getBillingCountries();
  }

  onSubmit = (values, useSavedCC) => {
    const { account, updateSubscription, billingCreate, billingUpdate, showAlert, history } = this.props;

    // decides which action to be taken based on
    // if it already has billing and if you use a saved CC
    const action = account.billing
      ? (
        useSavedCC
          ? updateSubscription(values.planpicker.code)
          : billingUpdate(values))
      : billingCreate(values); // creates Zuora account


    return action
      .then(() => history.push('/account/billing'))
      .then(() => showAlert({ type: 'success', message: 'Subscription Updated' }))
      .catch((err) => showAlert({ type: 'error', message: 'Plan Update Failed', details: err.message }));
  }

  render() {

    if (this.props.loading) {
      return <Loading />;
    }

    return (
      <Page breadcrumbAction={{ content: 'Back to billing', to: '/account/billing', Component: Link }}>
        <PendingPlanBanner account={this.props.account} />
        <SuspendedBanner account={this.props.account}/>
        { this.props.canChangePlan && <ChangePlan onSubmit={this.onSubmit} /> }
      </Page>
    );
  }
}

const mapStateToProps = (state) => ({
  loading: Boolean(state.account.loading || state.billing.plansLoading || state.billing.countriesLoading),
  account: state.account,
  canChangePlan: canChangePlanSelector(state)
});

const mapDispatchtoProps = {
  getPlans,
  showAlert,
  getBillingCountries,
  updateSubscription,
  billingUpdate,
  billingCreate
};

export default connect(mapStateToProps, mapDispatchtoProps)(ChangePlanPage);
