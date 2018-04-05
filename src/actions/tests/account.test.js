import { fetch, getPlans, register, emailRequest } from '../account';
jest.mock('../helpers/sparkpostApiRequest', () => jest.fn((a) => a));

test('fetch - no params', () => {
  const fetchAction = fetch();
  expect(fetchAction).toMatchSnapshot();
});

test('fetch with params', () => {
  const params = {
    this: 'one',
    also: 'that one'
  };
  const fetchAction = fetch(params, { meta: { onSuccess: jest.fn() }});
  expect(fetchAction).toMatchSnapshot();
});

test('getPlans', () => {
  const getPlansAction = getPlans();
  expect(getPlansAction).toMatchSnapshot();
});

describe('Account action creators', () => {
  describe('register', () => {
    let data;
    beforeEach(() => {
      data = {
        first_name: 'foo',
        last_name: 'bar',
        email: 'foo@bar.com',
        passowrd: 'foobar',
        tou_accepted: true,
        recaptcha_response: 'foofoo',
        recaptcha_type: 'invisible'
      };
    });
    it('makes api call with passed data', () => {
      expect(register(data)).toMatchSnapshot();
    });
  });

  describe('emailRequest', () => {
    let data;
    beforeEach(() => {
      data = {
        limit: 50000,
        previousLimit: '1000',
        template_id: 'daily-limit-increase',
        campaign_id: 'support-daily-limit-increase',
        reason: 'just because i want'
      };
    });
    it('makes api call with correct data', () => {
      expect(emailRequest(data)).toMatchSnapshot();
    });
  });

});
