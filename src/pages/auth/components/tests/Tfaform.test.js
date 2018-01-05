import { shallow } from 'enzyme';
import React from 'react';

import { TfaForm } from '../TfaForm';

const props = {
  tfaPending: false,
  handleSubmit: jest.fn(),
  error: false
};

let wrapper;

beforeEach(() => {
  wrapper = shallow(<TfaForm {...props} />);
});

it('renders correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

it('renders correctly verifying tfa', () => {
  wrapper.setProps({ tfaPending: true });
  expect(wrapper).toMatchSnapshot();
});

it('calls correct method on submit', () => {
  wrapper.find('form').first().simulate('submit');
  expect(props.handleSubmit).toHaveBeenCalledTimes(1);
});

it('should display error when form submission fails', () => {
  wrapper.setProps({ error: { message: 'tfa failed' }});
  expect(wrapper).toMatchSnapshot();
});
