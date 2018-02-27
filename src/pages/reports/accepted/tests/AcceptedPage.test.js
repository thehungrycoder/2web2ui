import React from 'react';
import { AcceptedPage } from '../AcceptedPage';
import { shallow } from 'enzyme';
// import * as reportHelpers from 'src/helpers/reports';

jest.mock('src/helpers/reports');

// Date.now = jest.fn(() => 1487076708000);

describe('AcceptedPage: ', () => {

  const props = {
    loading: false,
    aggregates: { count_accepted: 1 },
    refreshAcceptedReport: jest.fn(),
    addFilters: jest.fn()
  };

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<AcceptedPage {...props} />);
  });

  it('should render', () => {
    expect(props.refreshAcceptedReport).not.toHaveBeenCalled();
    expect(wrapper).toMatchSnapshot();
  });

  it('should refresh when report options reference changes', () => {
    const newReportOptions = {};
    expect(props.refreshAcceptedReport).not.toHaveBeenCalled();
    wrapper.setProps({ reportOptions: newReportOptions });
    expect(props.refreshAcceptedReport).toHaveBeenCalledWith(newReportOptions);
  });

  it('should render correctly with no accepted results', () => {
    wrapper.setProps({ aggregates: null });
    expect(wrapper.find('Empty')).toMatchSnapshot();
  });

  it('should render loading correctly over top level metrics', () => {
    wrapper.setProps({ loading: true });
    expect(wrapper.find('PanelLoading')).toHaveLength(1);
  });

});
