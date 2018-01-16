import React from 'react';
import MetricsSummary from '../MetricsSummary';
import { shallow } from 'enzyme';

const props = {
  rateValue: 10,
  rateTitle: 'Summary Title',
  to: new Date(1487076708000),
  from: new Date(1482076708000)
};

describe('MetricsSummary: ', () => {
  it('should render custom date', () => {
    const wrapper = shallow(<MetricsSummary {...props} relativeRange='custom'><p>message</p></MetricsSummary>);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render relative range', () => {
    const wrapper = shallow(<MetricsSummary {...props} relativeRange='30days'><p>message</p></MetricsSummary>);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render secondary message', () => {
    const wrapper = shallow(<MetricsSummary {...props} relativeRange='custom' secondaryMessage='another message'><p>message</p></MetricsSummary>);
    expect(wrapper).toMatchSnapshot();
  });
});
