import cases from 'jest-in-case';
import abTestingReducer from '../abTesting';

const state = {
  list: [
    { 'id': 'test-master' },
    { 'id': 'test-subaccount', subaccount_id: 101 },
    { 'id': 'test-subaccount', subaccount_id: 202 }
  ]
};

const TEST_CASES = {
  'matches ab tests correctly (excludes deleted one)': {
    type: 'DELETE_AB_TEST_SUCCESS',
    meta: { data: { id: 'test-master' }}
  },
  'matches ab tests with subaccount correctly (excludes deleted one)': {
    type: 'DELETE_AB_TEST_SUCCESS',
    meta: { data: { id: 'test-subaccount', subaccountId: '101' }}
  }
};

cases('A/B Testing reducer', (action) => {
  expect(abTestingReducer(state, action)).toMatchSnapshot();
}, TEST_CASES);
