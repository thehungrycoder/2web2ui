const initialState = {
  list: [],
  loading: false,
  singleResults: undefined,
  errors: undefined
};

export default (state = initialState, { meta, payload, type }) => {
  switch (type) {
    case 'CREATE_RECIPIENT_VERIFICATION_LIST_PENDING':
      return { ...state, loading: true };

    case 'UPLOAD_RECIPIENT_VERIFICATION_LIST_SUCCESS':
      return {
        ...state,
        loading: false,
        list: [ ...state.list, {
          id: payload.id,
          name: payload.name,
          total_accepted_recipients: payload.total_accepted_recipients,
          description: meta.data.description
        }]
      };

    case 'CREATE_RECIPIENT_VERIFICATION_LIST_FAIL':
      return { ...state, loading: false };

    case 'SINGLE_RECIPIENT_VERIFICATION_PENDING':
      return { ...state, singleResults: undefined, errors: undefined };

    case 'SINGLE_RECIPIENT_VERIFICATION_SUCCESS':
      return {
        ...state,
        singleResults: {
          valid: payload.valid,
          reason: payload.reason,
          email: meta.email
        }
      };

    case 'SINGLE_RECIPIENT_VERIFICATION_FAIL':
      return { ...state, singleResults: undefined, errors: { payload, meta }};

    default:
      return { ...state };
  }
};
