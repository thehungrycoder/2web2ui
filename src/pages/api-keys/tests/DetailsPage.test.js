import { shallow } from 'enzyme';
import React from 'react';

import { ApiKeysDetailsPage } from '../DetailsPage';

const props = {
  loading: false,
  error: null,
  listApiKeys: jest.fn(),
  listGrants: jest.fn(),
  listSubaccountGrants: jest.fn(),
  listSubaccounts: jest.fn(),
  deleteApiKey: jest.fn(() => Promise.resolve()),
  updateApiKey: jest.fn(() => Promise.resolve()),
  history: { push: jest.fn() }
};

let wrapper;

beforeEach(() => {
  wrapper = shallow(<ApiKeysDetailsPage {...props} />);
});

it('renders correctly with no subaccounts', () => {
  const grantsSpy = jest.spyOn(wrapper.instance().props, 'listGrants');
  const listKeysSpy = jest.spyOn(wrapper.instance().props, 'listApiKeys');
  const subaccountGrantsSpy = jest.spyOn(wrapper.instance().props, 'listSubaccountGrants');
  const subaccountSpy = jest.spyOn(wrapper.instance().props, 'listSubaccounts');

  expect(grantsSpy).toHaveBeenCalled();
  expect(listKeysSpy).toHaveBeenCalled();
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

it('toggles modal', () => {
  expect(wrapper).toHaveState('showDeleteModal', false);
  wrapper.instance().onToggleDelete();
  expect(wrapper).toHaveState('showDeleteModal', true);
});

it('deletes correctly', () => {
  const spy = jest.spyOn(wrapper.instance().props, 'deleteApiKey');
  wrapper.instance().onDelete();
  expect(spy).toHaveBeenCalled();
});

it('submits correctly', () => {
  const spy = jest.spyOn(wrapper.instance().props, 'updateApiKey');
  wrapper.instance().onSubmit('test');
  expect(spy).toHaveBeenCalledWith('test');
});
