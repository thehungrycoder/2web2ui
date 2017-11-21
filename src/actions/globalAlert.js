export function showAlert({ type = 'default', ...alert }) {
  return {
    type: 'SHOW_GLOBAL_ALERT',
    payload: {
      type,
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
