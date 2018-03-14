import React from 'react';

export function showAlert(alert) {
  return {
    type: 'SHOW_GLOBAL_ALERT',
    payload: alert
  };
}

// TODO: show different message/details if suspended for billing
export function showSuspensionAlert(overrides = {}) {
  return showAlert({
    type: 'warning',
    message: 'This account is currently suspended',
    details: <span>For more information about account suspension, please email <a href="mailto:compliance@sparkpost.com">compliance@sparkpost.com</a></span>,
    maxWidth: 800,
    dedupeId: 'SUSPENSION_NOTICE',
    ...overrides
  });
}

export function clear(id) {
  return {
    type: 'CLEAR_GLOBAL_ALERT',
    payload: { id }
  };
}
