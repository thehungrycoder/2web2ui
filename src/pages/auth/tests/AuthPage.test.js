import { shallow } from 'enzyme';
import React from 'react';
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
