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
  it('should render with no props', () => {
    const wrapper = shallow(<CollectionPagination />);
    expect(wrapper).toMatchSnapshot();
  });

  // data.length <= least perPageButton
  it('should render without perPageButtons', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should hide pagination if data is less than per page', () => {
    wrapper.setProps({ perPage: 10 });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render with perPageButtons and saveCsv', () => {
    wrapper.setProps({ data: _.times(12, (i) => ({ key: i + 1 })) });
    expect(wrapper).toMatchSnapshot();
  });

  it('should not show save as CSV button when false', () => {
    wrapper.setProps({ saveCsv: false, perPageButtons: [1,2]});
    expect(wrapper).toMatchSnapshot();
  });

  it('should map simple collections to papa parse', () => {
    wrapper.setProps({ saveCsv: true, perPageButtons: [1, 5, 10]});
    expect(Papa.unparse).toHaveBeenCalledWith([{ 'key': 1 }, { 'key': 2 }, { 'key': 3 }, { 'key': 4 }, { 'key': 5 }]);
  });

  it('should stringify complex objects', () => {
    const perPageProps = _.cloneDeep(props);
    perPageProps.data.push({ key: { subkey: 'value' }}, { key: [1,2,3]});
    perPageProps.perPageButtons = [1,2,3];
    wrapper.setProps(perPageProps);
    expect(Papa.unparse).toHaveBeenCalledWith([{ 'key': 1 }, { 'key': 2 }, { 'key': 3 }, { 'key': 4 }, { 'key': 5 }, { 'key': '{"subkey":"value"}' }, { 'key': '[1,2,3]' }]);
  });
});
