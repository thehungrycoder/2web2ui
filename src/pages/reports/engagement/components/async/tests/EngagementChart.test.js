import React from 'react';
import { shallow } from 'enzyme';
import EngagementChart from '../EngagementChart';

it('renders engagement chart', () => {
  const wrapper = shallow(<EngagementChart />);
  expect(wrapper).toMatchSnapshot();
});
