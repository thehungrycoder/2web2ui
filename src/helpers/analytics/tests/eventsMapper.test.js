import cases from 'jest-in-case';
import eventsMapper from '../eventsMapper';

cases('eventsMapper', ({ name, ...action }) => {
  expect(eventsMapper(action)).toMatchSnapshot();
}, {
  'with untracked action': {},
  'with SparkPost API fail action': {
    type: 'GET_ACCOUNT_FAIL',
    payload: {
      error: {
        name: 'SparkpostApiError',
        message: 'Unable to find account'
      }
    }
  },
  'with Zuora API fail action': {
    type: 'UPDATE_BILLING_FAIL',
    payload: {
      error: {
        name: 'ZuoraApiError',
        message: 'Unable to update billing information'
      }
    }
  },
  'with initialize form action': {
    type: '@@redux-form/INITIALIZE',
    meta: { form: 'joinForm' }
  },
  'with submit form action': {
    type: '@@redux-form/START_SUBMIT',
    meta: { form: 'joinForm' }
  },
  'with failed submit form action': {
    type: '@@redux-form/SET_SUBMIT_FAILED',
    meta: { form: 'joinForm' }
  },
  'with sucess submit form action': {
    type: '@@redux-form/SET_SUBMIT_SUCCEEDED',
    meta: { form: 'joinForm' }
  }
});
