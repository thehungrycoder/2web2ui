const initialState = {
  list: []
};

export default (state = initialState, { type, payload }) => {

  switch (type) {

    case 'LOAD_NOTIFICATIONS_SUCCESS': {
      return { ...state, list: payload };
    }

    case 'ADD_NOTIFICATION': {
      return { ...state, list: [ ...state.list, payload ]};
    }

    default:
      return state;
  }
};
