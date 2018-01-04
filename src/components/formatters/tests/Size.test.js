import React from 'react';
import { Size } from '../Size';
import { mount } from 'enzyme';

describe('Size', () => {
  it('should render size in KB', () => {
    const wrapper = mount(<Size value={1025} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render size in MB', () => {
    const wrapper = mount(<Size value={1049000} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render size in GB', () => {
    const wrapper = mount(<Size value={1074000000} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render size in TB', () => {
    const wrapper = mount(<Size value={1100000000000} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render size in PB', () => {
    const wrapper = mount(<Size value={1126000000000000} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render when not a number', () => {
    const wrapper = mount(<Size value='not a number' />);
    expect(wrapper).toMatchSnapshot();
  });
});
