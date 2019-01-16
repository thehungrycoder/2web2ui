import React from 'react';
import PerPageButtons from '../PerPageButtons';
import _ from 'lodash';
import { shallow } from 'enzyme';


describe('Per Page Buttons', () => {
  let wrapper;
  const props = {
    data: _.times(11, (i) => ({ key: i + 1 })),
    currentPage: 1,
    onPerPageChange: jest.fn(),
    perPage: 25,
    totalCount: 200
  };

  beforeEach(() => {
    wrapper = shallow(<PerPageButtons {...props} />);
  });

  it('should correctly render perPageButtons', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should hide PerPageButtons if data is less than minimum per page', () => {
    wrapper.setProps({ totalCount: 10 });
    expect(wrapper).toMatchSnapshot();
  });

  it('should handle clicking per page buttons', () => {
    wrapper.setProps({ perPageButtons: [10,25]});
    wrapper.find('Button').first().simulate('click');
    expect(props.onPerPageChange).toHaveBeenCalledWith(10);
  });

});
