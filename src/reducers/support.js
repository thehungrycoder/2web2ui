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

    case 'ALGOLIA_SEARCH_PENDING':
      return { ...state, searching: true, algoliaError: null };

    case 'ALGOLIA_SEARCH_SUCCESS':
      return { ...state, algoliaResults: action.payload, searching: false };

    case 'ALGOLIA_SEARCH_ERROR':
      return { ...state, algoliaError: true, searching: false };

    default:
      return state;
  }
};

