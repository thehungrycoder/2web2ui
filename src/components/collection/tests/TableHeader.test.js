import React from 'react';
import { shallow } from 'enzyme';

import TableHeader from '../TableHeader';

let props;
let wrapper;

describe('Component: TableHeader', () => {
  const simpleColumns = ['one', 'two'];
  const complexColumns = [
    'Simple Column',
    { label: 'Recipient', sortKey: 'recipient' },
    { label: 'Type', sortKey: 'type', width: '18%' },
    { label: 'Source', width: '20%' }
  ];

  props = {
    columns: simpleColumns,
    sortColumn: 'recipient',
    sortDirection: 'asc',
    onSort: jest.fn()
  };

  beforeEach(() => {
    wrapper = shallow(<TableHeader {...props} />);
  });

  it('renders header correctly with string only column names', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('renders header correctly with complex column config', () => {
    wrapper.setProps({ columns: complexColumns });
    expect(wrapper).toMatchSnapshot();
  });

  it('handles sorting correctly', () => {
    wrapper.setProps({ columns: complexColumns });

    wrapper.find('UnstyledLink').first().simulate('click'); // click recipient column
    expect(props.onSort).toHaveBeenCalledTimes(1);
    expect(props.onSort).toHaveBeenCalledWith('recipient', 'desc');

    wrapper.setProps({ sortDirection: 'desc' });
    wrapper.find('UnstyledLink').first().simulate('click'); // clicks same (recipient) column again
    expect(props.onSort).toHaveBeenCalledTimes(2);
    expect(props.onSort).toHaveBeenCalledWith('recipient', 'asc');

    wrapper.setProps({ sortDirection: 'desc' });
    wrapper.find('UnstyledLink').last().simulate('click'); // click type column
    expect(props.onSort).toHaveBeenCalledTimes(3);
    expect(props.onSort).toHaveBeenCalledWith('type', 'asc');
  });
});
