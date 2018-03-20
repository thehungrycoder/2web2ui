import { shallow } from 'enzyme';
import React from 'react';
import dateMock from 'date-fns';
import ListPage from '../ListPage';

jest.mock('date-fns');

const props = {
  loading: false,
  error: null,
  count: 30,
  listTemplates: jest.fn(),
  hasSubaccounts: false,
  templates: [
    {
      name: 'Temp 1'
    },
    {
      name: 'Temp 2'
    }
  ],
  canModify: true
};

let wrapper;

beforeEach(() => {
  dateMock.format = jest.fn((a) => a);
  wrapper = shallow(<ListPage {...props} />);
});

afterEach(() => {
  jest.resetAllMocks();
});

it('renders correctly', () => {
  expect(wrapper).toMatchSnapshot();
  expect(props.listTemplates).toHaveBeenCalled();
});

it('renders without primary action for read-only users', () => {
  wrapper.setProps({ canModify: false });
  expect(wrapper).toMatchSnapshot();
});

it('renders columns correctly with subaccounts', () => {
  wrapper.setProps({ hasSubaccounts: true });
  expect(wrapper.find('TableCollection').props().columns).toMatchSnapshot();
});

it('renders rows correctly with subaccounts', () => {
  const rows = [
    {
      published: true,
      id: 'id1',
      name: 'subaccount template',
      last_update_time: '2017-08-10T14:15:16+00:00',
      subaccount_id: 101,
      shared_with_subaccounts: false
    },
    {
      published: false,
      id: 'id2',
      name: 'shared template',
      last_update_time: '2017-08-10T14:15:16+00:00',
      shared_with_subaccounts: true
    },
    {
      published: false,
      id: 'id3',
      name: 'master template',
      last_update_time: '2017-08-10T14:15:16+00:00'
    }
  ];

  wrapper.setProps({ hasSubaccounts: true });
  const rowData = rows.map(wrapper.instance().getRowData);
  expect(rowData).toMatchSnapshot();
});

it('renders rows correctly with NO subaccounts', () => {
  const rows = [
    {
      published: true,
      id: 'id3',
      name: 'no subs template',
      last_update_time: '2017-08-10T14:15:16+00:00'
    }
  ];

  const rowData = rows.map(wrapper.instance().getRowData);
  expect(rowData).toMatchSnapshot();
});

it('renders empty state', () => {
  wrapper.setProps({ count: 0 });
  expect(wrapper.dive('Page')).toMatchSnapshot();
});

it('renders Loading', () => {
  wrapper.setProps({ loading: true });
  expect(wrapper.find('Loading')).toHaveLength(1);
});

it('renders errors when present', () => {
  wrapper.setProps({ error: { message: 'Uh oh! It broke. ' }});
  expect(wrapper.find('ApiErrorBanner')).toMatchSnapshot();
});
