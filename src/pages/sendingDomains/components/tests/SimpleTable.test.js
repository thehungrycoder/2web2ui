import React from 'react';
import { shallow } from 'enzyme';

import SimpleTable from '../SimpleTable';

describe('Component: SimpleTable', () => {

  let wrapper;
  let rows;
  let header;

  beforeEach(() => {
    header = ['Column 1', 'Column 2'];
    rows = [ ['val1', 'val2']];
    wrapper = shallow(<SimpleTable rows={rows} header={header} />);
  });

  it('renders table correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
