import cases from 'jest-in-case';
import recipientVerificationReducer from '../recipientVerificationLists';

cases('Recipient Verification Lists Reducer', (action) => {
  expect(recipientVerificationReducer(undefined, action)).toMatchSnapshot();
}, {
  'default': undefined,
  'when verification successfully returns invalid address': {
    type: 'SINGLE_RECIPIENT_VERIFICATION_SUCCESS',
    payload: {
      valid: false,
      reason: 'not valid because mx lookup failed'
    },
    meta: {
      email: 'invalid@address.com'
    }
  },
  'when verification successfully returns valid address': {
    type: 'SINGLE_RECIPIENT_VERIFICATION_SUCCESS',
    payload: {
      valid: true
    },
    meta: {
      email: 'valid@address.com'
    }
  },
  'when ticket creation is pending': {
    type: 'SINGLE_RECIPIENT_VERIFICATION_PENDING'
  },
  'when verification fails': {
    type: 'SINGLE_RECIPIENT_VERIFICATION_FAIL',
    payload: {
      message: 'Oh no!'
    }
  }
});
