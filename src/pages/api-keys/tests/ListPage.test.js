import { shallow } from 'enzyme';
import React from 'react';

import { ListPage } from '../ListPage';

const props = {
  loading: false,
  error: null,
  hideNewApiKey: jest.fn(),
  listApiKeys: jest.fn(() => []),
  count: 30,
  keys: [
    {
      label: 'Test Key 1',
      short_key: 'ab01',
      grants: ['metrics/view']
    },
    {
      label: 'Test Key 2',
      short_key: 'fe98',
      grants: ['smtp/inject']
    }
  ]
};

let wrapper;

beforeEach(() => {
  wrapper = shallow(<ListPage {...props} />);
});

it('renders correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

it('renders errors when present', () => {
  wrapper.setProps({ error: { message: 'Uh oh! It broke. ' }});
  expect(wrapper).toMatchSnapshot();
});

it('should show loading component during load', () => {
  wrapper.setProps({ loading: true });
  expect(wrapper).toMatchSnapshot();
});

it('should show api key banner on successful create', () => {
  wrapper.setProps({ newKey: 'my-shiny-new-key' });
  expect(wrapper).toMatchSnapshot();
});

it('should list keys on reload', () => {
  const page = new ListPage();
  page.props = { listApiKeys: jest.fn() };
  page.onReloadApiBanner();
  expect(page.props.listApiKeys).toHaveBeenCalledTimes(1);
});

it('should hide api key on component unmount', () => {
  expect(props.hideNewApiKey).not.toHaveBeenCalled();
  wrapper.unmount();
  expect(props.hideNewApiKey).toHaveBeenCalled();
});
