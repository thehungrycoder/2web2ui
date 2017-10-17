import { shallow } from 'enzyme';
import React from 'react';

import { ListPage } from '../ListPage';

const props = {
  loading: false,
  error: null,
  count: 30,
  listTemplates: jest.fn(),
  templates: [
    {
      name: 'Temp 1',
    },
    {
      name: 'Temp 2',
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

it('renders empty state', () => {
  wrapper.setProps({ count: 0 });
  expect(wrapper).toMatchSnapshot();
});

it('renders errors when present', () => {
  wrapper.setProps({ error: { message: 'Uh oh! It broke. ' }});
  expect(wrapper).toMatchSnapshot();
});
