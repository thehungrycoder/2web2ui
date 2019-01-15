import cases from 'jest-in-case';
import summaryTablesReducer from '../summaryTables';

cases('Summary Tables Reducer', ({ name, ...action }) => {
  const nextState = summaryTablesReducer(undefined, action);
  expect(nextState).toMatchSnapshot();
}, {
  'when init': {},
  'when current page changes': {
    type: 'CHANGE_SUMMARY_TABLE',
    payload: {
      tableName: 'testTable',
      currentPage: 999
    }
  },
  'when order changes': {
    type: 'CHANGE_SUMMARY_TABLE',
    payload: {
      tableName: 'testTable',
      order: {
        ascending: true,
        dataKey: 'columnA'
      }
    }
  },
  'when page size changes': {
    type: 'CHANGE_SUMMARY_TABLE',
    payload: {
      tableName: 'testTable',
      perPage: 25
    }
  },
  'when reset': {
    type: 'RESET_SUMMARY_TABLE',
    payload: {
      tableName: 'testTable'
    }
  },
  'when reset with custom defaults': {
    type: 'RESET_SUMMARY_TABLE',
    payload: {
      tableName: 'testTable',
      currentPage: 2,
      order: {
        ascending: true,
        dataKey: 'subaccountId'
      }
    }
  }
});
