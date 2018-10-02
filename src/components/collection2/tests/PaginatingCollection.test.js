import React from 'react';
import { shallow } from 'enzyme';
import { PaginatingCollection } from '../PaginatingCollection';
import { mkRows } from '../__testHelpers__/rows';

describe('Component: PaginatingCollection', () => {
  let props;
  let wrapper;
  let rows;

  beforeEach(() => {
    rows = mkRows(10);
    props = {
      fetchRows: jest.fn().mockReturnValue({ rows, rowCount: rows.length }),
      defaultPerPage: 5,
      rows,
      location: {
        search: '',
        pathname: '/'
      },
      history: {
        push: jest.fn()
      }
    };
    wrapper = shallow(<PaginatingCollection {...props} />);
  });

  it('should render initial rows if provided', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should fetch rows on mount if not provided', () => {
    delete props.rows;
    shallow(<PaginatingCollection {...props} />);
    expect(props.fetchRows).toHaveBeenCalledTimes(1);
  });

  it('should fetch rows on page change', () => {
    wrapper.instance().handlePageChange(1);
    expect(props.fetchRows).toHaveBeenCalledWith({
      currentPage: 2,
      perPage: props.defaultPerPage
    });
  });

  it('should fetch rows on page size change', () => {
    wrapper.instance().handlePerPageChange(2);
    expect(props.fetchRows).toHaveBeenCalledWith({
      currentPage: 1,
      perPage: 2
    });
  });

  it('should render sync fetched rows', async () => {
    const { rows, ...rest } = props;
    wrapper = shallow(<PaginatingCollection {...rest} />);
    await wrapper.instance().updateRows();
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render async fetched rows', async () => {
    const { rows, ...rest } = props;
    props.fetchRows.mockResolvedValue({ rows, rowCount: rows.length });
    wrapper = shallow(<PaginatingCollection {...rest} />);
    await wrapper.instance().updateRows();
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
  });

  it.skip('should update the query string if page is present', () => {
    const { defaultPerPage, ...rest } = props;
    rest.location.search = '?page=2&other=cool';
    rest.location.pathname = 'some-pathname';
    rest.updateQueryString = true;
    wrapper = shallow(<PaginatingCollection {...rest} />);
    wrapper.instance().maybeUpdateQueryString();
    expect(props.history.push).toHaveBeenCalledWith('some-pathname?other=cool&page=2&perPage=25');
  });

  it.skip('should update the query string if updateQueryString prop is true', () => {
    props.location.search = '?other=cool';
    props.location.pathname = 'some-pathname';
    props.updateQueryString = true;
    wrapper = shallow(<PaginatingCollection {...props} />);
    wrapper.instance().maybeUpdateQueryString();
    expect(props.history.push).toHaveBeenCalledWith('some-pathname?other=cool&page=1&perPage=10');
  });
});
