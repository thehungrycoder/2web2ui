import { shallow } from 'enzyme';
import React from 'react';
import cookie from 'js-cookie';
import { JoinPage } from '../JoinPage';
import { AFTER_JOIN_REDIRECT_ROUTE } from 'src/constants';
import * as googleAnalytics from 'src/helpers/googleAnalytics';

let props;
let instance;
let wrapper;
let formValues;
let accountFields;

jest.mock('js-cookie');
jest.mock('src/config', () => ({
  zuora: {}, //axiosInstance throws without this
  authentication: { cookie: {}}, //authCookie throws without this
  heroku: {
    cookieName: 'my-cookie'
  },
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

jest.mock('src/helpers/googleAnalytics');

describe('JoinPage', () => {
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
      },
      isAWSsignUp: false
    };
    formValues = {
      first_name: 'foo',
      last_name: 'bar',
      email: 'foo@bar.com',
      tou_accepted: true,
      email_opt_in: false,
      password: 'foobar'
    };

    accountFields = {
      first_name: 'foo',
      last_name: 'bar',
      email: 'foo@bar.com',
      tou_accepted: true,
      password: 'foobar'
    };

    googleAnalytics.addEvent = jest.fn();

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

    it('renders aws logo when signup from aws', () => {
      wrapper.setProps({ isAWSsignUp: true });
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('registerSubmit', () => {
    let attributionValues;
    let salesforceValues;
    beforeEach(() => {
      attributionValues = { sfdcid: 'abcd', 'utm_source': 'test file' };
      salesforceValues = { ...attributionValues, email_opt_out: true };
      instance.getAndSetAttributionData = jest.fn().mockReturnValue(attributionValues);
      instance.trackSignup = jest.fn();
    });

    it('calls register with correct data', async() => {
      await instance.registerSubmit(formValues);
      expect(props.register).toHaveBeenCalledTimes(1);
      expect(props.register).toHaveBeenCalledWith({ ...accountFields, salesforce_data: salesforceValues, sfdcid: attributionValues.sfdcid });
    });

    it('negates email_opt_in properly', async() => {
      formValues.email_opt_in = true;
      await instance.registerSubmit(formValues);
      expect(props.register).toHaveBeenCalledWith(expect.objectContaining({
        salesforce_data: expect.objectContaining({
          email_opt_out: false
        })
      }));
    });

    it('authenticates after successful register', async() => {
      await instance.registerSubmit(formValues);
      expect(props.register).toHaveBeenCalledTimes(1);
      expect(props.authenticate).toHaveBeenCalledWith('foo_bar', formValues.password);
    });

    it('tracks signup after successful registration', async() => {
      await instance.registerSubmit(formValues);
      expect(props.register).toHaveBeenCalledTimes(1);
      expect(googleAnalytics.addEvent).toHaveBeenCalledTimes(1);
    });

    it('redirects to correct url upon auth', async() => {
      await instance.registerSubmit(formValues);
      expect(props.history.push).toHaveBeenCalledWith(AFTER_JOIN_REDIRECT_ROUTE);
    });

    it('does not swallow exceptions', async() => {
      const err = new Error('some error');
      props.register.mockReturnValue(Promise.reject(err));

      await expect(instance.registerSubmit(formValues)).rejects.toThrowError(err);
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
});
