import { getRelativeDates } from 'src/helpers/date';
import checkEqualityForKeys from 'src/helpers/checkEqualityForKeys';

const initialState = {
  list: null,
  hasSuppressions: null,
  listLoading: false,
  createError: null,
  search: {
    dateOptions: {},
    types: [],
    sources: []
  },
  nextPage: null,
  totalCount: 0
};

export default (state = initialState, action) => {
  const { meta } = action;

  switch (action.type) {

    case 'CHECK_SUPPRESSIONS_PENDING':
      return { ...state, listError: null };

    case 'CHECK_SUPPRESSIONS_SUCCESS':
      return { ...state, hasSuppression: Boolean((action.payload || []).length) };

    case 'CHECK_SUPPRESSIONS_FAIL':
      return { ...state, listError: action.payload };


    // Fetch list

    case 'GET_SUPPRESSIONS_PENDING':
      return { ...state, listLoading: true, listError: null, nextPage: null };

    case 'GET_SUPPRESSIONS_SUCCESS': {
      const nextPage = action.response.data.links.find((link) => link.rel === 'next');
      let list = action.payload;
      if (action.meta.append) {
        list = [...state.list, ...action.payload];
      }
      return { ...state, list, listLoading: false, nextPage, totalCount: action.response.data.total_count };
    }

    case 'GET_SUPPRESSIONS_FAIL':
      return { ...state, listError: action.payload, listLoading: false };



    // Recipients search

    case 'SEARCH_SUPPRESSIONS_RECIPIENT_PENDING':
      return { ...state, listLoading: true };

    case 'SEARCH_SUPPRESSIONS_RECIPIENT_SUCCESS':
      return { ...state, listLoading: false, list: action.payload };

    case 'SEARCH_SUPPRESSIONS_RECIPIENT_FAIL': {
      const { response = {}} = action.payload;
      if (response.status === 404) {
        return { ...state, listLoading: false, list: []};
      } else {
        return { ...state, listLoading: false, list: [], listError: action.payload };
      }
    }


    // Refresh date range for suppression search

    case 'REFRESH_SUPPRESSION_SEARCH_DATE_OPTIONS': {
      const dateOptions = { ...state.search.dateOptions, ...action.payload, ...getRelativeDates(action.payload.relativeRange) };
      return { ...state, search: { ...state.search, dateOptions }};
    }


    // Type and source search

    case 'UPDATE_SUPPRESSION_SEARCH_OPTIONS': {
      if (checkEqualityForKeys({ a: state.search, b: action.payload, keys: ['sources', 'types']})) {
        return state;
      }
      return { ...state, search: { ...state.search, ...action.payload }};
    }


    // Delete suppression

    case 'DELETE_SUPPRESSION_PENDING':
      return { ...state, deleting: true };

    case 'DELETE_SUPPRESSION_SUCCESS':
      return { ...state, deleting: false, list: state.list.filter((s) => !(s.recipient === meta.suppression.recipient &&
        s.type === meta.suppression.type &&
        s.subaccount_id === meta.suppression.subaccount_id))
      };

    case 'DELETE_SUPPRESSION_FAIL':
      return { ...state, deleting: false, deleteError: action.payload };


    // Reset results

    case 'RESET_SUPPRESSIONS_RESULTS':
      return { ...state, list: null };

    case 'CREATE_OR_UPDATE_SUPPRESSIONS_FAIL':
      return { ...state, persistError: action.payload };
    case 'CREATE_OR_UPDATE_SUPPRESSIONS_SUCCESS':
      return { ...state, persistError: null };


    // Parse suppression upload file

    case 'PARSE_SUPPRESSIONS_FILE_FAIL':
      return { ...state, parseError: action.payload };
    case 'PARSE_SUPPRESSIONS_FILE_SUCCESS':
      return { ...state, parseError: null };

    case 'RESET_SUPPRESSION_ERRORS':
      return { ...state, parseError: null, persistError: null };


    default:
      return state;
  }
};
