import { shallow } from 'enzyme';
import React from 'react';

import { LoginForm } from '../LoginForm';

const props = {
  ssoEnabled: false,
  loginPending: false,
  handleSubmit: jest.fn()
};

let wrapper;

beforeEach(() => {
  wrapper = shallow(<LoginForm {...props} />);
});

it('renders correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

it('renders correctly when logging in', () => {
  wrapper.setProps({ loginPending: true });
  expect(wrapper).toMatchSnapshot();
});

it('renders correctly when ssoEnabled is true', () => {
  wrapper.setProps({ ssoEnabled: true });
  expect(wrapper).toMatchSnapshot();
});

it('calls correct method on submit', () => {
  wrapper.find('form').first().simulate('submit');
  expect(props.handleSubmit).toHaveBeenCalledTimes(1);
});

