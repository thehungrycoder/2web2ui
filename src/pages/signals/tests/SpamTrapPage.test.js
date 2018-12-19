import { shallow } from 'enzyme';
import React from 'react';
import { SpamTrapPage } from '../SpamTrapPage';

describe('Signals Spam Trap Page', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      facetId: 'test.com',
      facet: 'sending-domain',
      data: [],
      gap: 0.25,
      loading: false,
      empty: false
    };
    wrapper = shallow(<SpamTrapPage {...props}/>);
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

  describe('local state', () => {
    it('handles calculation type', () => {
      const calculation = shallow(wrapper.find('ChartHeader').props().primaryArea);
      calculation.simulate('change', 'relative');
      expect(wrapper.find('BarChart').prop('yKey')).toEqual('relative_trap_hits');
    });

    it('handles date select', () => {
      wrapper.find('BarChart').simulate('click', { payload: { date: 'test' }});
      expect(wrapper.find('BarChart').prop('selected')).toEqual('test');
      expect(wrapper.find('Actions').prop('date')).toEqual('test');
    });

    it('sets selected date on mount if provided one', () => {
      wrapper = shallow(<SpamTrapPage {...props} selected='initial-selected'/>);
      expect(wrapper.find('BarChart').prop('selected')).toEqual('initial-selected');
      expect(wrapper.find('Actions').prop('date')).toEqual('initial-selected');
    });

    it('sets uses last selected date when receiving data', () => {
      wrapper.setProps({ data: [1, { date: 'last-date' }]});
      expect(wrapper.find('BarChart').prop('selected')).toEqual('last-date');
      expect(wrapper.find('Actions').prop('date')).toEqual('last-date');
    });
  });

  describe('bar chart props', () => {
    it('renders tooltip content', () => {
      const Tooltip = wrapper.find('BarChart').prop('tooltipContent');
      expect(shallow(<Tooltip payload={{
        trap_hits: 2,
        injections: 3,
        relative_trap_hits: 0.001234567
      }} />)).toMatchSnapshot();
    });

    it('gets x axis props', () => {
      const axisProps = wrapper.find('BarChart').prop('xAxisProps');
      expect(axisProps).toMatchSnapshot();
      expect(axisProps.tickFormatter('2018-12-05')).toEqual('12/5');
    });

    it('gets y axis props with relative calculation', () => {
      wrapper.setState({ calculation: 'relative' });
      const axisProps = wrapper.find('BarChart').prop('yAxisProps');
      expect(axisProps.tickFormatter(0.2468)).toEqual('24.68%');
    });

    it('gets y axis props with absolute calculation', () => {
      wrapper.setState({ calculation: 'absolute' });
      const axisProps = wrapper.find('BarChart').prop('yAxisProps');
      expect(axisProps.tickFormatter).toEqual(null);
    });
  });
});
