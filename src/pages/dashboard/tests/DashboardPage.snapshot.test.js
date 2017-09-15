import { shallow } from 'enzyme';
import React from 'react';

import { DashboardPage } from '../DashboardPage';

const props = {
  currentUser: {
    email_verified: true
  }
};

let wrapper;

beforeEach(() => {
  wrapper = shallow(<DashboardPage {...props} />);
});

it('renders correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

it('renders correctly when user is not verified', () => {
  wrapper.setProps({ currentUser: { email_verfied: false }});
  expect(wrapper).toMatchSnapshot();
});
