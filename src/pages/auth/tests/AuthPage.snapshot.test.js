import { shallow } from 'enzyme';
import React from 'react';

import { AuthPage } from '../AuthPage';

const props = {
  auth: {
    loggedIn: false,
    loginPending: false
  },
  tfa: {
    tfaEnabled: false,
    username: 'bertha',
    token: 'tokey-token'
  },
  authenticate: jest.fn(),
  verifyAndLogin: jest.fn()
};

let wrapper;

beforeEach(() => {
  props.ssoCheck = jest.fn(() => Promise.resolve());
  wrapper = shallow(<AuthPage {...props} />);
});

afterEach(() => {
  jest.resetAllMocks();
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

it('should display tfa form when TFA is enabled', () => {
  wrapper.setProps({ tfa: { tfaEnabled: true }});
  expect(wrapper).toMatchSnapshot();
});

it('should verify tfa login on submit', () => {
  const verifySpy = jest.spyOn(wrapper.instance().props, 'verifyAndLogin');
  wrapper.setProps({ tfa: { tfaEnabled: true }});
  wrapper.find('Connect(ReduxForm)').simulate('submit', { code: 'code' });
  expect(verifySpy).toHaveBeenCalled();
});

it('should sso check on submit when sso is enabled', () => {
  const ssoCheckSpy = jest.spyOn(wrapper.instance().props, 'ssoCheck');
  const authSpy = jest.spyOn(wrapper.instance().props, 'authenticate');
  wrapper.setState({ ssoEnabled: true });
  wrapper.find('Connect(ReduxForm)').simulate('submit', { username: 'foo', password: 'pw', rememberMe: false });
  expect(ssoCheckSpy).toHaveBeenCalled();
  expect(authSpy).not.toHaveBeenCalled();
});

it('should authenticate on submit when sso is disabled', () => {
  const ssoCheckSpy = jest.spyOn(wrapper.instance().props, 'ssoCheck');
  const authSpy = jest.spyOn(wrapper.instance().props, 'authenticate');
  wrapper.setState({ ssoEnabled: false });
  wrapper.find('Connect(ReduxForm)').simulate('submit', { username: 'foo', password: 'pw', rememberMe: false });
  expect(authSpy).toHaveBeenCalled();
  expect(ssoCheckSpy).not.toHaveBeenCalled();

});

it('should redirect to sso if there is a sso user', () => {
  const redirectSpy = jest.spyOn(wrapper.instance(), 'redirectToSSO');
  wrapper.setProps({ auth: { ssoUser: 'foo-bar' }});
  expect(redirectSpy).toHaveBeenCalled();
});

it('should set sso enabled if there ssoUser is null', () => {
  const redirectSpy = jest.spyOn(wrapper.instance(), 'redirectToSSO');
  wrapper.setProps({ auth: { ssoUser: null }});
  expect(wrapper.state().ssoEnabled).toEqual(false);
  expect(redirectSpy).not.toHaveBeenCalled();
});

