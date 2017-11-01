import { shallow } from 'enzyme';
import React from 'react';

import { SubaccountForm } from '../SubaccountForm';

const props = {
  grants: ['subaccount grants'],
  showGrants: false,
  createApiKey: false,
  ipPools: [],
  handleSubmit: jest.fn()
};

let wrapper;

beforeEach(() => {
  wrapper = shallow(<SubaccountForm {...props} />);
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
  const submitSpy = jest.spyOn(wrapper.instance().props, 'handleSubmit');
  wrapper.find('form').simulate('submit');
  expect(submitSpy).toHaveBeenCalled();
  wrapper.setProps({ submitting: true });
  expect(wrapper).toMatchSnapshot();
});
