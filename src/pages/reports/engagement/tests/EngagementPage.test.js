import React from 'react';
import { shallow } from 'enzyme';
import { EngagementPage } from '../EngagementPage';

it('renders engagement report page', () => {
  const props = {
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
  };
  const wrapper = shallow(<EngagementPage {...props} />);

  expect(wrapper).toMatchSnapshot();
});
