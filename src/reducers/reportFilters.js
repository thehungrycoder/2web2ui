import { getRelativeDates } from 'helpers/date';

const DEFAULT_RANGE = 'day';
const initialState = {
  ...getRelativeDates(DEFAULT_RANGE),
  range: DEFAULT_RANGE,
  activeList: [],
  searchList: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_EXACT_TIME':
      return { ...state, ...action.payload };

    case 'SET_RELATIVE_TIME':
      return { ...state, ...action.payload };

    case 'REFRESH_REPORT_FILTERS': {
      const { to, from, range } = action.payload;
      return { ...state, to, from, range };
    }

    case 'ADD_FILTER':
      return { ...state, activeList: [ ...state.activeList, action.payload ]};

    case 'REMOVE_FILTER':
      return {
        ...state,
        activeList: [
          ...state.activeList.slice(0, action.payload),
          ...state.activeList.slice(action.payload + 1)
        ]
      };

    case 'SEARCH_FILTER':
      return { ...state, searchList: action.payload };

    default:
      return state;
  }
};
