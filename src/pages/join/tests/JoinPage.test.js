import { shallow } from 'enzyme';
import React from 'react';
import cases from 'jest-in-case';

import { JoinPage } from '../JoinPage';
// import JoinForm from '../components/JoinForm';
// import { DEFAULT_REDIRECT_ROUTE } from 'src/constants';

let props;
let instance;
let wrapper;

describe('AuthPage', () => {
  beforeEach(() => {
    props = {
      account: {
        createError: null
      },
      logout: jest.fn()
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
      { name: 'duplicate email', message: 'email', status: 409, expected: 'It looks like you already have a SparkPost account with this email address.' },
      { name: 'manual review required (siftscience)', message: 'Sign up blocked', status: 403, expected: 'Your account requires manual review. To proceed with sign up, please <UnstyledLink to=${this.createSupportLink()}>contact support</UnstyledLink>.', snapshot: true },
      { name: 'service not available in location', message: 'forbidden', status: 403, expected: 'SparkPost is not currently available in your location.' },
      { name: 'all other case', message: 'unknown error', status: 403, expected: 'Something went wrong. Please try again in a few minutes or contact support' }
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

      if (opts.snapshot) {
        expect(instance.handleSignupFailure(response)).toMatchSnapshot();
      } else {
        expect(instance.handleSignupFailure(response)).toBe(opts.expected);
      }
    }, testCases);


  });

});
