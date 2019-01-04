import React from 'react';
import { shallow } from 'enzyme';
import SummaryTable from '../SummaryTable';
import Column from '../Column';

describe('SummaryTable', () => {
  const subject = (props = {}) => shallow(
    <SummaryTable
      currentPage={1}
      data={[
        { id: 'test-example', name: 'Test Example' }
      ]}
      empty={false}
      loading={false}
      order={{
        ascending: false,
        dataKey: 'id'
      }}
      perPage={10}
      tableName="test-table"
      totalCount={0}
      {...props}
    >
      <Column dataKey="id" label="Identifier" />
      <Column dataKey="name" label="Name" />
    </SummaryTable>
  );

  it('renders a table', () => {
    const wrapper = subject();
    expect(wrapper).toMatchSnapshot();
  });

  it('passes error message to body', () => {
    const wrapper = subject({ error: 'Oh no!' });
    expect(wrapper.find('Body').prop('error')).toEqual('Oh no!');
  });

  it('calls onChange on mount', () => {
    const onChange = jest.fn();
    subject({ onChange });

    expect(onChange).toHaveBeenCalledWith({
      currentPage: 1,
      order: { ascending: false, dataKey: 'id' },
      perPage: 10
    });
  });

  it('calls onChange when page props change', () => {
    const onChange = jest.fn();
    const wrapper = subject({ onChange });

    wrapper.setProps({ currentPage: 2 });

    expect(onChange).toHaveBeenCalledWith({
      currentPage: 2,
      order: { ascending: false, dataKey: 'id' },
      perPage: 10
    });
  });

  it('calls changeSummaryTable when pagination changes', () => {
    const changeSummaryTable = jest.fn();
    const wrapper = subject({ changeSummaryTable });

    wrapper.find('Pagination').simulate('change', 1);

    expect(changeSummaryTable).toHaveBeenCalledWith('test-table', { currentPage: 2 });
  });

  it('calls changeSummaryTable when page size changes', () => {
    const changeSummaryTable = jest.fn();
    const wrapper = subject({ changeSummaryTable });

    wrapper.find('PerPageControl').simulate('change', 50);

    expect(changeSummaryTable).toHaveBeenCalledWith('test-table', { currentPage: 1, perPage: 50 });
  });

  it('calls changeSummaryTable when sort order changes', () => {
    const changeSummaryTable = jest.fn();
    const order = { ascending: true, dataKey: 'id' };
    const wrapper = subject({ changeSummaryTable });

    wrapper.find('Head').simulate('sort', order);

    expect(changeSummaryTable).toHaveBeenCalledWith('test-table', { currentPage: 1, order });
  });
});
