const initialState = {
  list: [],
  error: null,
  listLoading: false,
  verifying: []
};

export default (state = initialState, { type, payload, meta }) => {
  switch (type) {
    case 'LIST_TRACKING_DOMAINS_PENDING':
      return { ...state, listLoading: true, error: null };

    case 'LIST_TRACKING_DOMAINS_SUCCESS':
      return { ...state, listLoading: false, list: payload };

    case 'LIST_TRACKING_DOMAINS_FAIL':
      return { ...state, listLoading: false, error: { payload, meta, resource: 'tracking domains' }};

    case 'DELETE_TRACKING_DOMAIN_PENDING':
      return { ...state, deleting: meta.domain, deleteError: null };

    case 'DELETE_TRACKING_DOMAIN_FAIL':
      return { ...state, deleting: false, deleteError: payload };

    case 'DELETE_TRACKING_DOMAIN_SUCCESS':
      return { ...state, deleting: false, list: state.list.filter((d) => d.domain !== meta.domain) };

    case 'UPDATE_TRACKING_DOMAIN_PENDING':
      return { ...state, updating: meta.domain, updateError: null };

    case 'UPDATE_TRACKING_DOMAIN_FAIL':
      return { ...state, updating: false, updateError: payload };

    case 'UPDATE_TRACKING_DOMAIN_SUCCESS':
      return { ...state, updating: false };

    case 'VERIFY_TRACKING_DOMAIN_PENDING':
      return { ...state, verifying: [...state.verifying, meta.domain]};

    case 'VERIFY_TRACKING_DOMAIN_FAIL':
      return { ...state, verifying: state.verifying.filter((domain) => domain !== meta.domain) };

    case 'VERIFY_TRACKING_DOMAIN_SUCCESS':
      return {
        ...state,
        verifying: state.verifying.filter((domain) => domain !== meta.domain),
        list: state.list.map((d) => d.domain === meta.domain ? { ...d, status: payload } : d)
      };

    default:
      return state;
  }
};
