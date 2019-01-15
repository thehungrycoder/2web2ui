import React from 'react';
import CollectionPagination from '../Pagination';
import _ from 'lodash';
import { shallow } from 'enzyme';
import Papa from 'papaparse';

jest.mock('papaparse');
Date.now = jest.fn(() => 1512509841582);

describe('Collection Pagination Component', () => {
  let wrapper;
  const props = {
    data: _.times(5, (i) => ({ key: i + 1 })),
    perPage: 2,
    currentPage: 1,
    onPageChange: () => {}
  };

  beforeEach(() => {
    Papa.unparse = jest.fn(() => 'mydata');
    wrapper = shallow(<CollectionPagination {...props} />);
  });

  // render() returns null if currentPage isn't passed
  it('should render null with no props', () => {
    const wrapper = shallow(<CollectionPagination />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should hide pagination if data is less than per page', () => {
    wrapper.setProps({ perPage: 10 });
    expect(wrapper).toMatchSnapshot();
  });

});
