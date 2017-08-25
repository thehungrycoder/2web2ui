import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { billingCreate } from '../../actions/zuora';
import { getPlans } from '../../actions/account';

import UpgradeModal from './components/UpgradeModal';
import Layout from '../../components/Layout/Layout';
import { Page, Panel, Grid } from '@sparkpost/matchbox';

class BillingPage extends Component {
  state = {
    showUpgradeModal: false
  }

  togglePlansModal = () => {
    this.setState({ showUpgradeModal: !this.state.showUpgradeModal });
  }

  componentDidMount () {
    // this.props.testAction();
    if (!this.props.billing.plans) {
      this.props.getPlans();
    }
  }

  updatePlan = (values) => {
    const siftData = {
      email: values.email,
      cardholder_name: values.cardName,
      address1: values.address1 || '1403 William St',
      address2: values.address2,
      city: values.city || 'Baltmore',
      state: values.state || 'Maryland',
      country: values.country || 'United States',
      zip_code: values.zipCode || '21230',
      bin: values.number.slice(0, 6),
      last_four: values.number.slice(11, 15),
      plan_id: values.billingId
    };

    this.props.billingCreate(siftData);
  }

  render () {
    const { account, billing } = this.props;

    // TODO: develop pending status for account reducer
    const loading = Object.keys(account).length === 0 || billing.plansLoading;

    const currentCode = !loading ? account.subscription.code : undefined;
    const currentPlan = currentCode ? _.find(billing.plans, { 'code': currentCode }) : {};

    const publicPlans = _.filter(billing.plans, (plan) => {
      return plan.status === 'public';
    });

    const freePlan = currentPlan.name === 'Free';

    const actionText = freePlan ? 'Upgrade Plan' : 'Change Plan';

    const billingPanelActions = [{ content: actionText, onClick: this.togglePlansModal }];

    currentPlan.price = currentPlan.price ? currentPlan.price : '0';
    currentPlan.volume = currentPlan.volume ? currentPlan.volume : 'N/A';
    currentPlan.overage = currentPlan.overage ? currentPlan.overage : 'N/A';

    return (
      <Layout.App loading={loading}>
        <Page title='Billing'/>
        <Panel
          sectioned accent title='Your Plan' actions={billingPanelActions}>
          <Panel.Section >
            <Grid>
              <Grid.Column>
                Price <br/><br/>
                { currentPlan.price.toLocaleString() + ' monthly' }
              </Grid.Column>
              <Grid.Column>
                Emails <br/><br/>
                { currentPlan.volume.toLocaleString()}
              </Grid.Column>
              <Grid.Column>
                Overage* <br/><br/>
                { currentPlan.overage.toLocaleString() }
              </Grid.Column>
            </Grid>
          </Panel.Section>
        </Panel>
        <UpgradeModal
          open={this.state.showUpgradeModal}
          freePlan={freePlan}
          handleToggle={this.togglePlansModal}
          plans={publicPlans}
          currentPlan={currentPlan}
          updatePlan={this.updatePlan}
          currentUser={this.props.currentUser}
        />
      </Layout.App>
    );
  }
}

const mapStateToProps = ({ account, billing, currentUser }) => ({
  account,
  billing,
  currentUser
});

export default connect(mapStateToProps, { getPlans, billingCreate })(BillingPage);
