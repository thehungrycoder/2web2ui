import React from 'react';
import { RejectionPage } from '../RejectionPage';
import { shallow } from 'enzyme';
import * as reportHelpers from 'src/helpers/reports';

jest.mock('src/helpers/reports');

describe('RejectionPage: ', () => {
  let props;
  let wrapper;
  let spyParseSearch;

  beforeEach(() => {
    spyParseSearch = reportHelpers.parseSearch = jest.fn(() => ({ options: {}}));

    props = {
      loading: false,
      filters: {},
      list: [
        {
          count_rejected: 65,
          rejection_category_name: 'Policy Rejection',
          rejection_category_id: 1,
          reason: '551 - Cannot Relay 105',
          domain: 'gmail.com'
        },
        {
          count_rejected: 62,
          rejection_category_name: 'Policy Rejection',
          rejection_category_id: 1,
          reason: '550 - Invalid recipient ...@... (#5.1.1)',
          domain: 'gmail.com'
        }
      ],
      loadRejectionByDomainReports: jest.fn(() => Promise.resolve()),
      refreshTypeaheadCache: jest.fn(),
      addFilter: jest.fn(),
      location: {
        search: {}
      },
      showAlert: jest.fn()
    };
    spyParseSearch = reportHelpers.parseSearch = jest.fn(() => ({ options: {}}));
    wrapper = shallow(<RejectionPage {...props} />);
  });

  afterEach(() => {
    spyParseSearch.mockRestore();
  });

  it('should render', () => {
    expect(spyParseSearch).toHaveBeenCalledTimes(1);
    expect(props.refreshTypeaheadCache).toHaveBeenCalled();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with no rejections', () => {
    wrapper.setProps({ list: []});
    expect(wrapper).toMatchSnapshot();
  });
});
