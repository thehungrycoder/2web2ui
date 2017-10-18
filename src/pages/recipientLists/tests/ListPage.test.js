import React from 'react';
import { shallow } from 'enzyme';

import { ListPage } from '../ListPage';

const props = {
  loading: false,
  error: null,
  listRecipientLists: jest.fn(() => []),
  recipientLists: [
    {
      id: 'unique_id_4_graduate_students_list',
      name: 'graduate_students',
      description: 'An email list of graduate students at UMD',
      attributes: {
        internal_id: 112,
        list_group_id: 12321
      },
      total_accepted_recipients: 3
    },
    {
      id: 'unique_id_4_undergraduates',
      name: 'undergraduate_students',
      description: 'An email list of undergraduate students at UMBC',
      attributes: {
        internal_id: 111,
        list_group_id: 11321
      },
      total_accepted_recipients: 8
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
  const emptyprops = {
    loading: false,
    error: null,
    recipientLists: [],
    listRecipientLists: jest.fn(() => [])
  };
  wrapper = shallow(<ListPage {...emptyprops} />);
  expect(wrapper).toMatchSnapshot();
});

it('renders errors when present', () => {
  wrapper.setProps({ payload: { message: 'Uh oh! It broke.' }});
  expect(wrapper).toMatchSnapshot();
});
