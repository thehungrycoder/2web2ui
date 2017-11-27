const initialState = {
  ticketId: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_TICKET_SUCCESS':
      return { ...state, ticketId: action.payload.results.ticket_id };

    case 'RESET_SUPPORT_FORM':
      return { ...initialState };

    default:
      return state;
  }
};

