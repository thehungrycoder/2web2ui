const initialState = {
  singleResults: null,
  uploadLoading: false,
  listResultsLoading: false,
  listResults: {},
  latest: null
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
        latest: payload.list_id
      };

    case 'UPLOAD_RECIPIENT_VERIFICATION_LIST_FAIL':
      return { ...state, uploadLoading: false };

    // List Results
    case 'GET_LATEST_UPLOAD_PENDING':
      return { ...state, listResultsLoading: true, listResults: {}};

    case 'GET_LATEST_UPLOAD_ERROR':
      return { ...state, listResultsLoading: false };

    case 'GET_LATEST_UPLOAD_SUCCESS':
      return {
        ...state,
        listResultsLoading: false,
        latest: payload.list_id,
        listResults: {
          ...state.listResults,
          [payload.list_id]: {
            complete: payload.complete,
            uploaded: payload.upload_timestamp,
            rejectedUrl: payload.rejected_external_url
          }
        }
      };

    // List Polling
    case 'GET_LIST_STATUS_PENDING':
      return { ...state, listResultsLoading: true };

    case 'GET_LIST_STATUS_ERROR':
      return { ...state, listResultsLoading: false };

    case 'GET_LIST_STATUS_SUCCESS':
      return {
        ...state,
        listResultsLoading: false,
        listResults: {
          ...state.listResults,
          [payload.list_id]: {
            complete: payload.complete,
            uploaded: payload.upload_timestamp,
            rejectedUrl: payload.rejected_external_url
          }
        }
      };

    // Single Recipient
    case 'SINGLE_RECIPIENT_VERIFICATION_PENDING':
      return { ...state, singleResults: null };

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
      return { ...state, singleResults: null };

    default:
      return { ...state };
  }
};
