import { shallow } from 'enzyme';
import React from 'react';

import { AuthPage } from '../AuthPage';
import LoginForm from '../components/LoginForm';
import TfaForm from '../components/TfaForm';
import { DEFAULT_REDIRECT_ROUTE } from 'src/constants';

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
  history: {
    push: jest.fn()
  }
};

let wrapper;

beforeEach(() => {
  props.ssoCheck = jest.fn(() => Promise.resolve());
  props.verifyAndLogin = jest.fn(() => Promise.resolve());
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
  expect(props.history.push).toHaveBeenCalledWith(DEFAULT_REDIRECT_ROUTE);
});

it('should display tfa form when TFA is enabled', () => {
  wrapper.setProps({ tfa: { tfaEnabled: true }});
  expect(wrapper).toMatchSnapshot();
});

it('should verify tfa login on submit', () => {
  const authPage = wrapper.instance();
  const verifySpy = jest.spyOn(authPage.props, 'verifyAndLogin');
  authPage.tfaSubmit({ code: 'code' });
  expect(verifySpy).toHaveBeenCalled();
});

it('should throw a submission error when verifyAndLogin fails with 4xx error', () => {
  const authPage = wrapper.instance();
  authPage.props.verifyAndLogin.mockImplementation(() => Promise.reject({ response: { status: 400 }}));
  return authPage.tfaSubmit({ code: 'code' }).catch((err) => {
    expect(err.errors.code).toEqual('The code is invalid');
  });
});

it('should not throw an error when verifySpy fails with non 4xx error', async() => {
  const authPage = wrapper.instance();
  authPage.props.verifyAndLogin.mockImplementation(() => Promise.reject({ response: { status: 500 }}));
  await expect(authPage.tfaSubmit({ code: 'code' })).resolves.toBeUndefined();
});

it('should bind tfaSubmit to the submit handler of TfaForm', () => {
  wrapper.setProps({ tfa: { tfaEnabled: true }});
  const tfaForm = wrapper.find(TfaForm);
  expect(tfaForm.props().onSubmit).toBe(wrapper.instance().tfaSubmit);
});

it('should bind loginSubmit to the submit handler of LoginForm', () => {
  const loginForm = wrapper.find(LoginForm);
  expect(loginForm.props().onSubmit).toBe(wrapper.instance().loginSubmit);
});

it('should sso check on submit when sso is enabled', () => {
  const authPage = wrapper.instance();
  const ssoCheckSpy = jest.spyOn(authPage.props, 'ssoCheck');
  const authSpy = jest.spyOn(authPage.props, 'authenticate');
  wrapper.setState({ ssoEnabled: true });
  authPage.loginSubmit({ username: 'foo', password: 'pw', rememberMe: false });
  expect(ssoCheckSpy).toHaveBeenCalled();
  expect(authSpy).not.toHaveBeenCalled();
});

it('should authenticate on submit when sso is disabled', () => {
  const authPage = wrapper.instance();
  const ssoCheckSpy = jest.spyOn(authPage.props, 'ssoCheck');
  const authSpy = jest.spyOn(authPage.props, 'authenticate');
  wrapper.setState({ ssoEnabled: false });
  authPage.loginSubmit({ username: 'foo', password: 'pw', rememberMe: false });
  expect(ssoCheckSpy).not.toHaveBeenCalled();
  expect(authSpy).toHaveBeenCalled();
});

it('should redirect to sso if there is a sso user', () => {
  const redirectSpy = jest.spyOn(window.location, 'assign').mockImplementation();
  wrapper.setProps({ auth: { ssoUser: 'foo-bar' }});
  expect(redirectSpy).toHaveBeenCalledWith(expect.stringMatching(/saml\/login$/));
});

it('should set sso enabled if there ssoUser is null', () => {
  wrapper.setProps({ auth: { ssoUser: null }});
  expect(wrapper.state().ssoEnabled).toBeFalsy();
});
