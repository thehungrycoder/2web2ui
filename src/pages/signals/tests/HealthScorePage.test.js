import { shallow } from 'enzyme';
import React from 'react';
import { HealthScorePage } from '../HealthScorePage';

describe('Signals Health Score Page', () => {
  let wrapper;
  let props;
  const data = [
    {
      date: '2017-01-01',
      weights: [
        { weight_type: 'Hard Bounces', weight: 0.5, weight_value: 0.25 },
        { weight_type: 'Complaints', weight: -0.5, weight_value: 0.25 }
      ]
    },
    {
      date: '2017-01-02',
      weights: [
        { weight_type: 'List Quality', weight: 0.8, weight_value: 0.25 },
        { weight_type: 'Other bounces', weight: -0.8, weight_value: 0.25 }
      ]
    }
  ];

  beforeEach(() => {
    props = {
      facetId: 'test.com',
      facet: 'sending-domain',
      data: [],
      selected: '2017-01-01',
      gap: 0.25,
      loading: false,
      empty: false,
      xTicks: []
    };
    wrapper = shallow(<HealthScorePage {...props}/>);
    wrapper.setProps({ data });
  });

  it('renders correctly when recieving data', () => {
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

  it('renders empty weights', () => {
    wrapper.setProps({ data: [{ date: '2017-01-01' }]});
    expect(wrapper).toMatchSnapshot();
  });

  describe('local state', () => {
    it('handles date select', () => {
      wrapper.find('BarChart').at(0).simulate('click', { payload: { date: '2017-01-02' }});
      expect(wrapper.find('BarChart').at(0).prop('selected')).toEqual('2017-01-02');
      expect(wrapper.find('BarChart').at(1).prop('selected')).toEqual('2017-01-02');
      expect(wrapper.find('ChartHeader').at(3).prop('date')).toEqual('2017-01-02');
      expect(wrapper.find('HealthScoreActions')).toMatchSnapshot();
    });

    it('sets selected date on mount if provided one', () => {
      wrapper = shallow(<HealthScorePage {...props} selected='initial-selected'/>);
      expect(wrapper.find('BarChart').at(0).prop('selected')).toEqual('initial-selected');
      expect(wrapper.find('HealthScoreActions').prop('date')).toEqual('initial-selected');
    });

    it('uses last selected date if selected date is not in data', () => {
      wrapper = shallow(<HealthScorePage {...props} loading={true} selected='initial-selected'/>);
      wrapper.setProps({ data: [1, { date: 'last-date' }], loading: false });
      expect(wrapper.find('BarChart').at(0).prop('selected')).toEqual('last-date');
      expect(wrapper.find('HealthScoreActions').prop('date')).toEqual('last-date');
    });

    it('does not use last selected date if selected date is in data', () => {
      wrapper = shallow(<HealthScorePage {...props} selected='first-date'/>);
      wrapper.setProps({ data: [{ date: 'first-date' }, { date: 'last-date' }]});
      expect(wrapper.find('BarChart').at(0).prop('selected')).toEqual('first-date');
      expect(wrapper.find('HealthScoreActions').prop('date')).toEqual('first-date');
    });

    it('handles component select', () => {
      wrapper.find('DivergingBar').at(0).simulate('click', { payload: { weight_type: 'Complaints' }});
      expect(wrapper.find('DivergingBar').at(0).prop('selected')).toEqual('Complaints');
    });

    it('uses first component weight with an existing date and new data', () => {
      wrapper = shallow(<HealthScorePage {...props} selected='first-date'/>);
      wrapper.setProps({ data: [{ date: 'first-date', weights: [
        { weight_type: 'Hard Bounces', weight: 0.5, weight_value: 0.25 },
        { weight_type: 'Complaints', weight: 0.5, weight_value: 0.25 }
      ]}, { date: 'last-date' }]});
      expect(wrapper.find('DivergingBar').at(0).prop('selected')).toEqual('Hard Bounces');
    });

    it('uses first component weight of last date without an existing date and new data', () => {
      wrapper = shallow(<HealthScorePage {...props} selected='initial-date'/>);
      wrapper.setProps({ data: [{ date: 'first-date' }, { date: 'last-date', weights: [
        { weight_type: 'Hard Bounces', weight: 0.5, weight_value: 0.25 },
        { weight_type: 'Complaints', weight: 0.5, weight_value: 0.25 }
      ]}]});
      expect(wrapper.find('DivergingBar').at(0).prop('selected')).toEqual('Hard Bounces');
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

    it('renders tooltip content for selected component', () => {
      wrapper.find('DivergingBar').at(0).simulate('click', { payload: { weight_type: 'Complaints' }});
      const Tooltip = wrapper.find('BarChart').at(2).prop('tooltipContent');
      expect(shallow(<Tooltip payload={{ weight_value: 0.0012345 }} />)).toMatchSnapshot();
    });

    it('renders tooltip content for component weights', () => {
      const Tooltip = wrapper.find('DivergingBar').prop('tooltipContent');
      expect(shallow(<Tooltip payload={{ weight_type: 'Other bounces' }} />)).toMatchSnapshot();
    });

    it('renders y label content for component weights', () => {
      const label = wrapper.find('DivergingBar').prop('yLabel');
      expect(label({ value: 'eng cohorts: new, 14-day' })).toMatchSnapshot();
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

    it('renders component y ticks', () => {
      const axisProps = wrapper.find('BarChart').at(2).prop('yAxisProps');
      expect(axisProps.tickFormatter(0.003)).toEqual('0.3%');
    });
  });
});
