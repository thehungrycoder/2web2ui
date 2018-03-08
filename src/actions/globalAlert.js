export function showAlert(alert) {
  return {
    type: 'SHOW_GLOBAL_ALERT',
    payload: alert
  };
}

export function showSuspensionAlert(overrides = {}) {
  return showAlert({
    type: 'warning',
    message: 'This account is currently suspended',
    details: 'For more information about account suspension, please email compliance@sparkpost.com',
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
