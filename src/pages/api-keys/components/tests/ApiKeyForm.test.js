import { shallow } from 'enzyme';
import React from 'react';

import { ApiKeyForm } from '../ApiKeyForm';

const props = {
  error: null,
  grants: ['all grants'],
  subaccountGrants: ['subaccount grants'],
  hasSubaccounts: false,
  showSubaccountGrants: false,
  isNew: true,
  handleSubmit: jest.fn()
};

let wrapper;

beforeEach(() => {
  wrapper = shallow(<ApiKeyForm {...props} />);
})

it('renders correctly - new and no subaccounts', () => {
  expect(wrapper).toMatchSnapshot();
});

it('renders correctly - update and subaccounts', () => {
  wrapper.setProps({ isNew: false, hasSubaccounts: true, showSubaccountGrants: true });
  expect(wrapper).toMatchSnapshot();
});

it('submits correctly', () => {
  const submitSpy = jest.spyOn(wrapper.instance().props, 'handleSubmit');
  wrapper.find('form').simulate('submit');
  expect(submitSpy).toHaveBeenCalled();
  wrapper.setProps({ submitting: true });
  expect(wrapper).toMatchSnapshot();
});
