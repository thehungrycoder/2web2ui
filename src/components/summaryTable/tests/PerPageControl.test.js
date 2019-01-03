import React from 'react';
import { shallow } from 'enzyme';
import PerPageControl from '../PerPageControl';

describe('PerPageControl', () => {
  const subject = (props = {}) => shallow(
    <PerPageControl
      {...props}
    />
  );

  it('renders group of buttons', () => {
    const wrapper = subject({
      perPage: 10,
      totalCount: 100
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('renders null when total count is less than smallest page size', () => {
    const wrapper = subject({ totalCount: 0 });
    expect(wrapper.html()).toBeNull();
  });

  it('renders only size buttons less than or equal to totalCount', () => {
    const wrapper = subject({
      perPage: 10,
      totalCount: 50
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('calls onChange callback when button is clicked', () => {
    const onChange = jest.fn();
    const wrapper = subject({ onChange, totalCount: 100 });

    wrapper.find('Button').first().simulate('click');

    expect(onChange).toHaveBeenCalledWith(10);
  });
});
