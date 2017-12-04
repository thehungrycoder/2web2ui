import React from 'react';
import { Table } from '../Table';
import { shallow, mount } from 'enzyme';
import _ from 'lodash';

describe('Summary Table ', () => {

  let wrapper;

  const props = {
    addFilter: jest.fn(),
    getTableData: jest.fn(),
    refresh: jest.fn(),
    metrics: [
      { key: 'metric_1' },
      { key: 'metric_2', unit: 'millisecond' }
    ],
    groupBy: 'domain',
    typeaheadCache: [
      { type: 'Subaccount', id: 555, value: 'sub 1 name'},
    ],
    tableData: [],
    tableLoading: false,
    hasSubaccounts: false
  }

  const data = [
    { subaccount_id: 0, metric_1: 123, metric_2: 12345 },
    { subaccount_id: 555, metric_1: 123, metric_2: 12345 },
    { subaccount_id: 1010, metric_1: 123, metric_2: 12345 },
  ];

  beforeEach(() => {
    wrapper = shallow(<Table {...props} />);
  });

  it('should render with no data', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render with data', () => {
    wrapper.setProps({ tableData: data });
    expect(wrapper.find('TableCollection')).toMatchSnapshot();
  });

  it('should render loading', () => {
    wrapper.setProps({ tableLoading: true });
    expect(wrapper.find('Loading')).toHaveLength(1);
  });

  it('should render subaccount option', () => {
    wrapper.setProps({ hasSubaccounts: true });
    expect(wrapper.find('Select')).toMatchSnapshot();
  });

  it('should render row data & handle click', () => {
    let snaps = [];
    wrapper.setProps({ hasSubaccounts: true, groupBy: 'subaccount' });
    const func = wrapper.instance().getRowData();
    const results = _.flatten(data.map(func))

    _.each(results, (item, i) => {
        snaps.push(mount(item));
    });

    expect(snaps).toMatchSnapshot()

    snaps[0].find('UnstyledLink').simulate('click');
    expect(props.addFilter).toHaveBeenCalledWith({ id: 0, type: 'Subaccount', value: 'Master Account (ID 0)' });
    expect(props.refresh).toHaveBeenCalled();
  });

  it('should handle select change', () => {
    wrapper.find('Select').simulate('change', { target: { value: 'campaign' }});
    expect(props.getTableData).toHaveBeenCalledWith({ groupBy: 'campaign' });
  });
});
