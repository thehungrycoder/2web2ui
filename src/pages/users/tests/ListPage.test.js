import cases from 'jest-in-case';
import React from 'react';
import { shallow } from 'enzyme';
import { ListPage } from '../ListPage';

const TEST_CASES = {
  'renders table and hidden modal': {
    loading: false,
    listUsers: jest.fn(),
    users: [
      { name: 'Test User 1', access: 'admin', email: 'user1@test.com' },
      { name: 'Test User 2', access: 'admin', email: 'user2@test.com' }
    ]
  },
  'renders error banner, table, and hidden modal': {
    error: {
      message: 'Uh oh! It broke.' // renders as details
    },
    listUsers: jest.fn(),
    users: [],
    loading: false
  }
};

cases('Users list page', (props) => {
  const wrapper = shallow(<ListPage {...props} />);
  expect(wrapper).toMatchSnapshot();
}, TEST_CASES);
