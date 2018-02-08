const initialState = {
  list: [],
  domain: { dkim: {}, status: {}},
  listError: null,
  getError: null,
  verifyError: null
};

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
      return { ...state, domain: { id: meta.id, ...payload }, getLoading: false };

    case 'GET_SENDING_DOMAIN_FAIL':
      return { ...state, getError: payload, getLoading: false };

    case 'VERIFY_SENDING_DOMAIN_CNAME_PENDING':
      return { ...state, verifyCnameLoading: true, verifyCnameError: null };

    case 'VERIFY_SENDING_DOMAIN_CNAME_SUCCESS':
      // augment current domain's status property
      return { ...state, verifyCnameLoading: false, domain: { ...state.domain, status: payload }};

    case 'VERIFY_SENDING_DOMAIN_CNAME_FAIL':
      return { ...state, verifyCnameLoading: false, verifyCnameError: payload };

    case 'VERIFY_SENDING_DOMAIN_DKIM_PENDING':
      return { ...state, verifyDkimLoading: true, verifyDkimError: null };

    case 'VERIFY_SENDING_DOMAIN_DKIM_SUCCESS':
      // augment current domain's status property
      return { ...state, verifyDkimLoading: false, domain: { ...state.domain, status: payload }};

    case 'VERIFY_SENDING_DOMAIN_DKIM_FAIL':
      return { ...state, verifyDkimLoading: false, verifyDkimError: payload };

    case 'VERIFY_SENDING_DOMAIN_ABUSE_AT_PENDING':
    case 'VERIFY_SENDING_DOMAIN_POSTMASTER_AT_PENDING':
    case 'VERIFY_SENDING_DOMAIN_VERIFICAITON_MAILBOX_PENDING':
      return { ...state, verifyEmailLoading: true, verifyEmailError: null };

    case 'VERIFY_SENDING_DOMAIN_ABUSE_AT_SUCCESS':
    case 'VERIFY_SENDING_DOMAIN_POSTMASTER_AT_SUCCESS':
    case 'VERIFY_SENDING_DOMAIN_VERIFICAITON_MAILBOX_SUCCESS':
      // augment current domain's status property
      return { ...state, verifyEmailLoading: false, domain: { ...state.domain, status: payload }};

    case 'VERIFY_SENDING_DOMAIN_ABUSE_AT_FAIL':
    case 'VERIFY_SENDING_DOMAIN_POSTMASTER_AT_FAIL':
    case 'VERIFY_SENDING_DOMAIN_VERIFICAITON_MAILBOX_FAIL':
      return { ...state, verifyEmailLoading: false, verifyEmailError: payload };

    case 'UPDATE_SENDING_DOMAIN_PENDING':
      return { ...state, updateLoading: true, updateError: null };

    case 'UPDATE_SENDING_DOMAIN_SUCCESS':
    // augment current domain property with update values
      return { ...state, updateLoading: false, domain: { ...state.domain, ...meta.data }};

    case 'UPDATE_SENDING_DOMAIN_FAIL':
      return { ...state, updateLoading: false, updateError: payload };

    default:
      return state;
  }
};
