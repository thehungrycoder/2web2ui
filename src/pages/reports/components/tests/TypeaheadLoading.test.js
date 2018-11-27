import React from 'react';
import { shallow } from 'enzyme';
import TypeaheadLoading from '../TypeaheadLoading';

describe('Component: TypeaheadItem', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      isCalculating: false
    };
    wrapper = shallow(<TypeaheadLoading {...props} />);
  });

  it('should not render when not calculating', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render when calculating', () => {
    wrapper.setProps({ isCalculating: true });
    expect(wrapper).toMatchSnapshot();
  });
});
