import { shallow } from 'enzyme';
import React from 'react';

import { AuthPage } from '../AuthPage';

const props = {
  auth: {
    loggedIn: false,
    loginPending: false
  },
  tfa: {
    tfaEnabled: false
  },
  authenticate: jest.fn()
};

let wrapper;

beforeEach(() => {
  wrapper = shallow(<AuthPage {...props} />);
});

it('renders correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

it('renders correctly when there is a login error', () => {
  wrapper.setProps({ auth: { errorDescription: 'uh oh!' }});
  expect(wrapper).toMatchSnapshot();
});

it('redirects when logged in', () => {
  wrapper.setProps({ auth: { loggedIn: true }});
  expect(wrapper).toMatchSnapshot();
});
