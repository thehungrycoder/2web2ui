import React from 'react';
import { Percent } from '../Percent';
import { mount } from 'enzyme';
import _ from 'lodash';

describe('Percent', () => {
  it('should render percent', () => {
    const wrapper = mount(<Percent value={20} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render percent floor', () => {
    const wrapper = mount(<Percent value={0.00001} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render negative', () => {
    const wrapper = mount(<Percent value={-20} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render when not a number', () => {
    const wrapper = mount(<Percent value='not a number' />);
    expect(wrapper).toMatchSnapshot();
  });
});
