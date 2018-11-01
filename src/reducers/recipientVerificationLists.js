const initialState = {
  singleResults: undefined,
  errors: undefined,
  uploadLoading: false,
  listResultsLoading: false,
  listResults: {}
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
          listId: payload.list_id
        }
      };

    case 'UPLOAD_RECIPIENT_VERIFICATION_LIST_FAIL':
      return { ...state, uploadLoading: false };

    // List Results
    case 'GET_LATEST_UPLOAD_PENDING':
      return { ...state, listResultsLoading: true, listResults: {} };

    case 'GET_LATEST_UPLOAD_ERROR':
      return { ...state, listResultsLoading: false };

    case 'GET_LATEST_UPLOAD_SUCCESS':
      return {
        ...state,
        listResultsLoading: false,
        listResults: {
          complete: payload.complete,
          listId: payload.list_id
        }
      };

    // List Polling
    case 'GET_UPLOAD_STATUS_PENDING':
      return { ...state, listResultsLoading: true };

    case 'GET_UPLOAD_STATUS_ERROR':
      return { ...state, listResultsLoading: false };

    case 'GET_UPLOAD_STATUS_SUCCESS':
      return {
        ...state,
        listResultsLoading: false,
        listResults: {
          complete: payload.complete,
          listId: payload.list_id
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
