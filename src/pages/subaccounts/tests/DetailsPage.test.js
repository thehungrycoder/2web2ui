import { shallow } from 'enzyme';
import React from 'react';

import { DetailsPage } from '../DetailsPage';

// actions
const getSubaccount = jest.fn();
const listPools = jest.fn();
const listApiKeys = jest.fn();
const hideNewApiKey = jest.fn();

const paths = {
  edit: '/account/subaccounts/123',
  keys: '/account/subaccounts/123/api-keys'
};

const tabs = [
  {
    content: 'Details',
    Component: {},
    to: '/account/subaccounts/123'
  },
  {
    content: 'API Keys',
    Component: {},
    to: '/account/subaccounts/123/api-keys'
  }
];

const props = {
  id: '123',
  loading: false,
  subaccount: {
    id: '123',
    name: 'Bob Evans, the restaurant.'
  },
  location: { pathname: '' },
  match: { url: paths.edit },
  tabs,
  getSubaccount,
  listPools,
  listApiKeys,
  hideNewApiKey
};

let wrapper;

beforeEach(() => {
  jest.clearAllMocks();
  wrapper = shallow(<DetailsPage {...props} />);
});

test('componentDidMount', () => {
  expect(getSubaccount).toHaveBeenCalledWith('123');
  expect(listPools).toHaveBeenCalled();
  expect(listApiKeys).toHaveBeenCalled();
  expect(hideNewApiKey).not.toHaveBeenCalled();
});

test('componentDidUnmount', () => {
  wrapper.unmount();
  expect(hideNewApiKey).toHaveBeenCalled();
});

describe('on create scenario', () => {
  it('should show api key banner on new key', () => {
    wrapper.setProps({ newKey: 'my-key' });
    expect(wrapper).toMatchSnapshot();
  });

});

describe('edit path', () => {
  beforeEach(() => {
    wrapper.setProps({ location: { pathname: paths.edit }});
  });

  test('base props', () => {
    expect(wrapper).toMatchSnapshot();
  });

  test('loading', () => {
    wrapper.setProps({ loading: true });
    expect(wrapper).toMatchSnapshot();
  });
});

describe('keys path', () => {
  beforeEach(() => {
    wrapper.setProps({ location: { pathname: paths.keys }});
  });

  test('base props', () => {
    expect(wrapper).toMatchSnapshot();
  });

  test('loading', () => {
    wrapper.setProps({ loading: true });
    expect(wrapper).toMatchSnapshot();
  });
});