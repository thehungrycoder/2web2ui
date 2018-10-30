const initialState = {
  singleResults: undefined,
  errors: undefined,
  uploadLoading: false,
  listResultsLoading: false,
  listResults: null
};

export default (state = initialState, { meta, payload, type }) => {
  switch (type) {

    // List Upload
    case 'UPLOAD_RECIPIENT_VERIFICATION_LIST_PENDING':
      return { ...state, uploadLoading: true };

    case 'UPLOAD_RECIPIENT_VERIFICATION_LIST_SUCCESS':
      return {
        ...state,
        uploadLoading: false,
        listResults: {
          id: payload.list_id
        }
      };

    case 'UPLOAD_RECIPIENT_VERIFICATION_LIST_FAIL':
      return { ...state, uploadLoading: false };

    // List Results
    case 'GET_LATEST_PENDING':
      return { ...state, listResultsLoading: true, listResults: null };

    case 'GET_LATEST_ERROR':
      return { ...state, listResultsLoading: false };

    case 'GET_LATEST_SUCCESS':
      return {
        ...state,
        listResultsLoading: false,
        listResults: {
          complete: payload.complete,
          list_id: payload.list_id
        }
      };

    case 'GET_JOB_PENDING':
      return { ...state, listResultsLoading: true };

    case 'GET_JOB_ERROR':
      return { ...state, listResultsLoading: false };

    case 'GET_JOB_SUCCESS':
      return {
        ...state,
        listResultsLoading: false,
        listResults: {
          complete: payload.complete,
          list_id: payload.list_id
        }
      };

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
