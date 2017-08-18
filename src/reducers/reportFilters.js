import moment from 'moment';

const to = new Date();
const from = moment(to).subtract(1, 'day').toDate();

const initialState = {
  to,
  from,
  activeList: [],
  searchList: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_EXACT_TIME':
      return { ...state, ...action.payload };

    case 'SET_RELATIVE_TIME':
      return { ...state };

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
