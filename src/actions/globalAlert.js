export function showAlert(alert) {
  return {
    type: 'SHOW_GLOBAL_ALERT',
    payload: alert
  };
}

export function clear() {
  return {
    type: 'CLEAR_GLOBAL_ALERT'
  };
}
