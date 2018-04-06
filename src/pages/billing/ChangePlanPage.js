import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Page } from '@sparkpost/matchbox';
import { Loading } from 'src/components';
import { PendingPlanBanner } from './components/Banners';
import ChangePlan from './forms/ChangePlan';
import { fetch as fetchAccount, getPlans } from 'src/actions/account';
import { getBillingCountries } from 'src/actions/billing';
import { canChangePlanSelector } from 'src/selectors/accountBillingInfo';

export class ChangePlanPage extends Component {
  componentWillMount() {
    this.props.fetchAccount({ params: { include: 'billing' }});
    this.props.getPlans();
    this.props.getBillingCountries();
  }

  render() {

    if (this.props.loading) {
      return <Loading />;
    }

    return (
      <Page breadcrumbAction={{ content: 'Back to billing', to: '/account/billing', Component: Link }}>
        <PendingPlanBanner account={this.props.account} />
        {this.props.canChangePlan && <ChangePlan />}
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
  fetchAccount,
  getPlans,
  getBillingCountries
};

export default connect(mapStateToProps, mapDispatchtoProps)(ChangePlanPage);
