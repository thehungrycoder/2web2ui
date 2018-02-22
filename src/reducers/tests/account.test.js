import cases from 'jest-in-case';
import accountReducer, { initialState } from '../account';

const CREATE_TEST_CASES = {
  'create account pending': {
    type: 'CREATE_ACCOUNT_PENDING'
  },
  'create account fail': {
    type: 'CREATE_ACCOUNT_FAIL',
    payload: { errors: [{ message: 'Some error occurred' }]}
  },
  'create account success': {
    type: 'CREATE_ACCOUNT_SUCCESS',
    payload: {
      'results': {
        'message': 'Account created, welcome to SparkPost!',
        'username': 'john.smith',
        'customer_id': 1000242
      }
    }
  }
};

cases('Account reducer', (action) => {
  expect(accountReducer(initialState, action)).toMatchSnapshot();
}, CREATE_TEST_CASES);
