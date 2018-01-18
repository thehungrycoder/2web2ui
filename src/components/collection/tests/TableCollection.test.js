import React from 'react';
import { Table } from '@sparkpost/matchbox';
import { shallow } from 'enzyme';

import TableCollection from '../TableCollection';

describe('TableCollection Component', () => {
  let columns;
  let headerComponent;
  let props;

  beforeEach(() => {
    columns = ['one', 'two'];

    headerComponent = (
      <thead>
        <Table.Row>
          {columns.map((title) => <Table.HeaderCell key={title}>{title}</Table.HeaderCell>)}
        </Table.Row>
      </thead>
    );

    props = {
      headerComponent: headerComponent,
      columns: columns,
      getRowData: () => {},
      extraProp: 'plsPassDown',
      rows: []
    };
  });

  describe('render', () => {
    it('renders with no props', () => {
      const wrapper = shallow(<TableCollection />);

      expect(wrapper).toMatchSnapshot();
    });

    it('renders with props', () => {
      const wrapper = shallow(<TableCollection {...props}/>);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('componentDidMount', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallow(<TableCollection {...props}/>);
    });

    it('uses default if defaultSortColumn and defaultSortDirection are not passed', () => {
      wrapper = shallow(<TableCollection {...props}/>);
      expect(wrapper.state().sortColumn).toEqual(null);
      expect(wrapper.state().sortDirection).toEqual('asc');
    });

    it('sets state with defaultSortColumn when passed', () => {
      expect(wrapper.state().sortColumn).toEqual(null);
      props.defaultSortColumn = 'col1';
      wrapper = shallow(<TableCollection {...props}/>);
      expect(wrapper.state().sortColumn).toEqual('col1');
    });

    it('sets default with sortDirection when passed', () => {
      expect(wrapper.state().sortDirection).toEqual('asc');
      props.defaultSortDirection = 'desc';
      wrapper = shallow(<TableCollection {...props}/>);
      expect(wrapper.state().sortDirection).toEqual('desc');
    });
  });

  describe('handleSortChange', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallow(<TableCollection {...props}/>);
    });

    it('updates state correctly', () => {
      expect(wrapper.state()).toEqual({ sortColumn: null, sortDirection: 'asc' });
      wrapper.instance().handleSortChange('col1', 'desc');
      expect(wrapper.state()).toEqual({ sortColumn: 'col1', sortDirection: 'desc' });
    });
  });
});
