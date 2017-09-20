const initialState = { list: [], listError: null };

export default (state = initialState, { type, payload }) => {
  switch (type) {

    case 'LIST_IP_POOLS_PENDING':
      return { ...state, listLoading: true, listError: null };

    case 'LIST_IP_POOLS_SUCCESS':
      return { ...state, list: payload, listLoading: false };

    case 'LIST_IP_POOLS_FAIL':
      return { ...state, listError: payload, listLoading: false };

    default:
      return state;
  }
};
