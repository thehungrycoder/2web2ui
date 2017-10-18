const initialState = { list: [], listError: null };

export default (state = initialState, { type, payload }) => {
  switch (type) {

    //list pools
    case 'LIST_IP_POOLS_PENDING':
      return { ...state, listLoading: true, listError: null };

    case 'LIST_IP_POOLS_SUCCESS':
      return { ...state, list: payload, listLoading: false };

    case 'LIST_IP_POOLS_FAIL':
      return { ...state, listError: payload, listLoading: false };

    //create pool
    case 'CREATE_IP_POOL_PENDING':
      return { ...state, currentPool: { }, createError: null };

    case 'CREATE_IP_POOL_SUCCESS':
      return { ...state, currentPool: { id: payload.id, name: payload.name }};

    case 'CREATE_IP_POOL_FAIL':
      return { ...state, currentPool: {}, createError: payload };

    //update pool
    case 'UPDATE_IP_POOL_PENDING':
      return { ...state, updateLoading: true, updateError: null, updateSuccess: null };

    case 'UPDATE_IP_POOL_SUCCESS':
      return { ...state, updateSuccess: true, updateLoading: false };

    case 'UPDATE_IP_POOL_FAIL':
      return { ...state, updateLoading: false, updateError: payload };

    //get single pool
    case 'GET_IP_POOL_PENDING':
      return { ...state, getLoading: true };

    case 'GET_IP_POOL_SUCCESS':
      return { ...state, pool: payload, getLoading: false };

    case 'GET_IP_POOL_FAIL':
      return { ...state, pool: {}, getLoading: false, getError: payload };

    //delete a pool
    case 'DELETE_IP_POOL_PENDING':
      return { ...state, deleteLoading: true };

    case 'DELETE_IP_POOL_SUCCESS':
      return { ...state, deleteSuccess: true, deleteLoading: false };

    case 'DELETE_IP_POOL_FAIL':
      return { ...state, deleteLoading: false, deleteError: payload };

    default:
      return state;
  }
};
