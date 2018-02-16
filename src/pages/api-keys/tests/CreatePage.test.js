import { shallow } from 'enzyme';
import React from 'react';

import { CreatePage } from '../CreatePage';
let wrapper;

beforeEach(() => {
  const props = {
    loading: false,
    error: null,
    listGrants: jest.fn(),
    listSubaccountGrants: jest.fn(),
    createApiKey: jest.fn(() => Promise.resolve()),
    history: { push: jest.fn() },
    showAlert: jest.fn()
  };

  wrapper = shallow(<CreatePage {...props} />);
});

afterEach(() => {
  jest.resetAllMocks();
});

it('renders correctly with no subaccounts', () => {
  expect(wrapper.instance().props.listGrants).toHaveBeenCalled();
  expect(wrapper.instance().props.listSubaccountGrants).not.toHaveBeenCalled();
  expect(wrapper).toMatchSnapshot();
});

it('renders correctly with subaccounts', () => {
  wrapper.setProps({ hasSubaccounts: true });
  wrapper.instance().componentDidMount();
  expect(wrapper.instance().props.listSubaccountGrants).toHaveBeenCalled();
});

it('should show loading component while loading', () => {
  wrapper.setProps({ loading: true });
  expect(wrapper).toMatchSnapshot();
});

it('submits correctly', async() => {
  await wrapper.instance().onSubmit('test');
  expect(wrapper.instance().props.createApiKey).toHaveBeenCalledWith('test');
  expect(wrapper.instance().props.showAlert).toHaveBeenCalledWith({ type: 'success', message: 'API key created' });
  expect(wrapper.instance().props.history.push).toHaveBeenCalledWith('/account/api-keys');
});

it('submits handles error', async() => {
  wrapper.setProps({ createApiKey: jest.fn(() => Promise.reject({ message: 'error' })) });
  await wrapper.instance().onSubmit('test');
  expect(wrapper.instance().props.createApiKey).toHaveBeenCalledWith('test');
  expect(wrapper.instance().props.showAlert).toHaveBeenCalledWith({ type: 'error', message: 'Could not create API key', details: 'error' });
  expect(wrapper.instance().props.history.push).not.toHaveBeenCalledWith();
});
