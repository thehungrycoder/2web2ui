import { shallow } from 'enzyme';
import React from 'react';
import * as ErrorTracker from 'src/helpers/errorTracker';
import { RegisterPage } from '../RegisterPage';
import { DEFAULT_REDIRECT_ROUTE } from 'src/constants';

// mocks
const checkInviteToken = jest.fn();
const registerUser = jest.fn(() => Promise.resolve());
const logout = jest.fn();
const authenticate = jest.fn(() => Promise.resolve());
const historyPush = jest.fn();
const report = jest.fn();

ErrorTracker.default = { report };

describe('Page: RegisterPage', () => {

  const props = {
    token: 'tokerino',
    invite: {
      error: null,
      from: 'jose@zamora.io',
      email: 'appteam@sparkpost.com'
    },
    loading: false,
    history: {
      push: historyPush
    },
    checkInviteToken,
    registerUser,
    logout,
    authenticate
  };

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<RegisterPage {...props} />);
  });

  test('happy path render', () => {
    expect(logout).toHaveBeenCalled();
    expect(checkInviteToken).toHaveBeenCalledWith(props.token);
    expect(wrapper).toMatchSnapshot();
  });

  test('loading', () => {
    wrapper.setProps({ loading: true });
    expect(wrapper).toMatchSnapshot();
  });

  test('no token', () => {
    wrapper.setProps({ token: undefined });
    expect(wrapper).toMatchSnapshot();
  });

  test('token expired', () => {
    const error = { message: 'n0o0o0o0' };
    wrapper.setProps({ invite: { error }});
    expect(wrapper).toMatchSnapshot();
  });

  describe('onSubmit', () => {
    const values = {
      username: 'some',
      password: 'values'
    };

    test('success', async() => {
      await wrapper.instance().onSubmit(values);
      expect(registerUser).toHaveBeenCalledWith(props.token, values);
      expect(authenticate).toHaveBeenCalledWith(values.username, values.password);
      expect(historyPush).toHaveBeenCalledWith(DEFAULT_REDIRECT_ROUTE);
    });

    test('authenticate user fail', async() => {
      const error = { message: 'n0o0o0o0' };
      authenticate.mockReturnValue(Promise.reject(error));
      await wrapper.instance().onSubmit(values);
      expect(registerUser).toHaveBeenCalledWith(props.token, values);
      expect(historyPush).toHaveBeenCalledWith('/auth');
      expect(report).toHaveBeenCalledWith('sign-in', error);
    });

    test('register user fail', async() => {
      const error = { message: 'n0o0o0o0' };
      registerUser.mockReturnValue(Promise.reject(error));
      await wrapper.instance().onSubmit(values);
      expect(registerUser).toHaveBeenCalledWith(props.token, values);
      expect(authenticate).not.toHaveBeenCalled();
      expect(historyPush).not.toHaveBeenCalled();
      expect(report).toHaveBeenCalledWith('register-user', error);
    });

  });

});
