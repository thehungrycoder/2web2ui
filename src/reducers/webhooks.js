const initialState = {
  batches: [],
  list: [],
  webhook: {},
  getLoading: true,
  docsLoading: true
};

export default (state = initialState, action) => {
  switch (action.type) {
    /* LIST */

    case 'LIST_WEBHOOKS_PENDING':
      return { ...state, listLoading: true, listError: null };

    case 'LIST_WEBHOOKS_FAIL':
      return { ...state, listError: action.payload };

    case 'LIST_ALL_WEBHOOKS_SUCCESS':
      return { ...state, list: action.payload, listLoading: false };

    /* GET */

    case 'GET_WEBHOOK_PENDING':
      return { ...state, getLoading: true };

    case 'GET_WEBHOOK_SUCCESS':
      return { ...state, webhook: { ...action.payload, subaccount: action.meta.subaccount }, getLoading: false };

    case 'GET_WEBHOOK_FAIL':
      return { ...state, webhook: {}, getLoading: false };

    /* CREATE */

    case 'CREATE_WEBHOOK_PENDING':
      return { ...state, webhook: {}, createError: null };

    case 'CREATE_WEBHOOK_SUCCESS':
      return { ...state, webhook: { id: action.payload.id, subaccount: action.meta.subaccount }};

    case 'CREATE_WEBHOOK_FAIL':
      return { ...state, webhook: {}, createError: action.payload };

    /* UPDATE */

    case 'UPDATE_WEBHOOK_PENDING':
      return { ...state, updateLoading: true, updateError: null, updateSuccess: null };

    case 'UPDATE_WEBHOOK_SUCCESS':
      return { ...state, updateSuccess: true, updateLoading: false };

    case 'UPDATE_WEBHOOK_FAIL':
      return { ...state, updateLoading: false, updateError: action.payload };

    /* DELETE */

    case 'DELETE_WEBHOOK_PENDING':
      return { ...state, deleteLoading: true };

    case 'DELETE_WEBHOOK_SUCCESS':
      return { ...state, deleteSuccess: true, deleteLoading: false };

    case 'DELETE_WEBHOOK_FAIL':
      return { ...state, deleteLoading: false };

    /* TEST */

    case 'TEST_WEBHOOK_PENDING':
      return { ...state, testLoading: true };

    case 'TEST_WEBHOOK_SUCCESS':
      return { ...state, testResponse: action.payload.response, testLoading: false };

    case 'TEST_WEBHOOK_FAIL':
      return { ...state, testResponse: action.payload.response, testLoading: false };

    /* EVENT DOCS */

    case 'GET_EVENT_DOCS_PENDING':
      return { ...state, docsLoading: true };

    case 'GET_EVENT_DOCS_SUCCESS':
      return { ...state, docs: action.payload, docsLoading: false };

    case 'GET_EVENT_DOCS_FAIL':
      return { ...state, docsLoading: false };

    /* EVENT SAMPLES */

    case 'GET_EVENT_SAMPLES_PENDING':
      return { ...state, samplesLoading: true };

    case 'GET_EVENT_SAMPLES_SUCCESS':
      return { ...state, samples: action.payload, samplesLoading: false };

    case 'GET_EVENT_SAMPLES_FAIL':
      return { ...state, docsLoading: false };

    case 'GET_WEBHOOK_BATCHES_PENDING':
      return { ...state, batchesLoading: true };

    case 'GET_WEBHOOK_BATCHES_SUCCESS':
      return { ...state, batches: action.payload, batchesLoading: false };

    case 'GET_WEBHOOK_BATCHES_FAIL':
      return { ...state, batchesLoading: false };

    default:
      return state;
  }
};
