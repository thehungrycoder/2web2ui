import { shallow } from 'enzyme';
import React from 'react';

import { ListPage } from '../ListPage';

const props = {
  loading: false,
  error: null,
  listApiKeys: jest.fn(() => []),
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
