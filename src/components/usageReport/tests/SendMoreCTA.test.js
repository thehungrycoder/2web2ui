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
      openSupportTicket: jest.fn()
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
    expect(wrapper).toMatchSnapshot();
  });

  it('togles support ticket form correctly', () => {
    wrapper.setProps({ allowSendingLimitRequest: true });
    wrapper.find('UnstyledLink').at(0).simulate('click');
    expect(props.openSupportTicket).toHaveBeenCalledWith({ issueId: 'daily_limits' });
  });

  describe('resendVerification', () => {
    it('renders verifying state', () => {
      wrapper.setProps({ verifyingEmail: true, currentUser: { email_verified: false }});
      expect(wrapper.find('span').text()).toEqual('Resending a verification email... ');
    });

    it('re-sends verification email and shows alert', async () => {
      await instance.resendVerification();
      expect(props.verifyEmail).toHaveBeenCalled();
      expect(props.showAlert).toHaveBeenCalled();
    });
  });
});
