import React from 'react';
import { shallow } from 'enzyme';
import { SendMoreCTA } from '../SendMoreCTA';

describe('SendMoreCTA Component', () => {
  let props;
  let wrapper;
  let instance;

  beforeEach(() => {

    props = {
      currentUser: {
        email_verified: true
      },
      allowSendingLimitRequest: false,
      currentLimit: 1000,
      verifyEmail: jest.fn(() => Promise.resolve()),
      showAlert: jest.fn(() => Promise.resolve()),
      emailRequest: jest.fn(() => Promise.resolve())
    };

    wrapper = shallow(<SendMoreCTA {...props} />);
    instance = wrapper.instance();
  });

  it('renders when email address not verified', () => {
    wrapper.setProps({ currentUser: { email_verified: false }});
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly for aws free plan (cta to upgrade)', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly for customers who can request limit bump', () => {
    wrapper.setProps({ allowSendingLimitRequest: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('renders support form correctly', () => {
    wrapper.setProps({ allowSendingLimitRequest: true });
    wrapper.setState({ showSupportForm: true });
    expect(wrapper).toMatchSnapshot();
  });

  describe('resendVerification', () => {
    it('re-sends verification email and shows alert', async() => {
      await instance.resendVerification();
      expect(props.verifyEmail).toHaveBeenCalled();
      expect(props.showAlert).toHaveBeenCalled();
    });
  });

  describe('handleFormSubmission', () => {
    let data;
    beforeEach(() => {
      data = {
        limit: 50000,
        previousLimit: 1000,
        template_id: 'daily-limit-increase',
        campaign_id: 'support-daily-limit-increase',
        reason: 'just because i want'
      };
    });

    it('creates ticket with correct data', async() => {
      wrapper.setState({ showSupportForm: true });
      await instance.handleFormSubmission({ dailyLimit: data.limit, reason: data.reason });
      expect(props.emailRequest).toHaveBeenCalledWith(data);
      expect(wrapper.state().showSupportForm).toBe(false);
    });
  });
});
