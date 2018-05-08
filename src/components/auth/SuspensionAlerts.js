import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { showAlert } from 'src/actions/globalAlert';
import { openSupportPanel, hydrateTicketForm } from 'src/actions/support';
import { isSuspendedForBilling } from 'src/helpers/conditions/account';
import { Link } from 'react-router-dom';
import { UnstyledLink } from '@sparkpost/matchbox';

/**
 * Triggers global alerts for:
 * - Account suspended
 * - Account suspended for billing
 */
export class SuspensionAlerts extends Component {

  openTicket = () => {
    this.props.openSupportPanel({ view: 'ticket' });
    this.props.hydrateTicketForm({ issueId: 'account_suspension' });
  }

  getMessage () {
    return this.props.isSuspendedForBilling
      ? (
        <Fragment>
          <div>Your account is currently suspended due to a billing problem.</div>
          <div>To make a payment and reactivate your account, <UnstyledLink component={Link} to='/account/billing'>visit the billing page</UnstyledLink>.</div>
        </Fragment>
      ) : (
        <Fragment>
          <div>Your account is currently suspended.</div>
          <div>For any questions or to request reactivation, please <UnstyledLink onClick={this.openTicket}>submit a ticket</UnstyledLink>.</div>
        </Fragment>
      );
  }

  componentDidUpdate (prevProps) {
    const { status, showAlert } = this.props;

    if (prevProps.status !== 'suspended' && status === 'suspended') {
      showAlert({
        type: 'warning',
        message: this.getMessage(),
        maxWidth: 800,
        autoDismiss: false,
        dedupeId: 'SUSPENSION_NOTICE'
      });
    }
  }

  render () {
    return null;
  }
}

const mapStateToProps = (state) => ({
  status: state.account.status,
  isSuspendedForBilling: isSuspendedForBilling(state)
});
const mapDispatchToProps = { showAlert, openSupportPanel, hydrateTicketForm };
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SuspensionAlerts));
