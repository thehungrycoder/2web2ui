import React from 'react';
import { shallow } from 'enzyme';
import EngagementChart from '../EngagementChart';

it('renders engagement chart with defaults', () => {
  const wrapper = shallow(<EngagementChart />);
  expect(wrapper).toMatchSnapshot();
});

it('renders engagement chart with metrics', () => {
  const props = {
    accepted: 40000,
    clicks: 2525,
    opens: 5000,
    targeted: 50000
  };
  const wrapper = shallow(<EngagementChart {...props} />);

  expect(wrapper).toMatchSnapshot();
});
