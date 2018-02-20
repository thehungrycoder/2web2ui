import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Panel } from '@sparkpost/matchbox';
import { showAlert } from 'src/actions/globalAlert';
import { CenteredLogo, Loading } from 'src/components';
import ChangePlanForm from 'src/pages/billing/forms/ChangePlan';
import Steps from './components/Steps';
import { getPlans } from 'src/actions/account';
import { getBillingCountries, billingCreate } from 'src/actions/billing';

export class OnboardingPlanPage extends Component {
  componentDidMount() {
    this.props.getPlans();
    this.props.getBillingCountries();
  }

  onSubmit = (values) => {
    const { billingCreate, showAlert, history } = this.props;
    const uri = '/onboarding/sending-domain';

    // no billing updates needed since they are still on free plan
    if (values.planpicker.isFree) {
      history.push(uri);
      return;
    }

    return billingCreate(values)
      .then(() => history.push(uri))
      .then(() => showAlert({ type: 'success', message: 'Added plan' }))
      .catch((err) => showAlert({ type: 'error', message: 'Adding plan failed', details: err.message }));

  };

  render() {
    const { loading } = this.props;

    if (loading) {
      return <Loading />;
    }

    return (
      <Fragment>
        <CenteredLogo />
        <Panel accent>
          <ChangePlanForm onSubmit={this.onSubmit} onboarding={true} />
          <Steps />
        </Panel>
      </Fragment>
    );
  }
}


const mapStateToProps = (state) => ({
  loading: Boolean(state.account.loading || state.billing.plansLoading || state.billing.countriesLoading)
});

export default connect(mapStateToProps, { billingCreate, showAlert, getPlans, getBillingCountries })(OnboardingPlanPage);
