/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { formValueSelector } from 'redux-form';
import { Layout, PlanPicker } from 'src/components';
import { Page, Panel, Grid } from '@sparkpost/matchbox';

import { reduxForm } from 'redux-form';
import PaymentForm from './components/PaymentForm';
import BillingAddressForm from './components/BillingAddressForm';
import BillingContactForm from './components/BillingContactForm';
import Confirmation from './components/Confirmation';

import { getPlans } from 'src/actions/account';
import { showAlert } from 'src/actions/globalAlert';
import { updateSubscription, billingCreate, getBillingCountries } from 'src/actions/billing';
import { selectPublicPlans, selectCurrentPlan } from 'src/selectors/accountBillingInfo';
import { selectInitialValues } from 'src/selectors/accountChangePlan';
const FORMNAME = 'changePlan';

class ChangePlanPage extends Component {
  componentDidMount() {
    if (!this.props.billing.plans) {
      this.props.getPlans();
    }

    if (!this.props.billing.countries) {
      this.props.getBillingCountries();
    }
  }

  updatePlan = (values) => {
    const { updateSubscription, account, billingCreate } = this.props;

    if (account.billing) {
      updateSubscription(values.planpicker.code)
        .then(() => showAlert({ type: 'success', message: 'Subscription updated'}));
    } else {
      billingCreate(values)
        .then(() => showAlert({ type: 'success', message: 'Subscription upgraded'}));
    }
  }

  render() {
    const { account, billing, plans, loading, handleSubmit } = this.props;

    return (
      <Layout.App loading={loading}>
        <Page title='Change your plan' breadcrumbAction={{ content: 'Back to billing', to: '/account/billing', Component: Link }}/>
        <Grid>
          <Grid.Column>
            <Panel>
                <PlanPicker
                  subscription={account.subscription}
                  pendingSubscription={account.pending_subscription}
                  plans={plans} />
              <Panel.Section>
                <PaymentForm formName={FORMNAME} />
              </Panel.Section>
              <Panel.Section>
                <BillingAddressForm countries={billing.countries} formName={FORMNAME} />
              </Panel.Section>
            </Panel>
          </Grid.Column>
          <Grid.Column xs={5}>
            <Confirmation
              current={this.props.currentPlan}
              selected={this.props.selectedPlan}
              onSubmit={handleSubmit((values) => this.updatePlan(values))} />
          </Grid.Column>
        </Grid>
      </Layout.App>
    );
  }
}

const mapStateToProps = (state) => {
  const selector = formValueSelector(FORMNAME);
  return {
    loading: !Object.keys(state.account).length || state.billing.plansLoading,
    plans: selectPublicPlans(state),
    billing: state.billing,
    account: state.account,
    currentPlan: selectCurrentPlan(state),
    selectedPlan: selector(state, 'planpicker'),

    // Sets initial form values
    initialValues: selectInitialValues(state)
  }
};

const formOptions = { form: FORMNAME, enableReinitialize: true };
export default connect(mapStateToProps, { billingCreate, updateSubscription, getPlans, getBillingCountries })(reduxForm(formOptions)(ChangePlanPage));
