import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Page } from '@sparkpost/matchbox';
import { Loading } from 'src/components';
import { PendingPlanBanner } from './components/Banners';
import ChangePlanForm from './forms/ChangePlanForm';
import { canChangePlanSelector } from 'src/selectors/accountBillingInfo';

export class ChangePlanPage extends Component {

  render() {
    if (this.props.loading) {
      return <Loading />;
    }

    return (
      <Page breadcrumbAction={{ content: 'Back to billing', to: '/account/billing', Component: Link }}>
        <PendingPlanBanner account={this.props.account} />
        {this.props.canChangePlan && <ChangePlanForm />}
      </Page>
    );
  }
}

const mapStateToProps = (state) => ({
  account: state.account,
  canChangePlan: canChangePlanSelector(state)
});

export default connect(mapStateToProps)(ChangePlanPage);
