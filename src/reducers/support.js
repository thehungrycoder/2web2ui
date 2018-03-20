const initialState = {
  ticketId: null,
  algoliaResults: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_TICKET_SUCCESS':
      return { ...state, ticketId: action.payload.ticket_id };

    case 'RESET_SUPPORT_FORM':
      return { ...state, ticketId: null };

    default:
      return state;
  }
};

