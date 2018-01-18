import React from 'react';
import { Table } from '@sparkpost/matchbox';
import { shallow } from 'enzyme';

import TableCollection from '../TableCollection';

describe('TableCollection Component', () => {
  const columns = ['one', 'two'];

  const headerComponent = (
    <thead>
      <Table.Row>
        {columns.map((title) => <Table.HeaderCell key={title}>{title}</Table.HeaderCell>)}
      </Table.Row>
    </thead>
  );

  const props = {
    headerComponent: headerComponent,
    columns: columns,
    getRowData: () => {},
    extraProp: 'plsPassDown',
    rows: []
  };

  it('should render with no props', () => {
    const wrapper = shallow(<TableCollection />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should render with props', () => {
    const wrapper = shallow(<TableCollection {...props}/>);

    expect(wrapper).toMatchSnapshot();
  });
});
