import subaccountsReducer from '../subaccounts';
import cases from 'jest-in-case';

cases('Reducer: Subaccount', ({ name, ...action }) => {
  expect(subaccountsReducer(undefined, action)).toMatchSnapshot();
}, {
  'when subaccount list failed to load': {
    type: 'LIST_SUBACCOUNTS_FAIL',
    payload: new Error('Oh no!')
  },
  'when subaccount list loaded': {
    type: 'LIST_SUBACCOUNTS_SUCCESS',
    payload: [
      { id: 'test-subaccount', name: 'Test Subaccount' }
    ]
  },
  'when subaccount list is pending': {
    type: 'LIST_SUBACCOUNTS_PENDING'
  },
  'when get subaccount is cleared': {
    type: 'CLEAR_SUBACCOUNT'
  },
  'when get subaccount failed': {
    type: 'GET_SUBACCOUNT_FAIL',
    payload: new Error('Oh no!')
  },
  'when get subaccount is pending': {
    type: 'GET_SUBACCOUNT_PENDING'
  },
  'when get subaccount succeeds': {
    type: 'GET_SUBACCOUNT_SUCCESS',
    payload: {
      id: 'test-subaccount',
      name: 'Test Subaccount'
    }
  }
});
