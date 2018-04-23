import React from 'react';
import { shallow } from 'enzyme';
import { Collection } from '../Collection';
import FilterBox from '../FilterBox';
import Pagination from '../Pagination';
import * as sorters from 'src/helpers/sortMatch';
import delay from 'src/__testHelpers__/delay';

describe('Component: Collection', () => {

  let props;
  let pushStub;

  function addRows(n) {
    for (let i = 0; i < n; i++) {
      props.rows.push({ id: i, name: `row-name--${i}` });
    }
  }

  beforeEach(() => {
    pushStub = jest.fn();
    props = {
      rows: [],
      rowComponent: () => <h1>row</h1>,
      headerComponent: () => <h1>header</h1>,
      defaultPerPage: 10,
      perPageButtons: [10, 50],
      location: {
        pathname: '/some/path',
        search: '?some=search&other=string'
      },
      history: {
        push: pushStub
      }
    };
  });

  it('should render null if there are no rows', () => {
    const wrapper = shallow(<Collection {...props} />);
    expect(wrapper.equals(null)).toEqual(true);
  });

  it('should render correctly with basic props', () => {
    addRows(15);
    const wrapper = shallow(<Collection {...props} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Pagination)).toHaveLength(0);
    expect(wrapper.find(FilterBox)).toHaveLength(0);
  });

  it('should render with custom wrappers', () => {
    addRows(3);
    props.outerWrapper = function CustomOuterWrapper(props) { return props.children; };
    props.bodyWrapper = function CustomBodyWrapper(props) { return props.children; };
    expect(shallow(<Collection {...props} />)).toMatchSnapshot();
  });

  it('should render pagination', () => {
    addRows(3);
    props.pagination = true;
    const wrapper = shallow(<Collection {...props} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Pagination)).toHaveLength(1);
  });

  it('should render the filter box', () => {
    addRows(15);
    props.filterBox = { show: true };

    const wrapper = shallow(<Collection {...props} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(FilterBox)).toHaveLength(1);
  });

  describe('state changes', () => {

    let wrapper;
    let instance;
    let updateQueryStringSpy;

    function setupCollection() {
      wrapper = shallow(<Collection {...props} />);
      instance = wrapper.instance();
      updateQueryStringSpy = jest.spyOn(instance, 'maybeUpdateQueryString');
    }

    beforeEach(() => setupCollection());

    it('should handle a page change', () => {
      expect(wrapper).toHaveState('currentPage', 1);
      instance.handlePageChange(2);
      expect(wrapper).toHaveState('currentPage', 3);
      expect(updateQueryStringSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle a per page change', () => {
      expect(wrapper).toHaveState('perPage', 10);
      instance.handlePerPageChange(25);
      expect(wrapper).toHaveState('perPage', 25);
      expect(updateQueryStringSpy).toHaveBeenCalledTimes(1);
    });

    it('should mount on the right page', () => {
      props.location.search = '?page=2';
      setupCollection();
      expect(wrapper).toHaveState('currentPage', 2);
    });

    it('should convert page=0 to 1', () => {
      props.location.search = '?page=0';
      setupCollection();
      expect(wrapper).toHaveState('currentPage', 1);
    });

    it('should handle filter change', () => {
      const filteredRowsMock = [1, 2, 3];
      sorters.objectSortMatch = jest.fn(() => filteredRowsMock);
      props.filterBox = { show: true };
      addRows(30);
      setupCollection();
      instance.handlePageChange(2);
      instance.handleFilterChange('some pattern');

      return delay(350).then(() => {
        expect(wrapper).toHaveState('currentPage', 1);
        expect(wrapper).toHaveState('filteredRows', filteredRowsMock);
        expect(instance.getVisibleRows()).toEqual(filteredRowsMock);
      });
    });

    it('should sort by column when sortColumn is present', () => {
      const filteredRowsMock = [{ col1: 1 }, { col1: 2 }, { col1: 3 }];
      sorters.objectSortMatch = jest.fn(() => filteredRowsMock);
      props.filterBox = { show: true };
      props.sortColumn = 'col1';
      props.sortDirection = 'asc';
      addRows(30);
      setupCollection();
      instance.handlePageChange(2);
      instance.handleFilterChange('some pattern');

      return delay(350).then(() => {
        expect(wrapper).toHaveState('currentPage', 1);
        expect(wrapper).toHaveState('filteredRows', filteredRowsMock);
        expect(instance.getVisibleRows()).toMatchSnapshot();
      });
    });

    it('should obey sort direction', () => {
      const filteredRowsMock = [{ col1: 1 }, { col1: 2 }, { col1: 3 }];
      sorters.objectSortMatch = jest.fn(() => filteredRowsMock);
      props.filterBox = { show: true };
      props.sortColumn = 'col1';
      props.sortDirection = 'desc';
      addRows(30);
      setupCollection();
      instance.handleFilterChange('some pattern');

      return delay(350).then(() => {
        expect(instance.getVisibleRows()).toMatchSnapshot();
      });
    });

    it('should calculate visible rows', () => {
      addRows(50);
      props.pagination = true;
      setupCollection();
      instance.handlePageChange(2);
      expect(instance.getVisibleRows()).toEqual(props.rows.slice(20, 30));
    });

    it('should return all rows if pagination is false', () => {
      addRows(50);
      props.pagination = false;
      setupCollection();
      instance.handlePageChange(2);
      expect(instance.getVisibleRows()).toEqual(props.rows);
    });

    it('should update the query string if page is present', () => {
      props.location.search = '?page=2&other=cool';
      props.location.pathname = 'some-pathname';
      props.pagination = true;
      delete props.defaultPerPage;
      setupCollection();
      instance.maybeUpdateQueryString();
      expect(pushStub).toHaveBeenCalledWith('some-pathname?other=cool&page=2&perPage=25');
    });

    it('should update the query string if updateQueryString prop is true', () => {
      props.location.search = '?other=cool';
      props.location.pathname = 'some-pathname';
      props.updateQueryString = true;
      props.pagination = true;
      setupCollection();
      instance.maybeUpdateQueryString();
      expect(pushStub).toHaveBeenCalledWith('some-pathname?other=cool&page=1&perPage=10');
    });

  });

});
