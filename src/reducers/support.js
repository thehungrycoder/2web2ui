const initialState = {
  ticketId: null,
  showTicketForm: false,
  showPanel: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_TICKET_SUCCESS':
      return { ...state, ticketId: action.payload.ticket_id };

    case 'RESET_TICKET_FORM':
      return { ...initialState };

    case 'TOGGLE_TICKET_FORM':
      return { ...state, showTicketForm: !state.showTicketForm };

    case 'TOGGLE_SUPPORT_PANEL':
      return { ...state, showPanel: !state.showPanel };

    default:
      return state;
  }
};
