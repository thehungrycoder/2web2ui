import React from 'react';
import MetricsSummary from '../MetricsSummary';
import { shallow } from 'enzyme';

describe('MetricsSummary: ', () => {
  it('should render', () => {
    const props = {
      rateValue: '10',
      rateTitle: 'Summary Title'
    };

    const wrapper = shallow(<MetricsSummary {...props} ><p>child1</p></MetricsSummary>);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render 2nd child if it exists', () => {
    const props = {
      rateValue: '10',
      rateTitle: 'Summary Title'
    };
    const wrapper = shallow(<MetricsSummary {...props} ><p>child1</p><p>child2</p></MetricsSummary>);
    expect(wrapper).toMatchSnapshot();
  });
});
