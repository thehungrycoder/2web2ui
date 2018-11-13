const initialState = {
  singleResults: null,
  uploadLoading: false,
  latestJobLoading: false,
  jobResultsLoading: false,
  jobResults: {},
  latest: null
};

export default (state = initialState, { meta, payload, type }) => {
  switch (type) {

    // List Upload
    case 'UPLOAD_RECIPIENT_VALIDATION_LIST_PENDING':
      return { ...state, uploadLoading: true };

    case 'UPLOAD_RECIPIENT_VALIDATION_LIST_SUCCESS':
      return {
        ...state,
        uploadLoading: false,
        latest: payload.list_id
      };

    case 'UPLOAD_RECIPIENT_VALIDATION_LIST_FAIL':
      return { ...state, uploadLoading: false };

    // List Results
    case 'GET_LATEST_JOB_PENDING':
      return { ...state, latestJobLoading: true, jobResults: {}};

    case 'GET_LATEST_JOB_ERROR':
      return { ...state, latestJobLoading: false };

    case 'GET_LATEST_JOB_SUCCESS':
      return {
        ...state,
        jobResultsLoading: false,
        latest: payload.list_id,
        jobResults: {
          ...state.jobResults,
          [payload.list_id]: {
            complete: payload.complete,
            uploaded: payload.upload_timestamp,
            rejectedUrl: payload.rejected_external_url
          }
        }
      };

    // List Polling
    case 'GET_JOB_STATUS_PENDING':
      return { ...state, jobResultsLoading: true };

    case 'GET_JOB_STATUS_ERROR':
      return { ...state, jobResultsLoading: false };

    case 'GET_JOB_STATUS_SUCCESS':
      return {
        ...state,
        jobResultsLoading: false,
        jobResults: {
          ...state.jobResults,
          [payload.list_id]: {
            complete: payload.complete,
            uploaded: payload.upload_timestamp,
            rejectedUrl: payload.rejected_external_url
          }
        }
      };

    // Single Recipient
    case 'SINGLE_RECIPIENT_VALIDATION_PENDING':
      return { ...state, singleResults: null };

    case 'SINGLE_RECIPIENT_VALIDATION_SUCCESS':
      return {
        ...state,
        singleResults: {
          valid: payload.valid,
          reason: payload.reason,
          email: meta.email
        }
      };

    case 'SINGLE_RECIPIENT_VALIDATION_FAIL':
      return { ...state, singleResults: null };

    default:
      return { ...state };
  }
};
