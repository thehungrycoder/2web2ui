import React from 'react';
import { shallow } from 'enzyme';
import CursorPaging from '../CursorPaging';

describe('CursorPaging', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      currentPage: 2,
      handlePageChange: jest.fn(),
      previousDisabled: false,
      nextDisabled: false,
      handleFirstPage: jest.fn(),
      perPage: 25,
      totalCount: 100
    };
    wrapper = shallow(<CursorPaging {...props} />);
  });

  it('should render cursor paging', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should correctly render cursor paging when there is only one page', () => {
    const newProps = {
      currentPage: 1,
      handlePageChange: jest.fn(),
      previousDisabled: true,
      nextDisabled: true,
      handleFirstPage: jest.fn(),
      perPage: 25,
      totalCount: 20
    };
    wrapper = shallow(<CursorPaging {...newProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should handle clicking rewind to first page', () => {
    wrapper.find('Button').first().simulate('click');
    expect(props.handleFirstPage).toHaveBeenCalled();
  });

  it('should handle clicking previous button', () => {
    wrapper.find('Pager').children().first().simulate('click');
    expect(props.handlePageChange).toHaveBeenCalledWith(props.currentPage - 1);
  });

  it('should handle clicking next button', () => {
    wrapper.find('Pager').children().last().simulate('click');
    expect(props.handlePageChange).toHaveBeenCalledWith(props.currentPage + 1);
  });
});
