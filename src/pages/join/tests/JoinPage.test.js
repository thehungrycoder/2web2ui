/* eslint max-lines: ["error", 200] */

import { shallow } from 'enzyme';
import React from 'react';
import cases from 'jest-in-case';
import cookie from 'js-cookie';
import { JoinPage } from '../JoinPage';
import { DEFAULT_REDIRECT_ROUTE } from 'src/constants';

let props;
let instance;
let wrapper;
let formValues;

jest.mock('js-cookie');
jest.mock('src/config', () => ({
  zuora: {}, //axiosInstance throws without this
  authentication: { cookie: {}}, //authCookie throws without this
  gaTag: 'ga101',
  links: {
    submitTicket: 'https://support.sparkpost.com/customer/portal/emails/new'
  },
  salesforceDataParams: ['sfdcid', 'src', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'],
  attribution: {
    cookieName: 'attribution',
    cookieDuration: 60 * 24 * 30,
    cookieDomain: '.sparkpost.com'
  }
}));

describe('AuthPage', () => {
  beforeEach(() => {
    props = {
      account: {
        createError: null
      },
      logout: jest.fn(),
      register: jest.fn(() => Promise.resolve({ username: 'foo_bar' })),
      authenticate: jest.fn(() => Promise.resolve()),
      history: {
        push: jest.fn()
      }
    };
    formValues = {
      first_name: 'foo',
      last_name: 'bar',
      email: 'foo@bar.com',
      tou_accepted: true,
      password: 'foobar'
    };

    wrapper = shallow(<JoinPage {...props} />);
    instance = wrapper.instance();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });


  describe('render', () => {
    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });
    it('renders errors', () => {
      instance.handleSignupFailure = jest.fn().mockReturnValue('Some error occurred');
      wrapper.setProps({ account: { createError: {}}}); //just to make it truthy
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('registerSubmit', () => {
    let attributionValues;
    beforeEach(() => {
      attributionValues = { sfdcid: 'abcd', 'utm_source': 'test file' };
      instance.getAndSetAttributionData = jest.fn().mockReturnValue(attributionValues);
      instance.trackSignup = jest.fn();
    });

    it('calls register with correct data', async() => {
      await instance.registerSubmit(formValues);
      expect(props.register).toHaveBeenCalledTimes(1);
      expect(props.register).toHaveBeenCalledWith({ ...formValues, salesforce_data: attributionValues, sfdcid: attributionValues.sfdcid });

    });

    it('authenticates after successful register', async() => {
      await instance.registerSubmit(formValues);
      expect(props.register).toHaveBeenCalledTimes(1);
      expect(props.authenticate).toHaveBeenCalledWith('foo_bar', formValues.password);
    });

    it('tracks signup after successful registration', async() => {
      await instance.registerSubmit(formValues);
      expect(props.register).toHaveBeenCalledTimes(1);
      expect(instance.trackSignup).toHaveBeenCalledTimes(1);
    });

    it('redirects to correct url upon auth', async() => {
      await instance.registerSubmit(formValues);
      expect(props.history.push).toHaveBeenCalledWith(DEFAULT_REDIRECT_ROUTE);
    });

    it('does not swallow exceptions', async() => {
      const err = new Error('some error');
      props.register.mockReturnValue(Promise.reject(err));

      await expect(instance.registerSubmit(formValues)).rejects.toThrowError(err);
    });
  });

  describe('createSupportLink', () => {
    it('creates support link correctly', () => {
      wrapper.setState({ formData: formValues });
      expect(instance.createSupportLink()).toMatchSnapshot();
    });
  });

  describe('getAndSetAttributionData', () => {
    beforeEach(() => {
      cookie.getJSON.mockReturnValue({ sfdcid: '123', utm_source: 'script' });
    });

    it('returns correct attribution data', () => {
      expect(instance.getAndSetAttributionData()).toEqual({ sfdcid: '123', utm_source: 'script' });
      expect(cookie.set).toHaveBeenCalledTimes(0);
    });

    it('correctly sets cookie and returns attribution data', () => {
      cookie.getJSON.mockReturnValue(null);
      wrapper.setProps({ params: { foo: 'bar', sfdcid: '123', utm_medium: 'script' }});
      expect(instance.getAndSetAttributionData()).toEqual({ sfdcid: '123', utm_medium: 'script' });
      expect(cookie.set).toHaveBeenCalledTimes(1);
    });
  });

  describe('handleSignupFailure', () => {
    //TODO verify "error" with real like error messages

    beforeEach(() => {
      wrapper.setState({
        formData: {
          first_name: 'foo',
          last_name: 'bar',
          email: 'foo@bar.com'
        }
      });
    });

    const testCases = [
      { name: 'captcha error', message: 'must provide recaptcha error', status: 400, expected: 'There was an error with your reCAPTCHA response, please try again.' },
      { name: 'invalid email (400)', message: 'invalid email', status: 400, expected: 'Email address is not valid.' },
      { name: 'invalid email (403)', message: 'invalid email', status: 403, expected: 'Email address is not valid.' },
      { name: 'aws account exists', message: 'AWS Account already exists', status: 409, expected: 'It looks like you\'ve already created a SparkPost account through the AWS Marketplace. There may be a brief delay for your AWS account info to synchronize. Please wait a few minutes and then sign in.' },
      { name: 'duplicate email', message: 'A user with that email address already exists', status: 409 },
      { name: 'manual review required (siftscience)', message: 'Sign up blocked', status: 403 },
      { name: 'service not available in location', message: 'forbidden', status: 403, expected: 'SparkPost is not currently available in your location.' },
      { name: 'no status', message: 'some error', status: null }
    ];

    cases('handleSignupFailure: ', (opts) => {
      const response = {
        response: {
          status: opts.status,
          data: {
            errors: [{ message: opts.message }]
          }
        }
      };

      if (opts.expected) {
        expect(instance.handleSignupFailure(response)).toBe(opts.expected);
      } else {
        expect(instance.handleSignupFailure(response)).toMatchSnapshot();
      }
    }, testCases);

    it('it returns generic error on all other cases', () => {
      expect(instance.handleSignupFailure({})).toMatchSnapshot();
    });
  });

  describe('trackSignup', () => {
    beforeEach(() => {
      window.gtag = jest.fn();
    });

    it('calls gTag with correct params', () => {
      instance.trackSignup();
      expect(window.gtag).toHaveBeenCalledWith('config', 'ga101', {
        event_category: 'Completed form',
        event_action: 'create account',
        data: { form_type: 'create account' }
      });
    });
  });

});
