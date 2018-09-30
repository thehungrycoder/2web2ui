import React from 'react';
import { shallow } from 'enzyme';
import Pagination from '../../Pagination';
import withPagination from '../pagination';
import { mkRows } from '../../__testHelpers__/rows';

describe('HoC: withPagination', () => {
  let props;
  let fetchRows;
  let pushStub;
  let TestComponent;

  beforeEach(() => {
    pushStub = jest.fn();
    props = {
      rows: mkRows(50),
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

    fetchRows = jest.fn().mockReturnValue(mkRows(50));

    TestComponent = withPagination(() => false, fetchRows);
  });

  it('should render pagination', () => {
    props.pagination = true;
    const wrapper = shallow(<TestComponent {...props} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Pagination)).toHaveLength(1);
  });

  it('should fetch initial rows if not provided', () => {
    delete props.rows;
    shallow(<TestComponent {...props} />);
    expect(fetchRows).toHaveBeenCalledTimes(1);
  });

  describe('state changes', () => {
    let wrapper;
    let instance;
    let updateQueryStringSpy;

    function setupCollection() {
      wrapper = shallow(<TestComponent {...props} />);
      instance = wrapper.instance();
      updateQueryStringSpy = jest.spyOn(instance, 'maybeUpdateQueryString');
    }

    beforeEach(() => setupCollection());

    it('should handle a page change', () => {
      expect(wrapper).toHaveState('currentPage', 1);
      instance.handlePageChange(2);
      expect(wrapper).toHaveState('currentPage', 3);
      expect(updateQueryStringSpy).toHaveBeenCalledTimes(1);
      expect(fetchRows).toHaveBeenCalledWith(3, props.defaultPerPage);
    });

    it('should handle a per page change', () => {
      expect(wrapper).toHaveState('perPage', 10);
      instance.handlePerPageChange(25);
      expect(wrapper).toHaveState('perPage', 25);
      expect(updateQueryStringSpy).toHaveBeenCalledTimes(1);
      expect(fetchRows).toHaveBeenCalledWith(1, 25);
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
