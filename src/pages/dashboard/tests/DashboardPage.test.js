import { shallow } from 'enzyme';
import React from 'react';

import { DashboardPage } from '../DashboardPage';

describe('Page: Dashboard tests', () => {
  const props = {
    currentUser: {
      email_verified: true
    },
    checkSuppression: jest.fn(() => []),
    listSendingDomains: jest.fn(() => []),
    listApiKeys: jest.fn(() => []),
    account: {
      subscription: {
        code: 'paid'
      },
      status: 'active'
    },
    hasSuppressions: true,
    accountAgeInWeeks: 0,
    showAlert: jest.fn(),
    verifyingEmail: false,
    verifyEmail: jest.fn(() => Promise.resolve())
  };

  let wrapper;
  let instance;

  beforeEach(() => {
    wrapper = shallow(<DashboardPage {...props} />);
    instance = wrapper.instance();
  });

  it('should render page correctly with defaults', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should correctly render page when user is not verified', () => {
    wrapper.setProps({ currentUser: { email_verfied: false }});
    expect(wrapper).toMatchSnapshot();
  });

  it('should render import suppression list when 0 suppressions and new account', () => {
    wrapper.setProps({ hasSuppressions: false, accountAgeInWeeks: 40 });
    expect(wrapper).toMatchSnapshot();
  });

  it('should display upgrade CTA when account is free and active', () => {
    wrapper.setProps({ account: { subscription: { code: 'free' }, status: 'active' }});
    expect(wrapper).toMatchSnapshot();
  });

  it('should show success alert on successful email verification', async() => {
    await instance.resendVerification();
    expect(instance.props.showAlert).toHaveBeenCalledWith({
      type: 'success',
      message: 'Please click the link in the email we sent you to verify your email.'
    });
  });
});
