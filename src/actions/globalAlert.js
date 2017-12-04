import _ from 'lodash';

export function showAlert(alert) {
  return {
    type: 'SHOW_GLOBAL_ALERT',
    payload: {
      id: _.uniqueId('alert_'),
      ...alert
    }
  };
}

export function clear(id) {
  return {
    type: 'CLEAR_GLOBAL_ALERT',
    payload: { id }
  };
}
