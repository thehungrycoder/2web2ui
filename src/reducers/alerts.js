const initialState = {
  list: [],
  listPending: true,
  listError: null,
  createPending: false,
  updatePending: false,
  deletePending: false
};

export default (state = initialState, { type, payload, meta }) => {
  switch (type) {
    /* LIST */

    case 'LIST_ALERTS_PENDING':
      return { ...state, listPending: true, listError: null };

    case 'LIST_ALERTS_FAIL':
      return { ...state, listError: payload, listPending: false };

    case 'LIST_ALERTS_SUCCESS':
      return { ...state, list: payload, listPending: false };

      /* CREATE */

    case 'CREATE_ALERT_PENDING':
      return { ...state, createPending: true };

    case 'CREATE_ALERT_SUCCESS':
    case 'CREATE_ALERT_FAIL':
      return { ...state, createPending: false };

      /* UPDATE */

    case 'UPDATE_ALERT_PENDING':
      return { ...state, updatePending: true };

    case 'UPDATE_ALERT_SUCCESS':
    case 'UPDATE_ALERT_FAIL':
      return { ...state, updatePending: false };

      /* DELETE */

    case 'DELETE_ALERT_PENDING':
      return { ...state, deletePending: true };

    case 'DELETE_ALERT_SUCCESS':
    case 'DELETE_ALERT_FAIL':
      return { ...state, deletePending: false };

    default:
      return state;
  }
};
