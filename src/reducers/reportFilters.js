const initialState = {
  relativeRange: 'day',
  activeList: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_EXACT_TIME':
      return { ...state, ...action.payload };

    case 'SET_RELATIVE_TIME':
      return { ...state, ...action.payload };

    case 'REFRESH_REPORT_RANGE': {
      const { to = state.to, from = state.from, relativeRange = state.relativeRange } = action.payload;
      return { ...state, to, from, relativeRange };
    }

    case 'ADD_FILTERS':
      return { ...state, activeList: [ ...state.activeList, ...action.payload ]};

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
