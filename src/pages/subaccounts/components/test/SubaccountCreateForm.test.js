import { shallow } from 'enzyme';
import React from 'react';

import { SubaccountCreateForm } from '../SubaccountCreateForm';

const handleSubmit = jest.fn();

const props = {
  grants: ['subaccount grants'],
  showGrants: false,
  createApiKey: false,
  ipPools: [],
  handleSubmit
};

let wrapper;

beforeEach(() => {
  jest.clearAllMocks();
  wrapper = shallow(<SubaccountCreateForm {...props} />);
});

test('base case', () => {
  expect(wrapper).toMatchSnapshot();
});

test('api key form', () => {
  wrapper.setProps({ createApiKey: true });
  expect(wrapper).toMatchSnapshot();
});

test('has ip pools', () => {
  wrapper.setProps({ ipPools: ['salt water']});
  expect(wrapper).toMatchSnapshot();
});

test('ip pools checked ', () => {
  wrapper.setProps({ ipPools: ['swimmin']});
  expect(wrapper).toMatchSnapshot();
});

it('submits correctly', () => {
  wrapper.find('form').simulate('submit');
  expect(handleSubmit).toHaveBeenCalled();
  wrapper.setProps({ submitting: true });
  expect(wrapper).toMatchSnapshot();
});
