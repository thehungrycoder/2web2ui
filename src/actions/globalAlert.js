export function showAlert({ type = 'default', ...alert }) {
  return {
    type: 'SHOW_GLOBAL_ALERT',
    payload: { type, ...alert }
  };
}

export function clear() {
  return {
    type: 'CLEAR_GLOBAL_ALERT'
  };
}
