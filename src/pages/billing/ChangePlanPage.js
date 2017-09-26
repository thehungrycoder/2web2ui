import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Layout, PlanPicker } from 'src/components';
import { Page, Panel } from '@sparkpost/matchbox';

import { reduxForm } from 'redux-form';
import PaymentForm from './components/PaymentForm';
import BillingAddressForm from './components/BillingAddressForm';
import BillingContactForm from './components/BillingContactForm';
import DedicatedIpsForm from './components/DedicatedIpsForm';

import { getPlans } from 'src/actions/account';
import { fetch as fetchAccount } from 'src/actions/account';
import { list as getIpPools } from 'src/actions/ipPools';
import { getBillingCountries } from 'src/actions/billing';
import { selectPublicPlans, selectCurrentPlan, selectIpPools } from 'src/selectors/accountBillingInfo';

const FORMNAME = 'test';

/**
 * HEY this is just a test page
 */
class ChangePlanPage extends Component {
  componentDidMount() {
    if (!this.props.billing.plans) {
      this.props.getPlans();
    }

    if (!this.props.billing.countries) {
      this.props.getBillingCountries();
    }

    if (!this.props.ipPools.length) {
      this.props.getIpPools();
    }

    if (!this.props.account.add_ons) {
      this.props.fetchAccount({ include: 'add_ons' });
    }
  }

  render() {
    const { account, billing, plans, loading, ipPools } = this.props;

    return (
      <Layout.App loading={loading}>
        <Page title='Billing' breadcrumbAction={{ content: 'Back', to: '/account/billing', Component: Link }}/>
        <Panel>
          <Panel.Section></Panel.Section>
            <PlanPicker
              subscription={account.subscription}
              pendingSubscription={account.pending_subscription}
              plans={plans} />
          <Panel.Section>
            <PaymentForm />
          </Panel.Section>
          <Panel.Section>
            <BillingAddressForm countries={billing.countries} formName={FORMNAME} />
          </Panel.Section>
          <Panel.Section>
            <BillingContactForm countries={billing.countries} formName={FORMNAME} />
          </Panel.Section>
          <Panel.Section>
            <DedicatedIpsForm formName={FORMNAME} ipPools={ipPools} ips={account.add_ons}/>
          </Panel.Section>
        </Panel>
      </Layout.App>
    );
  }
}

const mapStateToProps = (state) => ({
  loading: !Object.keys(state.account).length || state.billing.plansLoading || state.ipPools.listLoading,
  plans: selectPublicPlans(state),
  ipPools: selectIpPools(state),
  billing: state.billing,
  account: state.account,

  // Sets initial form values
  initialValues: {
    planpicker: selectCurrentPlan(state),
    dedicatedIps: {
      quantity: 1,
      whichPool: 'new'
    },
    billingAddress: {
      country: '_placeholder'
    },
    billingContact: {
      country: '_placeholder'
    }
  }
});

const formOptions = { form: FORMNAME, enableReinitialize: true };
export default connect(mapStateToProps, { getPlans, getBillingCountries, getIpPools, fetchAccount })(reduxForm(formOptions)(ChangePlanPage));
