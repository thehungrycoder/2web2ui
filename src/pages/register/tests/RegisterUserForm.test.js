import { shallow } from 'enzyme';
import React from 'react';

import { RegisterUserForm } from '../RegisterUserForm';

// actions
const handleSubmit = jest.fn();

const props = {
  handleSubmit,
  submitting: false
};

let wrapper;

beforeEach(() => {
  wrapper = shallow(<RegisterUserForm {...props} />);
});

test('render', () => {
  expect(wrapper).toMatchSnapshot();
});

test('submitting', () => {
  wrapper.setProps({ submitting: true });
  expect(wrapper).toMatchSnapshot();
});
