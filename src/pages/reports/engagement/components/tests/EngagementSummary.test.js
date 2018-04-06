import React from 'react';
import { shallow } from 'enzyme';
import cases from 'jest-in-case';
import moment from 'moment';

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
    sent: 123123
  },
  'renders metric summary with custom time range': {
    clicks: 123,
    filters: {
      from: moment('2018-01-31T20:00:00'),
      relativeRange: 'custom',
      to: moment('2018-02-01T20:00:00')
    },
    loading: false,
    opens: 523,
    sent: 123123
  }
});
