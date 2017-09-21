/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout, PlanPickerWrapper } from 'components';
import { Page, Panel } from '@sparkpost/matchbox';

import { Field, reduxForm } from 'redux-form';
import PaymentForm from './components/PaymentForm';
import BillingAddressForm from './components/BillingAddressForm';
import BillingContactForm from './components/BillingContactForm';

import { getPlans } from 'actions/account';
import { getBillingCountries } from 'actions/billing';
import _ from 'lodash';

const FORMNAME = 'test';

class BillingPage extends Component {
  componentDidMount() {
    if (!this.props.billing.plans) {
      this.props.getPlans();
    }

    if (!this.props.billing.countries) {
      this.props.getBillingCountries();
    }
  }

  render() {
    const { billing, account, plans } = this.props;

    if (!billing.plans || Object.keys(account).length === 0) {
      return null;
    }

    return (
      <Layout.App>
        <Page title='Billing'/>
        <Panel>
          <Panel.Section></Panel.Section>
          <Field component={PlanPickerWrapper} name='planpicker' plans={plans}/>
          <Panel.Section>
            <PaymentForm />
          </Panel.Section>
          <Panel.Section>
            <BillingAddressForm countries={this.props.billing.countries} formName={FORMNAME} />
          </Panel.Section>
          <Panel.Section>
            <BillingContactForm countries={this.props.billing.countries} formName={FORMNAME} />
          </Panel.Section>
        </Panel>
      </Layout.App>
    );
  }
}

const mapStateToProps = ({ account, billing }) => {
  const publicPlans = billing.plans
    ? _.sortBy(billing.plans.filter((plan) => plan.status === 'public'), (plan) => plan.volume)
    : [];

  const initialPlan = billing.plans && Object.keys(account).length
    ? _.find(billing.plans, { code: account.subscription.code })
    : {};

  return {
    account,
    billing,
    plans: publicPlans,
    initialValues: {
      planpicker: initialPlan
    }
  };
};

const formOptions = {
  form: FORMNAME,
  enableReinitialize: true
};
export default connect(mapStateToProps, { getPlans, getBillingCountries })(reduxForm(formOptions)(BillingPage));
