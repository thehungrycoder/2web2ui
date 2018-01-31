import React from 'react';
import { shallow } from 'enzyme';
import cases from 'jest-in-case';
import time from 'src/__testHelpers__/time';

import { EngagementSummary } from '../EngagementSummary';

cases('EngagementSummary', (props) => {
  const wrapper = shallow(<EngagementSummary {...props} />);
  expect(wrapper).toMatchSnapshot();
}, {
  'renders loading panel': { loading: true },
  'returns null': { loading: false },
  'renders metric summary': {
    clicks: 123,
    filters: { relativeRange: 'hour' },
    loading: false,
    opens: 523,
    targeted: 123123
  },
  'renders metric summary with custom time range': {
    clicks: 123,
    filters: {
      from: time({ day: 1 }),
      relativeRange: 'custom',
      to: time({ day: 3 })
    },
    loading: false,
    opens: 523,
    targeted: 123123
  }
});
