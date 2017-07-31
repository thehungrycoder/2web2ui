import _ from 'lodash';

const initialState = { list: [], webhook: {}, docs: {}, getLoading: true, docsLoading: true };

export default (state = initialState, action) => {
  switch (action.type) {
    /* LIST */

    case 'LIST_WEBHOOKS_PENDING':
      return { ...state, listLoading: true };

    case 'LIST_WEBHOOKS_SUCCESS':
      return { ...state, list: _.sortBy(action.payload, ['name']), listLoading: false };

    case 'LIST_WEBHOOKS_FAIL':
      return { ...state, listLoading: false };

    /* GET */

    case 'GET_WEBHOOK_PENDING':
      return { ...state, webhook: {}, getLoading: true };

    case 'GET_WEBHOOK_SUCCESS':
      return { ...state, webhook: action.payload, getLoading: false };

    case 'GET_WEBHOOK_FAIL':
      return { ...state, webhook: {}, getLoading: false };

    /* CREATE */

    case 'CREATE_WEBHOOK_PENDING':
      return { ...state, webhook: {}, createLoading: true };

    case 'CREATE_WEBHOOK_SUCCESS':
      return { ...state, createSuccess: true, createLoading: false };

    case 'CREATE_WEBHOOK_FAIL':
      return { ...state, webhook: {}, createLoading: false };

    /* UPDATE */

    case 'UPDATE_WEBHOOK_PENDING':
      return { ...state, updateLoading: true };

    case 'UPDATE_WEBHOOK_SUCCESS':
      return { ...state, updateSuccess: true, updateLoading: false };

    case 'UPDATE_WEBHOOK_FAIL':
      return { ...state, updateLoading: false };

    /* EVENT DOCS */

    case 'GET_EVENT_DOCS_PENDING':
      return { ...state, docsLoading: true };

    case 'GET_EVENT_DOCS_SUCCESS':
      return { ...state, docs: action.payload, docsLoading: false };

    case 'GET_EVENT_DOCS_FAIL':
      return { ...state, docsLoading: false };

    default:
      return state;
  }
};
