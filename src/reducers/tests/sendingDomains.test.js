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
  'verify cname pending': {
    type: 'VERIFY_SENDING_DOMAIN_CNAME_PENDING'
  },
  'verify cname': {
    payload: { cname_status: 'valid', ownership_verified: 1 },
    type: 'VERIFY_SENDING_DOMAIN_CNAME_SUCCESS'
  },
  'verify cname fail': {
    payload: { errors: [ { message: 'Some error occurred' }]},
    type: 'VERIFY_SENDING_DOMAIN_CNAME_FAIL'
  },
  'verify dkim pending': {
    type: 'VERIFY_SENDING_DOMAIN_DKIM_PENDING'
  },
  'verify dkim': {
    payload: { dkim_status: 'valid', ownership_verified: 1 },
    type: 'VERIFY_SENDING_DOMAIN_DKIM_SUCCESS'
  },
  'verify dkim fail': {
    payload: { errors: [ { message: 'Some error occurred' }]},
    type: 'VERIFY_SENDING_DOMAIN_DKIM_FAIL'
  },
  'verify with abuse pending': {
    type: 'VERIFY_SENDING_DOMAIN_ABUSE_AT_PENDING'
  },
  'verify with abuse': {
    payload: { abuse_at_status: 'valid' },
    type: 'VERIFY_SENDING_DOMAIN_ABUSE_AT_SUCCESS'
  },
  'verify with abuse fail': {
    payload: { errors: [ { message: 'Some error occurred' }]},
    type: 'VERIFY_SENDING_DOMAIN_ABUSE_AT_FAIL'
  },
  'verify with mailbox pending': {
    type: 'VERIFY_SENDING_DOMAIN_VERIFICATION_MAILBOX_PENDING'
  },
  'verify with mailbox': {
    payload: { verification_mailbox_status: 'valid' },
    type: 'VERIFY_SENDING_DOMAIN_VERIFICATION_MAILBOX_SUCCESS'
  },
  'verify with mailbox fail': {
    payload: { errors: [ { message: 'Some error occurred' }]},
    type: 'VERIFY_SENDING_DOMAIN_VERIFICATION_MAILBOX_FAIL'
  },
  'verify with postmaster pending': {
    type: 'VERIFY_SENDING_DOMAIN_POSTMASTER_AT_PENDING'
  },
  'verify with postmaster': {
    payload: { postmaster_at_status: 'valid' },
    type: 'VERIFY_SENDING_DOMAIN_POSTMASTER_AT_SUCCESS'
  },
  'verify with postmaster fail': {
    payload: { errors: [ { message: 'Some error occurred' }]},
    type: 'VERIFY_SENDING_DOMAIN_POSTMASTER_AT_FAIL'
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
