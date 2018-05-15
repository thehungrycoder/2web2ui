import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import { withRouter } from 'react-router-dom';
import qs from 'query-string';

import { updateSubscription } from 'src/actions/billing';
import billingCreate from 'src/actions/billingCreate';
import billingUpdate from 'src/actions/billingUpdate';
import { showAlert } from 'src/actions/globalAlert';
import { changePlanInitialValues } from 'src/selectors/accountBillingForms';
import {
  currentPlanSelector, canUpdateBillingInfoSelector, selectVisiblePlans
} from 'src/selectors/accountBillingInfo';
import { Panel, Grid } from '@sparkpost/matchbox';
import { PlanPicker } from 'src/components';
import PaymentForm from './fields/PaymentForm';
import BillingAddressForm from './fields/BillingAddressForm';
import Confirmation from '../components/Confirmation';
import CardSummary from '../components/CardSummary';
import { isAws, isSelfServeBilling } from 'src/helpers/conditions/account';
import { not } from 'src/helpers/conditions';
import * as conversions from 'src/helpers/conversionTracking';
import AccessControl from 'src/components/auth/AccessControl';
import { prepareCardInfo } from 'src/helpers/billing';


const FORMNAME = 'changePlan';

export class ChangePlan extends Component {

  state = {
    useSavedCC: null
  };

  componentWillReceiveProps (nextProps) {
    // Null check to make sure this only runs once
    if (nextProps.canUpdateBillingInfo && this.state.useSavedCC === null) {
      this.setState({ useSavedCC: true });
    }
  }

  handleCardToggle = () => {
    this.setState({ useSavedCC: !this.state.useSavedCC });
  };

  onSubmit = (values) => {
    const { account, billing, updateSubscription, billingCreate, billingUpdate, showAlert, history } = this.props;
    const oldCode = account.subscription.code;
    const newCode = values.planpicker.code;

    const newValues = {
      ...values,
      card: prepareCardInfo(values.card)
    };

    // decides which action to be taken based on
    // if it's aws account, it already has billing and if you use a saved CC
    let action;
    if (isAws({ account })) {
      action = updateSubscription({ code: newCode });
    } else if (account.billing) {
      action = this.state.useSavedCC ? updateSubscription({ code: newCode }) : billingUpdate(newValues);
    } else {
      action = billingCreate(newValues); // creates Zuora account
    }

    return action
      .then(() => history.push('/account/billing'))
      .then(() => {
        conversions.trackPlanChange({ allPlans: billing.plans, oldCode, newCode });
        return showAlert({ type: 'success', message: 'Subscription Updated' });
      });
  };

  renderCCSection = () => {
    const { account, selectedPlan } = this.props;

    if (selectedPlan.isFree) {
      return null; // CC not required on free plans
    }

    if (this.state.useSavedCC) {
      return (
        <Panel title='Pay With Saved Payment Method' actions={[{ content: 'Use Another Credit Card', onClick: this.handleCardToggle, color: 'orange' }]}>
          <Panel.Section><CardSummary billing={account.billing} /></Panel.Section>
        </Panel>
      );
    }

    const savedPaymentAction = this.props.canUpdateBillingInfo
      ? [{ content: 'Use Saved Payment Method', onClick: this.handleCardToggle, color: 'orange' }]
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

  render () {
    const { submitting, currentPlan, selectedPlan, plans, isSelfServeBilling } = this.props;

    // Manually billed accounts can submit without changing plan
    const disableSubmit = submitting ||
      (isSelfServeBilling && currentPlan.code === selectedPlan.code) ||
      // do not allow private, deprecated, etc. plans to enable billing
      (selectedPlan.status !== 'public' && selectedPlan.status !== 'secret');

    return (
      <form onSubmit={this.props.handleSubmit(this.onSubmit)}>
        <Grid>
          <Grid.Column>
            <Panel title='Select A Plan'>
              {plans.length &&
                <PlanPicker disabled={submitting} plans={plans} />
              }
            </Panel>
            <AccessControl condition={not(isAws)}>
              {this.renderCCSection()}
            </AccessControl>
          </Grid.Column>
          <Grid.Column xs={12} md={5}>
            <Confirmation
              current={currentPlan}
              selected={selectedPlan}
              billingEnabled={isSelfServeBilling}
              disableSubmit={disableSubmit} />
          </Grid.Column>
        </Grid>
      </form>
    );
  }
}

const mapStateToProps = (state, props) => {
  const selector = formValueSelector(FORMNAME);
  const { code: planCode } = qs.parse(props.location.search);

  return {
    account: state.account,
    billing: state.billing,
    canUpdateBillingInfo: canUpdateBillingInfoSelector(state),
    isSelfServeBilling: isSelfServeBilling(state),
    plans: selectVisiblePlans(state),
    currentPlan: currentPlanSelector(state),
    selectedPlan: selector(state, 'planpicker') || {},
    initialValues: changePlanInitialValues(state, { planCode })
  };
};

const mapDispatchtoProps = { billingCreate, billingUpdate, updateSubscription, showAlert };
const formOptions = { form: FORMNAME, enableReinitialize: true };
export default withRouter(connect(mapStateToProps, mapDispatchtoProps)(reduxForm(formOptions)(ChangePlan)));
