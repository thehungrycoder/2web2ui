import React from 'react';
import { shallow } from 'enzyme';
import cases from 'jest-in-case';
import EngagementChart from '../EngagementChart';

cases('EngagementChart', (props) => {
  const wrapper = shallow(<EngagementChart {...props} />);
  expect(wrapper).toMatchSnapshot();
}, {
  'renders loading by default': {},
  'renders empty panel': { loading: false },
  'renders engagement chart': {
    accepted: 40000,
    clicks: 2525,
    loading: false,
    opens: 5000,
    targeted: 50000
  }
});
