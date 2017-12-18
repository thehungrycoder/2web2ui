import { shallow } from 'enzyme';
import React from 'react';

import { RegisterPage } from '../RegisterPage';

// actions
const checkInviteToken = jest.fn();
const registerUser = jest.fn(() => Promise.resolve());

const props = {
  token: 'tokerino',
  loggedIn: false,
  invite: {
    error: null,
    from: 'jose@zamora.io',
    email: 'appteam@sparkpost.com'
  },
  loading: false,
  checkInviteToken,
  registerUser
};

let wrapper;

beforeEach(() => {
  jest.clearAllMocks();
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
  wrapper.setProps({ loggedIn: true });
  expect(wrapper).toMatchSnapshot();
});

test('token expired', () => {
  const error = { message: 'n0o0o0o0' };
  wrapper.setProps({ invite: { error }});
  expect(wrapper).toMatchSnapshot();
});

describe('onSubmit', () => {
  const values = ['some', 'values'];

  test('success', async() => {
    await wrapper.instance().onSubmit(values);
    expect(registerUser).toHaveBeenCalledWith(props.token, values);
  });

  test('fail', async() => {
    const error = { message: 'n0o0o0o0' };
    registerUser.mockReturnValue(Promise.reject(error));
    await wrapper.instance().onSubmit(values);
    expect(registerUser).toHaveBeenCalledWith(props.token, values);
  });

});
