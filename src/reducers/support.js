const initialState = {
  ticketId: null,
  showTicketForm: false,
  showPanel: false,
  createError: null
};

export default (state = initialState, { type, payload = {}}) => {
  switch (type) {
    case 'CREATE_TICKET_SUCCESS':
      return { ...state, ticketId: payload.ticket_id };

    case 'CREATE_TICKET_FAIL':
      return { ...state, createError: payload.message };

    case 'RESET_TICKET_FORM':
      return { ...initialState };

    case 'TOGGLE_TICKET_FORM':
      return { ...state, showTicketForm: !state.showTicketForm };

    case 'TOGGLE_SUPPORT_PANEL':
      return { ...state, showPanel: !state.showPanel };

    case 'OPEN_SUPPORT_PANEL': {
      return { ...state, showPanel: true, showTicketForm: payload.view === 'ticket' };
    }

    default:
      return state;
  }
};
