const initialState = {
  list: [],
  domain: {},
  listError: null,
  getError: null
};

export default (state = initialState, { type, meta, payload }) => {
  switch (type) {

    case 'LIST_SENDING_DOMAINS_PENDING':
      return { ...state, listLoading: true, listError: null };

    case 'LIST_SENDING_DOMAINS_SUCCESS':
      return { ...state, list: payload, listLoading: false };

    case 'LIST_SENDING_DOMAINS_FAIL':
      return { ...state, listError: payload, listLoading: false };

    case 'GET_SENDING_DOMAIN_PENDING':
      return { ...state, getLoading: true, getError: null };

    case 'GET_SENDING_DOMAIN_SUCCESS':
      return { ...state, domain: { id: meta.id, ...payload }, getLoading: false };

    case 'GET_SENDING_DOMAIN_FAIL':
      return { ...state, getError: payload, getLoading: false };

    case 'UPDATE_SENDING_DOMAIN_PENDING':
      return { ...state, updating: true };

    case 'UPDATE_SENDING_DOMAIN_FAIL':
      return { ...state, updating: false, updateError: payload };

    case 'UPDATE_SENDING_DOMAIN_SUCCESS':
      return { ...state, updating: false, domain: { ...state.domain, ...meta.data }};

    default:
      return state;
  }
};
