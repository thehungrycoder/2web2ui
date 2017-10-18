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

    console.log(type); //eslint-disable-line

    //create pool
    case 'CREATE_IP_POOL_PENDING':
      return { ...state, currentPool: { }, createError: null };

    case 'CREATE_IP_POOL_SUCCESS':
      return { ...state, currentPool: { id: payload.id, name: payload.name }};

    case 'CREATE_IP_POOL_FAIL':
      return { ...state, currentPool: {}, createError: payload };

    default:
      return state;
  }
};
