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
      fill: '#unselected',
      selectedFill: '#selected'
    };
    wrapper = shallow(<BarChart {...props}/>);
  });

  describe('normal bar', () => {
    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('renders unselected bar shape correctly', () => {
      const payload = { payload: { date: '2011-01-01' }, test: 'test' };
      expect(wrapper.find('Bar').at(1).props().shape(payload)).toMatchSnapshot();
    });

    it('renders selected bar shape correctly', () => {
      wrapper.setProps({ selected: '2011-01-01' });
      const payload = { payload: { date: '2011-01-01' }, test: 'test' };
      expect(wrapper.find('Bar').at(1).props().shape(payload)).toMatchSnapshot();
    });

    it('renders background bars with no opacity', () => {
      const payload = { payload: { date: '2011-01-01' }, test: 'test' };
      expect(wrapper.find('Bar').at(0).props().shape(payload)).toMatchSnapshot();
    });
  });

  describe('stacked bar', () => {
    beforeEach(() => {
      wrapper.setProps({ timeSeries: stacked, yKeys });
    });

    it('renders a stacked bar chart correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('renders selected bar shape correctly without changing fill', () => {
      wrapper.setProps({ selected: '2011-01-01' });
      const payload = { payload: { date: '2011-01-01' }, test: 'test' };
      expect(wrapper.find('Bar').at(1).props().shape(payload)).toMatchSnapshot();
    });

    it('renders a selected background when selected', () => {
      wrapper.setProps({ selected: '2011-01-01' });
      const payload = { payload: { date: '2011-01-01' }, test: 'test' };
      expect(wrapper.find('Bar').at(0).props().shape(payload)).toMatchSnapshot();
    });
  });
});
