import { shallow } from 'enzyme';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { Button } from '@sparkpost/matchbox';

import { AuthPage } from '../AuthPage';

export const props = {
  auth: {
    loggedIn: false,
    loginPending: false
  },
  authenticate: jest.fn()
};

let wrapper;

beforeEach(() => {
  wrapper = shallow(<AuthPage {...props} />);
});

it('renders correctly', () => {
  expect(wrapper.find(Redirect)).not.toBePresent();

  expect(wrapper.find('.error')).not.toBePresent();

  expect(wrapper.find('#username')).toHaveValue('');
  expect(wrapper.find('#password')).toHaveValue('');
  expect(wrapper.find('#rememberMe')).not.toBeChecked();
  expect(wrapper.find(Button).children()).toHaveText('Log In');
});

it('renders correctly when logging in', () => {
  wrapper.setProps({ auth: { loginPending: true }});

  expect(wrapper.find(Button).children()).toIncludeText('Logging In');
});

it('renders correctly when there is a login error', () => {
  wrapper.setProps({ auth: { errorDescription: 'uh oh!' }});

  expect(wrapper.find('.error')).toHaveText('uh oh!');
});

it('redirects when logged in', () => {
  wrapper.setProps({ auth: { loggedIn: true }});

  expect(wrapper.find(Redirect)).toBePresent();
});

it('properly handles state changes', () => {
  wrapper
    .find('#username')
    .simulate('change', { target: { value: 'ricksanchez' }});

  expect(wrapper.find('#username')).toHaveValue('ricksanchez');

  wrapper
    .find('#password')
    .simulate('change', { target: { value: 'wubba lubba dub dub' }});

  expect(wrapper.find('#password')).toHaveValue('wubba lubba dub dub');

  wrapper.find('#rememberMe').simulate('change', { target: { checked: true }});
  expect(wrapper.find('#rememberMe')).toBeChecked();
});

it('submits correctly', () => {
  wrapper.setState({
    username: 'birdperson',
    password: 'i am in great pain, please help me'
  });

  wrapper.find(Button).simulate('click', { preventDefault: jest.fn() });

  expect(props.authenticate).toHaveBeenCalledWith(
    'birdperson',
    'i am in great pain, please help me',
    false
  );
});
