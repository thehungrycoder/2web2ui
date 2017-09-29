/* eslint-disable max-lines */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { reduxForm, formValueSelector } from 'redux-form';
import { Layout, PlanPicker } from 'src/components';

import { Page, Panel, Grid } from '@sparkpost/matchbox';

import PaymentForm from './components/PaymentForm';
import BillingAddressForm from './components/BillingAddressForm';
import Confirmation from './components/Confirmation';
import { PendingPlanBanner, SuspendedBanner, ManuallyBilledBanner } from './components/Banners';
import { CardSummary } from './components/SummarySection';

import { getPlans } from 'src/actions/account';
import { showAlert } from 'src/actions/globalAlert';
import { updateSubscription, billingCreate, billingUpdate, getBillingCountries } from 'src/actions/billing';

import { selectPublicPlans, selectCurrentPlan } from 'src/selectors/accountBillingInfo';
import { changePlanValues } from 'src/selectors/accountBillingForms';
const FORMNAME = 'changePlan';

// TODO clear state when logging out
class ChangePlanPage extends Component {
  state = {
    useSavedCC: null
  };

  componentDidMount() {
    if (!this.props.billing.plans) {
      this.props.getPlans();
    }

    if (!this.props.billing.countries) {
      this.props.getBillingCountries();
    }
  }

  componentWillReceiveProps(nextProps) {
    // Null check to make sure this only runs once
    if (nextProps.billable && this.state.useSavedCC === null) {
      this.setState({ useSavedCC: true });
    }
  }

  updatePlan = (values) => {
    const { account, updateSubscription, billingCreate, billingUpdate, showAlert, history } = this.props;

    if (account.billing) {
      if (this.state.useSavedCC) {
        // Updates plan
        return updateSubscription(values.planpicker.code)
            .then(() => showAlert({ type: 'success', message: 'Subscription Updated' }))
            .then(() => history.push('/account/billing'))
            .catch((err) => showAlert({ type: 'error', message: 'Plan Update Failed' }));

      } else {
        // Updates plan and payment information
        return billingUpdate(values)
            .then(() => showAlert({ type: 'success', message: 'Subscription Updated' }))
            .then(() => history.push('/account/billing'))
            .catch((err) => showAlert({ type: 'error', message: 'Plan Update Failed' }));
      }
    }

    // Creates Zuora account
    return billingCreate(values)
      .then(() => showAlert({ type: 'success', message: 'Subscription Upgraded' }))
      .then(() => history.push('/account/billing'))
      .catch(() => showAlert({ type: 'error', message: 'Plan Upgrade Failed' }));
  }

  handleCardToggle = () => {
    this.setState({ useSavedCC: !this.state.useSavedCC });
  }

  renderCCSection = () => {
    const { billing } = this.props.account;

    if (this.props.selectedPlan && this.props.selectedPlan.isFree) {
      return null; // CC not required on free plans
    }

    if (this.state.useSavedCC) {
      return (
        <Panel title='Saved Payment Method' actions={[{ content: 'Use Another Credit Card', onClick: () => this.handleCardToggle() }]}>
          <Panel.Section><CardSummary billing={billing} /></Panel.Section>
        </Panel>
      );
    }

    const savedPaymentAction = this.props.billable
      ? [{ content: 'Use Saved Payment Method', onClick: () => this.handleCardToggle() }]
      : null;

    return (
      <Panel title='Add Credit Card' actions={savedPaymentAction}>
        <Panel.Section><PaymentForm formName={FORMNAME} /></Panel.Section>
        <Panel.Section><BillingAddressForm countries={this.props.billing.countries} formName={FORMNAME} /></Panel.Section>
      </Panel>
    );
  }

  renderForm = () => {
    const { account, plans, handleSubmit, currentPlan, selectedPlan } = this.props;
    const { subscription, isSuspendedForBilling, pending_subscription } = account;

    if ((subscription && !subscription.self_serve) || isSuspendedForBilling || pending_subscription) {
      return null;
    }

    return (
      <form onSubmit={handleSubmit((values) => this.updatePlan(values))}>
        <Grid>
          <Grid.Column>
            <Panel title='Select A Plan'><PlanPicker plans={plans} /></Panel>
            { this.renderCCSection() }
          </Grid.Column>
          <Grid.Column xs={12} md={5}>
            <Confirmation
              current={currentPlan}
              selected={selectedPlan}
              disableSubmit={this.props.submitting || this.props.pristine} />
          </Grid.Column>
        </Grid>
      </form>
    );
  };

  render() {
    return (
      <Layout.App loading={this.props.loading}>
        <Page breadcrumbAction={{ content: 'Back to billing', to: '/account/billing', Component: Link }}/>
        <PendingPlanBanner account={this.props.account} />
        <SuspendedBanner account={this.props.account}/>
        <ManuallyBilledBanner account={this.props.account}/>
        { this.renderForm() }
      </Layout.App>
    );
  }
}

const mapStateToProps = (state) => {
  const selector = formValueSelector(FORMNAME);
  const currentPlan = selectCurrentPlan(state);
  return {
    loading: !Object.keys(state.account).length || state.billing.plansLoading || !state.billing.countries,
    billable: !!state.account.billing && !currentPlan.isFree,
    plans: selectPublicPlans(state),
    billing: state.billing,
    account: state.account,
    currentPlan,
    selectedPlan: selector(state, 'planpicker'),
    initialValues: changePlanValues(state)
  };
};

const mapDispatchtoProps = { billingCreate, billingUpdate, updateSubscription, getPlans, getBillingCountries, showAlert };
const formOptions = { form: FORMNAME, enableReinitialize: true };
export default withRouter(connect(mapStateToProps, mapDispatchtoProps)(reduxForm(formOptions)(ChangePlanPage)));
