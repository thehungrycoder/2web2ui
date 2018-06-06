const initialState = {
  createError: null,
  currentView: 'docs',
  showPanel: false,
  ticketId: null
};

export default (state = initialState, { type, payload = {}}) => {
  switch (type) {
    case 'CLOSE_SUPPORT_PANEL':
      return { ...state, showPanel: false };

    case 'CREATE_TICKET_FAIL':
      return { ...state, createError: payload.message };

    case 'CREATE_TICKET_PENDING':
      return { ...state, createError: null, ticketId: null };

    case 'CREATE_TICKET_SUCCESS':
      return { ...state, ticketId: payload.ticket_id };

    case 'OPEN_SUPPORT_PANEL': {
      return {
        ...state,
        showPanel: true,
        currentView: payload.view || initialState.currentView
      };
    }

    default:
      return state;
  }
};
