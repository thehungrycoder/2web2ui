import cases from 'jest-in-case';
import recipientVerificationReducer from '../recipientValidation';

cases('Recipient Verification Lists Reducer', (action) => {
  expect(recipientVerificationReducer(undefined, action)).toMatchSnapshot();
}, {
  'default': undefined,
  'when verification successfully returns invalid address': {
    type: 'SINGLE_RECIPIENT_VALIDATION_SUCCESS',
    payload: {
      singleResults: {
        valid: false,
        reason: 'not valid because mx lookup failed'
      }
    },
    meta: {
      email: 'invalid@address.com'
    }
  },
  'when verification successfully returns valid address': {
    type: 'SINGLE_RECIPIENT_VALIDATION_SUCCESS',
    payload: {
      singleResults: {
        valid: true
      }
    },
    meta: {
      email: 'valid@address.com'
    }
  },
  'when verification is pending': {
    type: 'SINGLE_RECIPIENT_VALIDATION_PENDING'
  }
});
