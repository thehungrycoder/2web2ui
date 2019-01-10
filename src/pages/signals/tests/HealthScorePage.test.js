import { shallow } from 'enzyme';
import React from 'react';
import { HealthScorePage } from '../HealthScorePage';

describe('Signals Health Score Page', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      facetId: 'test.com',
      facet: 'sending-domain',
      data: [{ weights: [1,2]}],
      gap: 0.25,
      loading: false,
      empty: false,
      xTicks: []
    };
    wrapper = shallow(<HealthScorePage {...props}/>);
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('renders loading correctly', () => {
    wrapper.setProps({ loading: true });
    expect(wrapper.find('Panel')).toMatchSnapshot();
  });

  it('renders empty correctly', () => {
    wrapper.setProps({ empty: true });
    expect(wrapper.find('Panel')).toMatchSnapshot();
  });

  it('renders error correctly', () => {
    wrapper.setProps({ error: { message: 'error message' }});
    expect(wrapper).toMatchSnapshot();
  });

  describe('local state', () => {
    it('handles date select', () => {
      wrapper.find('BarChart').at(0).simulate('click', { payload: { date: 'test' }});
      expect(wrapper.find('BarChart').at(0).prop('selected')).toEqual('test');
      expect(wrapper.find('BarChart').at(1).prop('selected')).toEqual('test');
    });

    it('sets selected date on mount if provided one', () => {
      wrapper = shallow(<HealthScorePage {...props} selected='initial-selected'/>);
      expect(wrapper.find('BarChart').at(0).prop('selected')).toEqual('initial-selected');
    });

    it('uses last selected date if selected date is not in data', () => {
      wrapper = shallow(<HealthScorePage {...props} loading={true} selected='initial-selected'/>);
      wrapper.setProps({ data: [1, { date: 'last-date' }], loading: false });
      expect(wrapper.find('BarChart').at(0).prop('selected')).toEqual('last-date');
    });

    it('does not use last selected date if selected date is in data', () => {
      wrapper = shallow(<HealthScorePage {...props} selected='first-date'/>);
      wrapper.setProps({ data: [{ date: 'first-date' }, { date: 'last-date' }]});
      expect(wrapper.find('BarChart').at(0).prop('selected')).toEqual('first-date');
    });
  });

  describe('bar chart props', () => {
    it('renders tooltip content for health score', () => {
      const Tooltip = wrapper.find('BarChart').at(0).prop('tooltipContent');
      expect(shallow(<Tooltip payload={{ health_score: 0.12 }} />)).toMatchSnapshot();
    });

    it('renders tooltip content for injections', () => {
      const Tooltip = wrapper.find('BarChart').at(1).prop('tooltipContent');
      expect(shallow(<Tooltip payload={{ injections: 1000 }} />)).toMatchSnapshot();
    });

    it('gets x axis props', () => {
      const axisProps = wrapper.find('BarChart').at(0).prop('xAxisProps');
      expect(axisProps).toMatchSnapshot();
      expect(axisProps.tickFormatter('2018-12-05')).toEqual('12/5');
    });

    it('renders health score y ticks', () => {
      const axisProps = wrapper.find('BarChart').at(0).prop('yAxisProps');
      expect(axisProps.tickFormatter(0.2468)).toEqual(24.68);
    });

    it('renders injections y ticks', () => {
      const axisProps = wrapper.find('BarChart').at(1).prop('yAxisProps');
      expect(axisProps.tickFormatter(2468)).toEqual('2.47K');
    });
  });
});
