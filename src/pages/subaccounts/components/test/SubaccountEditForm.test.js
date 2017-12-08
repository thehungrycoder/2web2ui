import { shallow } from 'enzyme';
import React from 'react';

import { SubaccountEditForm } from '../SubaccountEditForm';

const handleSubmit = jest.fn();

const props = {
  submitting: false,
  pristine: true,
  compliance: false,
  ipPools: ['an array of ip pools'],
  handleSubmit
};

let wrapper;

beforeEach(() => {
  jest.clearAllMocks();
  wrapper = shallow(<SubaccountEditForm {...props} />);
});

test('base case', () => {
  expect(wrapper).toMatchSnapshot();
});

test('no ip pools', () => {
  wrapper.setProps({ ipPools: []});
  expect(wrapper).toMatchSnapshot();
});

test('cancel button', () => {
  wrapper.setProps({ pristine: false });
  expect(wrapper).toMatchSnapshot();
});

it('submits correctly', () => {
  wrapper.find('form').simulate('submit');
  expect(handleSubmit).toHaveBeenCalled();
  wrapper.setProps({ submitting: true });
  expect(wrapper).toMatchSnapshot();
});

it('should disable all fields when compliance is true', () => {
  wrapper.setProps({ compliance: true });
  expect(wrapper).toMatchSnapshot();
});

