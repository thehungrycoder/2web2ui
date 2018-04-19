import { shallow } from 'enzyme';
import React from 'react';

import { ApiKeysDetailsPage } from '../DetailsPage';

let wrapper;

beforeEach(() => {
  const props = {
    loading: false,
    error: null,
    keys: [],
    listGrants: jest.fn(),
    listSubaccountGrants: jest.fn(),
    deleteApiKey: jest.fn(() => Promise.resolve()),
    updateApiKey: jest.fn(() => Promise.resolve()),
    history: { push: jest.fn() },
    listApiKeys: jest.fn(() => []),
    id: 'api-id',
    subaccount: 101,
    showAlert: jest.fn(),
    isReadOnly: false
  };

  wrapper = shallow(<ApiKeysDetailsPage {...props} />);
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
  expect(wrapper.instance().props.listGrants).toHaveBeenCalled();
  expect(wrapper.instance().props.listSubaccountGrants).toHaveBeenCalled();
});

it('should render loading component while loading', () => {
  wrapper.setProps({ loading: true });
  expect(wrapper).toMatchSnapshot();
});

it('should render a redirect when an error is present', () => {
  wrapper.setProps({ error: new Error('oops') });
  expect(wrapper).toMatchSnapshot();
});

it('toggles modal', () => {
  expect(wrapper).toHaveState('showDeleteModal', false);
  wrapper.instance().onToggleDelete();
  expect(wrapper).toHaveState('showDeleteModal', true);
});

it('renders correctly in readonly mode', () => {
  wrapper.setProps({ isReadOnly: true });
  expect(wrapper).toMatchSnapshot();
});


describe('delete', () => {
  it('handles success correctly', async() => {
    await wrapper.instance().handleDelete();
    expect(wrapper.instance().props.deleteApiKey).toHaveBeenCalled();
    expect(wrapper.instance().props.showAlert).toHaveBeenCalledWith({ message: 'API key deleted', type: 'success' });
    expect(wrapper.instance().props.history.push).toHaveBeenCalledWith('/account/api-keys');
  });
});

describe('update', () => {
  it('handles update success correctly', async() => {
    await wrapper.instance().onSubmit({ subaccount: 101, key: 'test' });
    expect(wrapper.instance().props.updateApiKey).toHaveBeenCalledWith({ id: 'api-id', key: 'test', subaccount: 101 });
    expect(wrapper.instance().props.showAlert).toHaveBeenCalledWith({ message: 'API key updated', type: 'success' });
  });
});
