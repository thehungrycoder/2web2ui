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
    table: {
      data: [
        { count_clicked: 1776, count_raw_clicked_approx: 1657, link_name: 'Raw URL' }
      ],
      loading: false
    },
    getChartData: jest.fn(),
    getTableData: jest.fn()
  };
  const wrapper = shallow(<EngagementPage {...props} />);

  expect(wrapper).toMatchSnapshot();
});

it('displays global alert when request to fetch data fails', async() => {
  const props = {
    chart: { data: {}},
    table: { data: []},
    getChartData: jest.fn(() => Promise.reject()),
    getTableData: jest.fn(() => Promise.reject()),
    showAlert: jest.fn()
  };

  const wrapper = shallow(<EngagementPage {...props} />);
  await wrapper.instance().onLoad();

  expect(props.showAlert).toHaveBeenCalledWith(expect.objectContaining({
    message: expect.stringMatching(/engagement data/),
    type: 'error'
  }));

  expect(props.showAlert).toHaveBeenCalledWith(expect.objectContaining({
    message: expect.stringMatching(/click data/),
    type: 'error'
  }));
});
