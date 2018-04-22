import { shallow } from 'enzyme';
import React from 'react';

import { ApiKeysDetailsPage } from '../DetailsPage';

let wrapper;
let props;
beforeEach(() => {
  props = {
    apiKey: {
      id: 'id1',
      username: 'johndoe'
    },
    loading: false,
    keys: [],
    listGrants: jest.fn(),
    listApiKeys: jest.fn(() => []),
    showAlert: jest.fn(),
    isReadOnly: false
  };

  wrapper = shallow(<ApiKeysDetailsPage {...props} />);
});

afterEach(() => {
  jest.resetAllMocks();
});

it('renders ready only mode correctly', () => {
  wrapper.setProps({ isReadOnly: true });
  expect(wrapper).toMatchSnapshot();
});

it('fetches api keys when store not populated', () => {
  wrapper.instance().componentDidMount();
  expect(wrapper.instance().props.listApiKeys).toHaveBeenCalled();
});

it('does not fetch api keys when store not populated', () => {
  props.listApiKeys.mockReset();
  wrapper.setProps({ keys: [{ id: 'key 1' }]});
  wrapper.instance().componentDidMount();
  expect(wrapper.instance().props.listApiKeys).not.toHaveBeenCalled();
});

it('should render loading component while loading', () => {
  wrapper.setProps({ loading: true });
  expect(wrapper).toMatchSnapshot();
});

it('should render not found pane when api key can not be found', () => {
  wrapper.setProps({ apiKey: {}});
  expect(wrapper).toMatchSnapshot();
});


