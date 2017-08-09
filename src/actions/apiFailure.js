export function received (payload, meta) {
  return {
    type: 'API_FAILURE_RECEIVED',
    payload,
    meta
  };
}

export function dismiss () {
  return {
    type: 'API_FAILURE_DISMISS'
  };
}
