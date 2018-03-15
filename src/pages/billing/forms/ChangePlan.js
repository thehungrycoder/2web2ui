import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import { withRouter } from 'react-router-dom';
import { billingCreate, billingUpdate, updateSubscription } from 'src/actions/billing';
import { showAlert } from 'src/actions/globalAlert';
import { changePlanInitialValues } from 'src/selectors/accountBillingForms';
import { publicPlansSelector, currentPlanSelector, canUpdateBillingInfoSelector } from 'src/selectors/accountBillingInfo';
import { Panel, Grid } from '@sparkpost/matchbox';
import { PlanPicker } from 'src/components';
import PaymentForm from './fields/PaymentForm';
import BillingAddressForm from './fields/BillingAddressForm';
import Confirmation from '../components/Confirmation';
import CardSummary from '../components/CardSummary';
import { isAws } from 'src/helpers/conditions/account';

const FORMNAME = 'changePlan';

export class ChangePlan extends Component {

  state = {
    useSavedCC: null
  };

  componentWillReceiveProps(nextProps) {
    // Null check to make sure this only runs once
    if (nextProps.canUpdateBillingInfo && this.state.useSavedCC === null) {
      this.setState({ useSavedCC: true });
    }
  }

  handleCardToggle = () => {
    this.setState({ useSavedCC: !this.state.useSavedCC });
  }

  onSubmit = (values) => {
    const { account, updateSubscription, billingCreate, billingUpdate, showAlert, history } = this.props;
    // decides which action to be taken based on
    // if it's aws account, it already has billing and if you use a saved CC
    let action;
    if (isAws({ account })) {
      action = updateSubscription({ code: values.planpicker.code, aws: true });
    } else if (account.billing) {
      action = this.state.useSavedCC ? updateSubscription({ code: values.planpicker.code }) : billingUpdate(values);
    } else {
      action = billingCreate(values); // creates Zuora account
    }

    return action
      .then(() => history.push('/account/billing'))
      .then(() => showAlert({ type: 'success', message: 'Subscription Updated' }));
  }

  renderCCSection = () => {
    const { account } = this.props;

    if (this.props.selectedPlan && this.props.selectedPlan.isFree) {
      return null; // CC not required on free plans
    }

    if (this.state.useSavedCC) {
      return (
        <Panel title='Pay With Saved Payment Method' actions={[{ content: 'Use Another Credit Card', onClick: this.handleCardToggle }]}>
          <Panel.Section><CardSummary billing={account.billing} /></Panel.Section>
        </Panel>
      );
    }

    const savedPaymentAction = this.props.canUpdateBillingInfo
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

    const { account, submitting, pristine, currentPlan, selectedPlan, plans } = this.props;
    const isAwsAccount = isAws({ account });
    const billingEnabled = account.subscription.self_serve || isAwsAccount;

    // Manually billed accounts can submit without changing plan
    const disableSubmit = submitting || (billingEnabled && (pristine || currentPlan.code === selectedPlan.code));

    return (
      <form onSubmit={this.props.handleSubmit(this.onSubmit)}>
        <Grid>
          <Grid.Column>
            <Panel title='Select A Plan'>
              { plans.length &&
                <PlanPicker disabled={submitting} plans={plans} />
              }
            </Panel>
            {!isAwsAccount && this.renderCCSection()}
          </Grid.Column>
          <Grid.Column xs={12} md={5}>
            <Confirmation
              current={currentPlan}
              selected={selectedPlan}
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
  return {
    account: state.account,
    billing: state.billing,
    canUpdateBillingInfo: canUpdateBillingInfoSelector(state),
    plans: publicPlansSelector(state),
    currentPlan: currentPlanSelector(state),
    selectedPlan: selector(state, 'planpicker'),
    initialValues: changePlanInitialValues(state)
  };
};

const mapDispatchtoProps = { billingCreate, billingUpdate, updateSubscription, showAlert };
const formOptions = { form: FORMNAME, enableReinitialize: true };
export default withRouter(connect(mapStateToProps, mapDispatchtoProps)(reduxForm(formOptions)(ChangePlan)));
