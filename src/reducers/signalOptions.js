const initialState = {
  // facet: 'sending_domain',
  // facetSearchTerm: '',
  relativeRange: '90days'
  // subaccount
};

const signalOptionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CHANGE_SIGNAL_OPTIONS':
      return { ...state, ...action.payload };
  }

  return state;
};

export default signalOptionsReducer;
