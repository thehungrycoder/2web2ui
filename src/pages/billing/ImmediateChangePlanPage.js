import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import qs from 'query-string';
import { Button } from '@sparkpost/matchbox';
import { ApiErrorBanner, Loading } from 'src/components';
import * as conversions from 'src/helpers/conversionTracking';
import { updateSubscription } from 'src/actions/billing';
import { showAlert } from 'src/actions/globalAlert';
import { stripImmediatePlanChange } from 'src/helpers/billing';

import styles from './ImmediateChangePlanPage.module.scss';

const BILLING_ROUTE = '/account/billing';

export const LOAD_STATE = {
  PENDING: 1,
  SUCCESS: 2,
  FAILURE: 3
};

export class ImmediateChangePlanPage extends Component {
  state = {
    loading: LOAD_STATE.PENDING
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

  handleImmediatePlanChange = () => {
    const { billing, oldCode, immediatePlanChange: newCode, updateSubscription } = this.props;
    this.setState({ loading: LOAD_STATE.PENDING });
    return updateSubscription({ code: newCode })
      .then(() => {
        conversions.trackPlanChange({ allPlans: billing.plans, oldCode, newCode });
        this.setState({ loading: LOAD_STATE.SUCCESS });
      }, (error) => {
        this.setState({ loading: LOAD_STATE.FAILURE, error });
      });
  }

  getLoadState() {
    return Number(this.state.loading);
  }

  renderSuccess() {
    return <div className={styles.MessageInnards}>
      <h1>Your subscription has been updated.</h1>
      <Button to={BILLING_ROUTE} color='orange'>Back to Billing</Button>
    </div>;
  }

  renderError() {
    return <div className={styles.ErrorBanner}>
      <ApiErrorBanner
        errorDetails={this.state.error.message}
        message='Sorry, we had some trouble updating your subscription.'
        reload={this.handleImmediatePlanChange}
      />
    </div>;
  }

  render() {
    const { loading } = this.state;

    if (loading === LOAD_STATE.PENDING) {
      return <Loading />;
    }

    return <div className={styles.MessageBlock}>
      {loading === LOAD_STATE.FAILURE && this.renderError()}
      {loading === LOAD_STATE.SUCCESS && this.renderSuccess()}
    </div>;
  }
}

const mapStateToProps = (state, props) => {
  const { immediatePlanChange } = qs.parse(props.location.search);
  return {
    billing: state.billing,
    oldCode: state.account.subscription.code,
    immediatePlanChange
  };
};

const mapDispatchToProps = {
  updateSubscription,
  showAlert
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ImmediateChangePlanPage));
