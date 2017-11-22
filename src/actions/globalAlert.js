export function showAlert(alert) {
  return {
    type: 'SHOW_GLOBAL_ALERT',
    payload: {
      date: Date.now(),
      ...alert
    }
  };
}

export function clear(index) {
  return {
    type: 'CLEAR_GLOBAL_ALERT',
    payload: index
  };
}
