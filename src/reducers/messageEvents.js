import { formatDocumentation, getEmptyFilters } from 'src/helpers/messageEvents';
import { getRelativeDates } from 'src/helpers/date';
import _ from 'lodash';
import { EVENTS_SEARCH_FILTERS } from 'src/constants';
import qs from 'query-string';

const initialState = {
  loading: false,
  historyLoading: false,
  documentationLoading: false,
  error: null,
  events: [],
  history: {},
  search: {
    dateOptions: {
      relativeRange: 'hour'
    },
    recipients: [],
    events: [],
    ...getEmptyFilters(EVENTS_SEARCH_FILTERS)
  },
  linkByPage: [],
  cachedResultsByPage: [],
  totalCount: 0,
  hasMorePagesAvailable: false
};

export default (state = initialState, { type, payload, meta, extra }) => {

  switch (type) {

    case 'GET_MESSAGE_EVENTS_PENDING':
      return { ...state, loading: true, error: null };

    case 'GET_MESSAGE_EVENTS_SUCCESS': {
      const currentUrlParams = qs.stringify(meta.params);
      const { links: { next }, total_count: totalCount } = extra;
      //next is null when we reach the end of the results
      const nextUrlParams = next ? qs.extract(next) : null;
      const hasMorePagesAvailable = Boolean(next);
      const linkByPage = [currentUrlParams, nextUrlParams ];
      const cachedResultsByPage = [ payload ];
      return { ...state, linkByPage, totalCount, cachedResultsByPage, loading: false, events: payload, hasMorePagesAvailable };
    }

    case 'GET_MESSAGE_EVENTS_FAIL':
      return { ...state, loading: false, error: payload };


      // Changing Page

    case 'GET_MESSAGE_EVENTS_PAGE_PENDING':
      return { ...state, loading: true, error: null };

    case 'GET_MESSAGE_EVENTS_PAGE_SUCCESS': {
      const { links: { next }} = extra;
      //next is null when we reach the end of the results
      const nextUrlParams = next ? qs.extract(next) : null;
      const hasMorePagesAvailable = Boolean(next);
      const { currentPageIndex } = meta;
      const { linkByPage, cachedResultsByPage } = state;
      linkByPage[currentPageIndex + 1] = nextUrlParams;
      cachedResultsByPage[currentPageIndex] = payload;
      return { ...state, linkByPage, cachedResultsByPage, loading: false, events: payload, hasMorePagesAvailable };
    }

    case 'GET_MESSAGE_EVENTS_PAGE_FAIL':
      return { ...state, loading: false, error: payload };

    case 'LOAD_EVENTS_FROM_CACHE': {
      const events = state.cachedResultsByPage[payload];
      return { ...state, events };
    }


    // History

    case 'GET_MESSAGE_HISTORY_PENDING':
      return { ...state, historyLoading: true, error: null };

    case 'GET_MESSAGE_HISTORY_SUCCESS':
      return {
        ...state,
        historyLoading: false,
        history: { ...state.history, [meta.params.messages]: payload }
      };

    case 'GET_MESSAGE_HISTORY_FAIL':
      return { ...state, historyLoading: false, error: payload };


      // Documentation

    case 'GET_MESSAGE_EVENTS_DOCUMENTATION_PENDING':
      return { ...state, documentationLoading: true, error: null };

    case 'GET_MESSAGE_EVENTS_DOCUMENTATION_SUCCESS':
      return { ...state, documentationLoading: false, documentation: formatDocumentation(payload) };

    case 'GET_MESSAGE_EVENTS_DOCUMENTATION_FAIL':
      return { ...state, documentationLoading: false, error: payload };


      // Search options

    case 'REFRESH_MESSAGE_EVENTS_DATE_OPTIONS': {
      const dateOptions = { ...state.search.dateOptions, ...payload, ...getRelativeDates(payload.relativeRange, false) };
      return { ...state, search: { ...state.search, dateOptions }};
    }

    case 'REFRESH_MESSAGE_EVENTS_SEARCH_OPTIONS': {
      const { dateOptions, ...options } = payload;
      return { ...state, search: { ...state.search, dateOptions: { ...state.search.dateOptions, ...dateOptions }, ...options }};
    }

    case 'ADD_MESSAGE_EVENTS_FILTERS': {
      const updatedSearch = {};
      Object.keys(payload).map((key) => {
        updatedSearch[key] = _.uniq([ ...state.search[key], ...payload[key]]);
      });
      return { ...state, search: { ...state.search, ...updatedSearch }};
    }

    case 'REMOVE_MESSAGE_EVENTS_FILTER': {
      const updatedSearch = {};
      updatedSearch[payload.key] = state.search[payload.key].filter((listItem) => payload.item !== listItem);
      return { ...state, search: { ...state.search, ...updatedSearch }};
    }

    default:
      return state;
  }
};
