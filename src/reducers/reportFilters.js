import { getRelativeDates } from 'src/helpers/date';

const DEFAULT_RANGE = 'day';
const initialState = {
  ...getRelativeDates(DEFAULT_RANGE),
  relativeRange: DEFAULT_RANGE,
  activeList: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_EXACT_TIME':
      return { ...state, ...action.payload };

    case 'SET_RELATIVE_TIME':
      return { ...state, ...action.payload };

    case 'REFRESH_REPORT_RANGE': {
      const { to, from, relativeRange } = action.payload;
      console.log({ relativeRange }); // eslint-disable-line
      return { ...state, to, from, relativeRange };
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

    default:
      return state;
  }
};
