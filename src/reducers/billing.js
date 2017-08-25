const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'TEST_PENDING':
      return { ...state, testPending: true };

    case 'TEST_SUCCESS':
      return { ...state, testResponse: action.payload, testPending: false };

    case 'TEST_FAIL':
      return { ...state, testPending: false };

    case 'GET_PLANS_PENDING':
      return { ...state, plansLoading: true };

    case 'GET_PLANS_SUCCESS':
      return { ...state, plans: action.payload, plansLoading: false };

    default:
      return state;
  }
};
