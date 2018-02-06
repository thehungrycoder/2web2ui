import cases from 'jest-in-case';
import sendingDomainsReducer from '../sendingDomains';

const state = {
  domain: {
    is_default_bounce_domain: false,
    status: {
      cname_status: null,
      mx_status: null,
      ownership_verified: 1
    }
  }
};

const VERIFY_TEST_CASES = {
  'verify pending': {
    type: 'VERIFY_SENDING_DOMAIN_CNAME_PENDING'
  },
  'verify domain': {
    payload: { cname_status: 'valid', ownership_verified: 1 },
    type: 'VERIFY_SENDING_DOMAIN_CNAME_SUCCESS'
  },
  'verify domain fail': {
    payload: { errors: [ { message: 'Some error occurred' }]},
    type: 'VERIFY_SENDING_DOMAIN_CNAME_FAIL'
  }
};

cases('Sending Domain reducer', (action) => {
  expect(sendingDomainsReducer(state, action)).toMatchSnapshot();
}, VERIFY_TEST_CASES);

const UPDATE_TEST_CASES = {
  'update pending': {
    type: 'UPDATE_SENDING_DOMAIN_PENDING'
  },
  'update domain': {
    payload: { cname_status: 'valid', ownership_verified: 1 },
    meta: {
      data: {
        is_default_bounce_domain: true
      }
    },
    type: 'UPDATE_SENDING_DOMAIN_SUCCESS'
  },
  'update domain fail': {
    payload: { errors: [ { message: 'Some error occurred' }]},
    type: 'UPDATE_SENDING_DOMAIN_FAIL'
  }
};

cases('Sending Domain Update reducer', (action) => {
  expect(sendingDomainsReducer(state, action)).toMatchSnapshot();
}, UPDATE_TEST_CASES);
