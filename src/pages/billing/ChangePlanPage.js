import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Page } from '@sparkpost/matchbox';

import { PendingPlanBanner, SuspendedBanner } from './components/Banners';
import ChangePlan from './forms/ChangePlan';

import { getPlans } from 'src/actions/account';
import { getBillingCountries } from 'src/actions/billing';
import { canChangePlanSelector } from 'src/selectors/accountBillingInfo';

export class ChangePlanPage extends Component {
  componentWillMount() {
    this.props.getPlans();
    this.props.getBillingCountries();
  }

  render() {
    return (
      <div loading={this.props.loading}>
        <Page breadcrumbAction={{ content: 'Back to billing', to: '/account/billing', Component: Link }}/>
        <PendingPlanBanner account={this.props.account} />
        <SuspendedBanner account={this.props.account}/>
        { this.props.canChangePlan && <ChangePlan /> }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loading: state.account.loading || state.billing.plansLoading || state.billing.countriesLoading,
  account: state.account,
  canChangePlan: canChangePlanSelector(state)
});

const mapDispatchtoProps = {
  getPlans,
  getBillingCountries
};

export default connect(mapStateToProps, mapDispatchtoProps)(ChangePlanPage);
