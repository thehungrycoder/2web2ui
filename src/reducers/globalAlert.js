const initialState = {
  alerts: []
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'SHOW_GLOBAL_ALERT':
      return { ...state, alerts: [ ...state.alerts, payload ]};

    case 'CLEAR_GLOBAL_ALERT':
      return {
        ...state,
        alerts: [
          ...state.alerts.slice(0, payload),
          ...state.alerts.slice(payload + 1)
        ]
      };

    default:
      return state;
  }
};
