export const DEFAULT = '@@DEFAULT_TABLE';

const initialState = {
  [DEFAULT]: {
    currentPage: 1,
    order: undefined, // example, { ascending: true, dataKey: 'example_column' }
    perPage: 10
  }
};

const summaryTablesReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CHANGE_SUMMARY_TABLE': {
      const { payload: { tableName, ...payload }} = action;

      return {
        ...state,
        [tableName]: { ...state[DEFAULT], ...state[tableName], ...payload }
      };
    }

    default:
      return state;
  }
};

export default summaryTablesReducer;
