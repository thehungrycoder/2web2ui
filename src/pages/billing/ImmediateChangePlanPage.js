import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Page, Grid, UnstyledLink } from '@sparkpost/matchbox';
import { connect } from 'react-redux';
import qs from 'query-string';
import * as conversions from 'src/helpers/conversionTracking';
import { updateSubscription } from 'src/actions/billing';
import { showAlert } from 'src/actions/globalAlert';
import { stripImmediatePlanChange } from 'src/helpers/billing';

const BILLING_ROUTE = '/account/billing';

export class ImmediateChangePlanPage extends Component {
  state = {
    loading: true
  }

  componentDidMount() {
    const { immediatePlanChange } = this.props;

    if (!immediatePlanChange) {
      this.redirectToBilling();
    } else {
      return this.handleImmediatePlanChange();
    }
  }

  redirectToBilling() {
    const { history, location } = this.props;
    history.push({
      pathname: BILLING_ROUTE,
      search: stripImmediatePlanChange(location.search)
    });
  }

  handleImmediatePlanChange() {
    const { billing, oldCode, immediatePlanChange: newCode, updateSubscription, showAlert } = this.props;
    return updateSubscription({ code: newCode })
      .then(() => {
        conversions.trackPlanChange({ allPlans: billing.plans, oldCode, newCode });
        this.setState({ loading: false });
        showAlert({ type: 'success', message: 'Subscription Updated' });
      });
  }

  render() {
    const { loading } = this.state;
    return <Page breadcrumbAction={{ content: 'Back to billing', to: '/account/billing', Component: Link }}>
      <h1>Updating Your Subscription</h1>
      <Grid center="xs">
        <Grid.Column xsOffset={3} xs={6}>
          <h4>
            {
              loading
                ? 'Just a moment...'
                : 'All done! Your subscription has been updated.'
            }
          </h4>
        </Grid.Column>
        {
          loading
            ? null
            : <Grid.Column xsOffset={3} xs={6}><UnstyledLink to={BILLING_ROUTE}>Back to billing</UnstyledLink></Grid.Column>
        }
      </Grid>
    </Page>;
  }
}

const mapStateToProps = (state, props) => {
  const { code: oldCode, immediatePlanChange } = qs.parse(props.location.search);
  return {
    billing: state.billing,
    oldCode,
    immediatePlanChange
  };
};

const mapDispatchToProps = {
  updateSubscription,
  showAlert
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ImmediateChangePlanPage));
