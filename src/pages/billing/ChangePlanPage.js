/* eslint-disable max-lines */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { reduxForm, formValueSelector } from 'redux-form';
import { Layout, PlanPicker } from 'src/components';
import { format } from 'date-fns';
import { Page, Panel, Grid, Icon, Banner } from '@sparkpost/matchbox';

import PaymentForm from './components/PaymentForm';
import BillingAddressForm from './components/BillingAddressForm';
import Confirmation from './components/Confirmation';
import { SummarySection } from './components/SummarySection';

import config from 'src/config';
import { getPlans } from 'src/actions/account';
import { showAlert } from 'src/actions/globalAlert';
import { updateSubscription, billingCreate, billingUpdate, getBillingCountries } from 'src/actions/billing';
import { selectPublicPlans, selectCurrentPlan } from 'src/selectors/accountBillingInfo';
import { selectInitialValues } from 'src/selectors/accountChangePlan';

const FORMNAME = 'changePlan';

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
      return null;
    }

    const savedPaymentAction = this.props.billable
      ? [{ content: 'Use Saved Payment Method', onClick: () => this.handleCardToggle() }]
      : null;

    if (this.state.useSavedCC) {
      const { credit_card } = billing;
      const action = [{ content: 'Use Another Credit Card', onClick: () => this.handleCardToggle() }];
      return (
        <Panel title='Saved Payment Method' actions={action}>
          <Panel.Section>
            <SummarySection>
              <h6><Icon name='CreditCard' size={16}/> { credit_card.type } ···· { credit_card.number.substr(credit_card.number.length - 4) }</h6>
              <h6>{ billing.first_name } { billing.last_name }</h6>
              <p><small>Expires { credit_card.expiration_month }/{ credit_card.expiration_year }</small></p>
            </SummarySection>
          </Panel.Section>
        </Panel>
      );
    }

    return (
      <Panel title='Add Credit Card' actions={savedPaymentAction}>
        <Panel.Section><PaymentForm formName={FORMNAME} /></Panel.Section>
        <Panel.Section><BillingAddressForm countries={this.props.billing.countries} formName={FORMNAME} /></Panel.Section>
      </Panel>
    );
  }

  renderPendingBanner = () => {
    const { pending_subscription } = this.props.account;
    return pending_subscription
      ? <Banner status='danger' title='Pending Plan Change' >
          <p>You're scheduled to switch to the { pending_subscription.name } plan on {format(pending_subscription.effective_date, 'MMM DD, YYYY')}, and can't update your plan until that switch happens.</p>
          <p>If you have any questions, please <a href={`mailto:${config.contact.supportEmail}`}>contact support</a>.</p>
        </Banner>
      : null;
  }

  render() {
    const { plans, loading, handleSubmit, currentPlan, selectedPlan } = this.props;

    return (
      <Layout.App loading={loading}>
        <Page breadcrumbAction={{ content: 'Back to billing', to: '/account/billing', Component: Link }}/>
        { this.renderPendingBanner() }
        <form onSubmit={handleSubmit((values) => this.updatePlan(values))}>
          <Grid>
            <Grid.Column>
              <Panel title='Select A Plan'>
                <PlanPicker plans={plans} />
              </Panel>
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
      </Layout.App>
    );
  }
}

const mapStateToProps = (state) => {
  const selector = formValueSelector(FORMNAME);
  const currentPlan = selectCurrentPlan(state);
  return {
    loading: !Object.keys(state.account).length || state.billing.plansLoading,
    billable: !!state.account.billing && !currentPlan.isFree,
    plans: selectPublicPlans(state),
    billing: state.billing,
    account: state.account,
    currentPlan,
    selectedPlan: selector(state, 'planpicker'),
    initialValues: selectInitialValues(state)
  };
};

const mapDispatchtoProps = { billingCreate, billingUpdate, updateSubscription, getPlans, getBillingCountries, showAlert };
const formOptions = { form: FORMNAME, enableReinitialize: true };
export default withRouter(connect(mapStateToProps, mapDispatchtoProps)(reduxForm(formOptions)(ChangePlanPage)));
