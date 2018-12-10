const initialState = {
  // facet: 'sending_domain',
  // facetSearchTerm: '',
  relativeRange: '14days'
  // subaccountId: 123
};

const signalOptionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CHANGE_SIGNAL_OPTIONS':
      return { ...state, ...action.payload };
  }

  return state;
};

export default signalOptionsReducer;
