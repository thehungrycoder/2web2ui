import React from 'react';
import CollectionPagination from '../Pagination';
import _ from 'lodash';

describe('Collection Pagination Component', () => {
  const props = {
    data: [1, 2, 3, 4, 5, 6],
    perPage: 2,
    currentPage: 1,
    onPageChange: () => {}
  };

  // render() returns null if currentPage isn't passed
  it('should render with no props', () => {
    const wrapper = shallow(<CollectionPagination />);

    expect(wrapper).toMatchSnapshot();
  });

  // data.length <= least perPageButton
  it('should render without perPageButtons', () => {
    const wrapper = shallow(<CollectionPagination {...props}/>);

    expect(wrapper).toMatchSnapshot();
  });

  it('should render with perPageButtons', () => {
    const perPageProps = _.cloneDeep(props);
    perPageProps.data.push(7, 8, 9, 10, 11);

    const wrapper = shallow(<CollectionPagination {...perPageProps}/>);

    expect(wrapper).toMatchSnapshot();
  });
});
