import { shallow } from 'enzyme';
import React from 'react';

import { CreatePage } from '../CreatePage';

const props = {
  loading: false,
  error: null,
  listGrants: jest.fn(),
  listSubaccountGrants: jest.fn(),
  listSubaccounts: jest.fn(),
  createApiKey: jest.fn(() => Promise.resolve()),
  history: { push: jest.fn() }
};

let wrapper;

beforeEach(() => {
  wrapper = shallow(<CreatePage {...props} />)
})

it('renders correctly with no subaccounts', () => {
  const grantsSpy = jest.spyOn(wrapper.instance().props, 'listGrants');
  const subaccountGrantsSpy = jest.spyOn(wrapper.instance().props, 'listSubaccountGrants');
  const subaccountSpy = jest.spyOn(wrapper.instance().props, 'listSubaccounts');

  expect(grantsSpy).toHaveBeenCalled();
  expect(subaccountGrantsSpy).not.toHaveBeenCalled();
  expect(subaccountSpy).not.toHaveBeenCalled();
  expect(wrapper).toMatchSnapshot();
});

it('renders correctly with subaccounts', () => {
  wrapper.setProps({ hasSubaccounts: true });
  const subaccountGrantsSpy = jest.spyOn(wrapper.instance().props, 'listSubaccountGrants');
  const subaccountSpy = jest.spyOn(wrapper.instance().props, 'listSubaccounts');

  wrapper.instance().componentDidMount();
  expect(subaccountGrantsSpy).toHaveBeenCalled();
  expect(subaccountSpy).toHaveBeenCalled();
});

it('submits correctly', () => {
  const spy = jest.spyOn(wrapper.instance().props, 'createApiKey');
  wrapper.instance().onSubmit('test');
  expect(spy).toHaveBeenCalledWith('test');
});
