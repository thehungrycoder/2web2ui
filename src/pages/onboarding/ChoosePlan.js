import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Panel } from '@sparkpost/matchbox';
import { CenteredLogo, Loading } from 'src/components';
import ChangePlanForm from 'src/pages/billing/forms/ChangePlan';
import Steps from './components/Steps';
import { getPlans } from 'src/actions/account';
import { getBillingCountries } from 'src/actions/billing';

export class OnboardingPlanPage extends Component {
  componentDidMount() {
    this.props.getPlans();
    this.props.getBillingCountries();
  }

  render() {
    const { loading } = this.props;

    if (loading) {
      return <Loading />;
    }

    return (
      <Fragment>
        <CenteredLogo />
        <Panel accent>
          <ChangePlanForm onboarding={true} />
          <Steps />
        </Panel>
      </Fragment>
    );
  }
}


const mapStateToProps = (state) => ({
  loading: Boolean(state.account.loading || state.billing.plansLoading || state.billing.countriesLoading)
});

export default connect(mapStateToProps, { getPlans, getBillingCountries })(OnboardingPlanPage);
