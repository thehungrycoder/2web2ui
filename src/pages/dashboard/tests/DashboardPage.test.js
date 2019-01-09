import { shallow } from 'enzyme';
import React from 'react';

import { DashboardPage } from '../DashboardPage';

describe('Page: Dashboard tests', () => {
  const mockDate = new Date('2018-05-15T12:00:00.000Z');

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
      status: 'active',
      created: mockDate
    },
    hasSuppressions: true,
    accountAgeInWeeks: 0,
    verifyingEmail: false,
    accountAgeInDays: 15
  };

  let wrapper;

  beforeEach(() => {
    global.Date.now = jest.fn(() => mockDate.getTime());
    wrapper = shallow(<DashboardPage {...props} />);
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
});
