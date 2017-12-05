import React from 'react';
import { Unit } from '../Unit';
import { mount } from 'enzyme';
import _ from 'lodash';

describe('Unit', () => {
  it('should render duration', () => {
    const wrapper = mount(<Unit value={1} unit='milliseconds' />);
    expect(wrapper.find('Duration')).toHaveLength(1);
  });

  it('should render percent', () => {
    const wrapper = mount(<Unit value={1} unit='percent' />);
    expect(wrapper.find('Percent')).toHaveLength(1);
  });

  it('should render size', () => {
    const wrapper = mount(<Unit value={1} unit='bytes' />);
    expect(wrapper.find('Size')).toHaveLength(1);
  });

  it('should render when undefined', () => {
    const wrapper = mount(<Unit />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render when not a number', () => {
    const wrapper = mount(<Unit value='not a number' />);
    expect(wrapper).toMatchSnapshot();
  });
});
