import { getRelativeDates } from 'src/helpers/date';

const initialState = {
  list: null,
  hasSuppressions: null,
  listLoading: false,
  createError: null,
  search: { dateOptions: {}}
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
      return { ...state, listLoading: true, listError: null };

    case 'GET_SUPPRESSIONS_SUCCESS':
      return { ...state, list: action.payload, listLoading: false };

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
