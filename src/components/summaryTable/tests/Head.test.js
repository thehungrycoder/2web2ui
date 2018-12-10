import React from 'react';
import { shallow } from 'enzyme';
import Head from '../Head';

describe('Head', () => {
  it('renders a row of header cells', () => {
    const handleSort = jest.fn();
    const wrapper = shallow(
      <Head
        columns={[
          {
            dataKey: 'id',
            label: 'Identifier',
            sortable: true
          },
          {
            dataKey: 'value',
            label: 'Value',
            sortable: false
          }
        ]}
        onSort={handleSort}
        order={{ ascending: true, dataKey: 'id' }}
      />
    );

    expect(wrapper).toMatchSnapshot();
  });
});
