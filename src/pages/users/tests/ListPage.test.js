import { shallow } from 'enzyme';
import React from 'react';

import { ListPage } from '../ListPage';

const props = {
  error: null,
  loading: false,
  users: [
    { name: 'Test User 1', access: 'admin', email: 'user1@test.com' },
    { name: 'Test User 2', access: 'admin', email: 'user2@test.com' },
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
