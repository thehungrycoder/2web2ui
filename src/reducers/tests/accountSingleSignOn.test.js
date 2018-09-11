import cases from 'jest-in-case';
import reducer from '../accountSingleSignOn';

const TEST_PAYLOAD = {
  cert: 'abc==',
  enabled: true,
  provider: 'https://sso.sparkpost.com/redirect',
  updated_at: '2018-09-11T19:07:17+00:00'
};

cases('accountSingleSignOnReducer', ({ name, ...action }) => {
  const state = reducer(undefined, { ...action, type: name });
  expect(state).toMatchSnapshot();
}, {
  GET_ACCOUNT_SSO_DETAILS_ERROR: {
    error: new Error('Oh Snap!')
  },
  GET_ACCOUNT_SSO_DETAILS_PENDING: {},
  GET_ACCOUNT_SSO_DETAILS_SUCCESS: {
    payload: TEST_PAYLOAD
  },
  PROVISION_ACCOUNT_SSO_SUCCESS: {
    payload: TEST_PAYLOAD
  },
  REPROVISION_ACCOUNT_SSO_SUCCESS: {
    payload: TEST_PAYLOAD
  },
  UPDATE_ACCOUNT_SSO_SUCCESS: {
    payload: TEST_PAYLOAD
  }
});
