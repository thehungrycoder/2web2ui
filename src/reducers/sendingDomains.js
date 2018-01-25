const initialState = { list: [], listError: null, getError: null };

export default (state = initialState, { type, payload, meta }) => {
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
      // augment current domain's status property
      return { ...state, verifyLoading: false, domain: { ...state.domain, status: payload }}; //augment current domain's status property
      // return {
      //   ...state, verifyLoading: false, domain: {
      //     ...state.domain, status: {
      //       'mx_status': 'valid',
      //       'spf_status': 'invalid',
      //       'cname_status': 'unverified', 'ownership_verified': true,
      //       'abuse_at_status': 'unverified', 'compliance_status': 'valid', 'verification_mailbox_status': 'valid',
      //       'dkim_status': 'invalid', 'postmaster_at_status': 'unverified'
      //     }
      //   }
      // };

    case 'VERIFY_SENDING_DOMAIN_FAIL':
      return { ...state, verifyLoading: false, verifyError: null };

    case 'UPDATE_SENDING_DOMAIN_PENDING':
      return { ...state, updateLoading: true, updateError: null };

    case 'UPDATE_SENDING_DOMAIN_SUCCESS':
      return { ...state, updateLoading: false, ...meta.data };

    case 'UPDATE_SENDING_DOMAIN_FAIL':
      return { ...state, updateLoading: false, updateError: payload };

    default:
      return state;
  }
};
