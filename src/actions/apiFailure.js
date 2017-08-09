export function received (payload, meta) {
  return {
    type: 'API_FAILURE_RECEIVED',
    payload,
    meta
  };
}

export function clear () {
  return {
    type: 'API_FAILURE_CLEARED'
  };
}
