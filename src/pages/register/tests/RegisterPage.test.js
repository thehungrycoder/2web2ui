import { shallow } from 'enzyme';
import React from 'react';
import * as ErrorTracker from 'src/helpers/errorTracker';
import { RegisterPage } from '../RegisterPage';
import { ENABLE_TFA_AUTH_ROUTE, DEFAULT_REDIRECT_ROUTE } from 'src/constants';

// mocks
const checkInviteToken = jest.fn();
const registerUser = jest.fn(() => Promise.resolve());
const authenticate = jest.fn().mockResolvedValue({
  auth: true,
  tfaRequired: false
});
const historyPush = jest.fn();
const report = jest.fn();

ErrorTracker.default = { report };

describe('Page: RegisterPage', () => {

  const props = {
    token: 'tokerino',
    invite: {
      error: null,
      from: 'jose@example.com',
      email: 'newperson@example.com'
    },
    loading: false,
    history: {
      push: historyPush
    },
    checkInviteToken,
    registerUser,
    authenticate
  };

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<RegisterPage {...props} />);
  });

  test('happy path render', () => {
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

    test('success', async () => {
      await wrapper.instance().onSubmit(values);
      expect(registerUser).toHaveBeenCalledWith(props.token, values);
      expect(authenticate).toHaveBeenCalledWith(values.username, values.password);
      expect(historyPush).toHaveBeenCalledWith(DEFAULT_REDIRECT_ROUTE);
    });

    test('tfa required', async () => {
      authenticate.mockResolvedValue({
        auth: true,
        tfaRequired: true
      });
      await wrapper.instance().onSubmit(values);
      expect(historyPush).toHaveBeenCalledWith(ENABLE_TFA_AUTH_ROUTE);
    });

    test('authenticate user fail', async () => {
      const error = { message: 'n0o0o0o0' };
      authenticate.mockReturnValue(Promise.reject(error));
      await wrapper.instance().onSubmit(values);
      expect(registerUser).toHaveBeenCalledWith(props.token, values);
      expect(historyPush).toHaveBeenCalledWith('/auth');
      expect(report).toHaveBeenCalledWith('sign-in', error);
    });

    test('register user fail', async () => {
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
