import { shallow } from 'enzyme';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { Button } from '@sparkpost/matchbox';

import { AuthPage } from '../AuthPage';

const props = {
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
  const auth = { loginPending: true };
  wrapper = shallow(<AuthPage {...props} auth={auth} />);

  expect(wrapper.find(Button).children()).toIncludeText('Logging In');
});

it('renders correctly when there is a login error', () => {
  const auth = { errorDescription: 'uh oh!' };
  wrapper = shallow(<AuthPage {...props} auth={auth} />);

  expect(wrapper.find('.error')).toHaveText('uh oh!');
});

it('redirects when logged in', () => {
  const auth = { loggedIn: true };
  wrapper = shallow(<AuthPage {...props} auth={auth} />);

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
