/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { reduxForm, formValueSelector } from 'redux-form';
import { Layout, PlanPicker } from 'src/components';
import { Page, Panel, Grid, Icon } from '@sparkpost/matchbox';

import PaymentForm from './components/PaymentForm';
import BillingAddressForm from './components/BillingAddressForm';
import BillingContactForm from './components/BillingContactForm';
import Confirmation from './components/Confirmation';
import { SummarySection } from './components/SummarySection';

import { getPlans } from 'src/actions/account';
import { showAlert } from 'src/actions/globalAlert';
import { updateSubscription, billingCreate, getBillingCountries } from 'src/actions/billing';
import { selectPublicPlans, selectCurrentPlan } from 'src/selectors/accountBillingInfo';
import { selectInitialValues } from 'src/selectors/accountChangePlan';

const FORMNAME = 'changePlan';

class ChangePlanPage extends Component {
  state = {
    useSavedCC: false
  };

  componentDidMount() {
    if (!this.props.billing.plans) {
      this.props.getPlans();
    }

    if (!this.props.billing.countries) {
      this.props.getBillingCountries();
    }
  }

  componentWillReceiveProps(props) {
    if (props.currentPlan.isFree || !!props.account.billing) {
      this.setState({ useSavedCC: true });
    }
  }

  updatePlan = (values) => {
    const { updateSubscription, account, billingCreate } = this.props;

    if (!!account.billing) {
      updateSubscription(values.planpicker.code)
        .then(() => showAlert({ type: 'success', message: 'Subscription updated'}));
    } else {
      billingCreate(values)
        .then(() => showAlert({ type: 'success', message: 'Subscription upgraded'}));
    }
  }

  handleCardSelect = () => {
    this.setState({ useSavedCC: !this.state.useSavedCC });
  }

  renderCCSection = () => {
    const { billing } = this.props.account;
    const savedPaymentAction = billing
      ? [{ content: 'Use Saved Payment Method', onClick: this.handleCardSelect }]
      : null;

    if (this.props.selectedPlan && this.props.selectedPlan.isFree) {
      return null;
    }

    if (this.state.useSavedCC) {
      const { credit_card } = billing;
      const action = [{ content: 'Use Another Credit Card', onClick: this.handleCardSelect }];
      return (
        <Panel title='Saved Payment Method' actions={action}>
          <Panel.Section>
            <SummarySection>
              <Icon name='CreditCard' size={16}/>
              <h6>···· { credit_card.number.substr(credit_card.number.length - 4) } { credit_card.type }</h6>
              <h6>{ billing.first_name } { billing.last_name }</h6>
              <div><small>Expires { credit_card.expiration_month }/{ credit_card.expiration_year }</small></div>
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

  render() {
    const { account, plans, loading, handleSubmit, currentPlan, selectedPlan } = this.props;

    return (
      <Layout.App loading={loading}>
        <Page breadcrumbAction={{ content: 'Back to billing', to: '/account/billing', Component: Link }}/>
        <Grid>
          <Grid.Column>
            <Panel title='Select A Plan'>
              <PlanPicker plans={plans} />
            </Panel>

            { this.renderCCSection() }

          </Grid.Column>
          <Grid.Column xs={5}>
            <Confirmation
              current={currentPlan}
              selected={selectedPlan}
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
