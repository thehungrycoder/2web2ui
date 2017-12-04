import React from 'react';
import { Unit } from '../Unit';
import { mount, render } from 'enzyme';
import _ from 'lodash';

describe('Unit ', () => {
  it('should render duration in seconds', () => {
    const wrapper = mount(<Unit value={1001} unit='milliseconds' />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render duration in minutes', () => {
    const wrapper = mount(<Unit value={60001} unit='milliseconds' />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render duration in hours', () => {
    const wrapper = mount(<Unit value={3600001} unit='milliseconds' />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render percent', () => {
    const wrapper = mount(<Unit value={20} unit='percent' />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render percent floor', () => {
    const wrapper = mount(<Unit value={0.00001} unit='percent' />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render size in KB', () => {
    const wrapper = mount(<Unit value={1025} unit='bytes' />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render size in MB', () => {
    const wrapper = mount(<Unit value={1049001} unit='bytes' />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render size in GB', () => {
    const wrapper = mount(<Unit value={1074000001} unit='bytes' />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render size in TB', () => {
    const wrapper = mount(<Unit value={1100000000001} unit='bytes' />);
    expect(wrapper).toMatchSnapshot();
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
