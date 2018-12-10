import { shallow } from 'enzyme';
import React from 'react';
import BarChart from '../BarChart';

describe('BarChart Component', () => {
  let wrapper;
  let props;
  const normal = [{ value: 2, date: '2011-01-01' }];
  const stacked = [
    { ab: 2, cd: 3, date: '2011-01-01' },
    { ab: 5, cd: 8, date: '2011-01-02' }
  ];
  const yKeys = [
    { key: 'ab', fill: 'blue' },
    { key: 'cd', fill: 'red' }
  ];

  beforeEach(() => {
    props = {
      timeSeries: normal,
      xKey: 'date',
      yRange: [0,5],
      height: 50,
      width: 100,
      onClick: jest.fn(),
      tooltipContent: jest.fn(),
      fill: '#fill'
    };
    wrapper = shallow(<BarChart {...props}/>);
  });

  it('renders a normal bar chart correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('renders a stacked bar chart correctly', () => {
    wrapper.setProps({ timeSeries: stacked, yKeys });
    const bars = wrapper.find('Bar').slice(1);
    expect(bars).toMatchSnapshot();
  });

  it('renders background bars with no opacity if unselected', () => {
    const payload = { payload: { date: '2011-01-01' }, test: 'test' };
    expect(wrapper.find('Bar').at(0).props().shape(payload)).toMatchSnapshot();
  });

  it('renders background bars with opacity if selected', () => {
    wrapper.setProps({ selected: '2011-01-01' });
    const payload = { payload: { date: '2011-01-01' }, test: 'test' };
    expect(wrapper.find('Bar').at(0).props().shape(payload)).toMatchSnapshot();
  });
});
