import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import { withRouter } from 'react-router-dom';

import { billingCreate, billingUpdate, updateSubscription } from 'src/actions/billing';
import { showAlert } from 'src/actions/globalAlert';
import { changePlanInitialValues } from 'src/selectors/accountBillingForms';
import { currentPlanSelector, shouldExposeCardSelector, isAWSAccountSelector, getPlansSelector, currentSubscriptionSelector } from 'src/selectors/accountBillingInfo';

import { Panel, Grid } from '@sparkpost/matchbox';
import { PlanPicker } from 'src/components';

import PaymentForm from './fields/PaymentForm';
import BillingAddressForm from './fields/BillingAddressForm';
import Confirmation from '../components/Confirmation';
import { CardSummary } from '../components/SummarySection';

const FORMNAME = 'changePlan';

export class ChangePlan extends Component {

  state = {
    useSavedCC: null
  };

  componentWillReceiveProps(nextProps) {
    // Null check to make sure this only runs once
    if (nextProps.shouldExposeCard && this.state.useSavedCC === null) {
      this.setState({ useSavedCC: true });
    }
  }

  handleCardToggle = () => {
    this.setState({ useSavedCC: !this.state.useSavedCC });
  }

  onSubmit = (values) => {
    const { account, updateSubscription, billingCreate, billingUpdate, showAlert, history, isAWSAccount } = this.props;
    // decides which action to be taken based on
    // if it's aws account, it already has billing and if you use a saved CC
    let action;
    if (isAWSAccount) {
      action = updateSubscription(values.planpicker.code, true);
    } else if (account.billing) {
      action = this.state.useSavedCC ? updateSubscription(values.planpicker.code) : billingUpdate(values);
    } else {
      action = billingCreate(values); // creates Zuora account
    }

    return action
      .then(() => history.push('/account/billing'))
      .then(() => showAlert({ type: 'success', message: 'Subscription Updated' }));
  }

  renderCCSection = () => {
    const { billing } = this.props.account;

    if (this.props.selectedPlan && this.props.selectedPlan.isFree) {
      return null; // CC not required on free plans
    }

    if (this.state.useSavedCC) {
      return (
        <Panel title='Pay With Saved Payment Method' actions={[{ content: 'Use Another Credit Card', onClick: this.handleCardToggle }]}>
          <Panel.Section><CardSummary billing={billing} /></Panel.Section>
        </Panel>
      );
    }

    const savedPaymentAction = this.props.shouldExposeCard
      ? [{ content: 'Use Saved Payment Method', onClick: this.handleCardToggle }]
      : null;

    return (
      <Panel title='Add a Credit Card' actions={savedPaymentAction}>
        <Panel.Section>
          <PaymentForm
            formName={FORMNAME}
            disabled={this.props.submitting} />
        </Panel.Section>
        <Panel.Section>
          <BillingAddressForm
            formName={FORMNAME}
            disabled={this.props.submitting}
            countries={this.props.billing.countries} />
        </Panel.Section>
      </Panel>
    );
  }

  render() {
    const { account, submitting, pristine, currentPlan, selectedPlan, plans, isAWSAccount } = this.props;
    const billingEnabled = account.subscription.self_serve || isAWSAccount;

    // Manually billed accounts can submit without changing plan
    const disableSubmit = submitting || (billingEnabled && (pristine || currentPlan.code === selectedPlan.code));

    return (
      <form onSubmit={this.props.handleSubmit(this.onSubmit)}>
        <Grid>
          <Grid.Column>
            <Panel title='Select A Plan'>
              { plans.length &&
                <PlanPicker disabled={this.props.submitting} plans={plans} isAWSAccount={isAWSAccount} />
              }
            </Panel>
            { !isAWSAccount && this.renderCCSection() }
          </Grid.Column>
          <Grid.Column xs={12} md={5}>
            <Confirmation
              current={this.props.currentPlan}
              selected={this.props.selectedPlan}
              billingEnabled={billingEnabled}
              disableSubmit={disableSubmit} />
          </Grid.Column>
        </Grid>
      </form>
    );
  }
}

const mapStateToProps = (state) => {
  const selector = formValueSelector(FORMNAME);
  const subscription = currentSubscriptionSelector(state);

  return {
    account: state.account,
    billing: state.billing,
    shouldExposeCard: shouldExposeCardSelector(state),
    plans: getPlansSelector(subscription)(state),
    currentPlan: currentPlanSelector(state),
    selectedPlan: selector(state, 'planpicker'),
    initialValues: changePlanInitialValues(state),
    isAWSAccount: isAWSAccountSelector(state)
  };
};

const mapDispatchtoProps = { billingCreate, billingUpdate, updateSubscription, showAlert };
const formOptions = { form: FORMNAME, enableReinitialize: true };
export default withRouter(connect(mapStateToProps, mapDispatchtoProps)(reduxForm(formOptions)(ChangePlan)));
