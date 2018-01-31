import React from 'react';
import { shallow } from 'enzyme';
import cases from 'jest-in-case';

import { EngagementSummary } from '../EngagementSummary';

cases('EngagementSummary', (props) => {
  const wrapper = shallow(<EngagementSummary {...props} />);
  expect(wrapper).toMatchSnapshot();
}, {
  'renders loading panel': { loading: true },
  'returns null': { loading: false },
  'redners metric summary': {
    clicks: 123,
    loading: false,
    targeted: 123123
  }
});
