import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout, PlanPicker } from 'components';
import { Page, Panel } from '@sparkpost/matchbox';

import { reduxForm } from 'redux-form';
import PaymentForm from './components/PaymentForm';
import BillingAddressForm from './components/BillingAddressForm';
import BillingContactForm from './components/BillingContactForm';
import DedicatedIpsForm from './components/DedicatedIpsForm';

import { getPlans } from 'actions/account';
import { getBillingCountries } from 'actions/billing';
import _ from 'lodash';

const FORMNAME = 'test';

/**
 * HEY this is just a test page
 */
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
            <PlanPicker subscription={account.subscription} pendingSubscription={account.pending_subscription} plans={plans} />
          <Panel.Section>
            <PaymentForm />
          </Panel.Section>
          <Panel.Section>
            <BillingAddressForm countries={this.props.billing.countries} formName={FORMNAME} />
          </Panel.Section>
          <Panel.Section>
            <BillingContactForm countries={this.props.billing.countries} formName={FORMNAME} />
          </Panel.Section>
          <Panel.Section>
            <DedicatedIpsForm formName={FORMNAME} />
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
