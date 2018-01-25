const initialState = { list: [], listError: null, getError: null, verifyError: null };

export default (state = initialState, { type, payload }) => {
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
      return { ...state, domain: payload, getLoading: false };

    case 'GET_SENDING_DOMAIN_FAIL':
      return { ...state, getError: payload, getLoading: false };

    case 'VERIFY_SENDING_DOMAIN_PENDING':
      return { ...state, verifyLoading: true, verifyError: null };

    case 'VERIFY_SENDING_DOMAIN_SUCCESS':
      return { ...state, domain: { ...state.domain, status: payload }, verifyLoading: false };

    case 'VERIFY_SENDING_DOMAIN_FAIL':
      return { ...state, verifyError: payload, verifyLoading: false };

    default:
      return state;
  }
};
