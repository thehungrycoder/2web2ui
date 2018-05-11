import React from 'react';
import { isSuspendedForBilling } from 'src/helpers/conditions/account';
import { Link } from 'react-router-dom';

export function showAlert(alert) {
  return {
    type: 'SHOW_GLOBAL_ALERT',
    payload: alert
  };
}

// TODO: show different message/details if suspended for billing
export function showSuspensionAlert(overrides = {}) {
  return (dispatch, getState) => {
    const accountIsSuspendedForBilling = isSuspendedForBilling(getState());
    const details = accountIsSuspendedForBilling
      ? <span>To make a payment and reactivate your account, <Link to='/account/billing'>visit the billing page</Link>.</span>
      : <span>For more information about account suspension, please email <a href="mailto:compliance@sparkpost.com">compliance@sparkpost.com</a></span>;
    const message = accountIsSuspendedForBilling
      ? 'This account is currently suspended for billing'
      : 'This account is currently suspended';

    return dispatch(showAlert({
      type: 'warning',
      message,
      details,
      maxWidth: 800,
      dedupeId: 'SUSPENSION_NOTICE',
      ...overrides
    }));
  };
}

export function clear(id) {
  return {
    type: 'CLEAR_GLOBAL_ALERT',
    payload: { id }
  };
}
