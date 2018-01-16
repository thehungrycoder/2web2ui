import React from 'react';
import { shallow } from 'enzyme';
import cases from 'jest-in-case';
import { EngagementPage } from '../EngagementPage';

cases('EngagementPage', (props) => {
  const wrapper = shallow(<EngagementPage {...props} />);
  expect(wrapper).toMatchSnapshot();
}, {
  'renders loading panel': {
    chart: { data: {}, loading: true },
    getChartData: jest.fn()
  },
  'renders engagement report page with data': {
    chart: {
      data: {
        count_accepted: 1,
        count_targeted: 2,
        count_unique_clicked_approx: 3,
        count_unique_confirmed_opened_approx: 4
      },
      loading: false
    },
    getChartData: jest.fn()
  }
});
