import { normalizeFromAddress, normalizeTemplateFromAddress } from 'src/helpers/templates';

const initialState = {
  list: [],
  listError: null,
  byId: {},
  contentPreview: {
    draft: {},
    published: {}
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    // List
    case 'LIST_TEMPLATES_PENDING':
      return { ...state, listLoading: true, listError: null };

    case 'LIST_TEMPLATES_SUCCESS':
      return { ...state, list: action.payload, listLoading: false };

    case 'LIST_TEMPLATES_FAIL':
      return { ...state, listError: action.payload, listLoading: false };

    // Get Draft
    case 'GET_DRAFT_TEMPLATE_PENDING':
      return { ...state, getDraftLoading: true, getDraftError: null };

    case 'GET_DRAFT_TEMPLATE_SUCCESS':
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.id]: { ...state.byId[action.payload.id], draft: normalizeTemplateFromAddress(action.payload) }
        },
        getDraftLoading: false
      };

    case 'GET_DRAFT_TEMPLATE_FAIL':
      return { ...state, getDraftLoading: false, getDraftError: action.payload };

    // Get Published
    case 'GET_PUBLISHED_TEMPLATE_PENDING':
      return { ...state, getPublishedLoading: true, getPublishedError: null };

    case 'GET_PUBLISHED_TEMPLATE_SUCCESS':
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.id]: { ...state.byId[action.payload.id], published: normalizeTemplateFromAddress(action.payload) }
        },
        getPublishedLoading: false
      };

    case 'GET_PUBLISHED_TEMPLATE_FAIL':
      return { ...state, getPublishedLoading: false, getPublishedError: action.payload };

    case 'GET_TEMPLATE_TEST_DATA':
      return { ...state, testData: action.payload };

    case 'GET_TEMPLATE_PREVIEW_SUCCESS':
      return {
        ...state,
        contentPreview: {
          ...state.contentPreview,
          [action.meta.context.mode]: {
            ...state.contentPreview[action.meta.context.mode],
            [action.meta.context.id]: {
              ...action.payload,
              from: normalizeFromAddress(action.payload.from)
            }
          }
        }
      };

    default:
      return state;
  }
};
