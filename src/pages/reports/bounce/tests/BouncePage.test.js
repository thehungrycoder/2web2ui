import React from 'react';
import { BouncePage } from '../BouncePage';
import { shallow } from 'enzyme';
import * as reportHelpers from 'src/helpers/reports';

jest.mock('src/helpers/reports');

Date.now = jest.fn(() => 1487076708000);

describe('BouncePage: ', () => {

  const props = {
    loading: false,
    aggregates: { countBounce: 1 },
    reasons: [ {
      bounce_category_name: "Block",
      bounce_class_description: "The message was blocked by the receiver as coming from a known spam source",
      bounce_class_name: "Spam Block",
      classification_id: 51,
      count_bounce: 5,
      domain: "yahoo.com",
      reason: "554 - 5.7.1 Blacklisted by 'twoomail.com'(twoo.com.multi.surbl.org) Contact the postmaster of this domain for resolution. This attempt has been logged."
    } ],
    refreshBounceChartMetrics: jest.fn((a) => Promise.resolve()),
    refreshBounceTableMetrics: jest.fn((a) => Promise.resolve()),
    refreshTypeaheadCache: jest.fn((a) => Promise.resolve()),
    addFilter: jest.fn(),
    location: {
      search: {}
    },
    history: {
      replace: jest.fn()
    }
  };

  let wrapper;
  let spyFilterListFromSearch;
  let spyParseSearch;
  let spyGetShare;

  beforeEach(() => {
    spyFilterListFromSearch = reportHelpers.getFilterListFromSearch = jest.fn(() => []);
    spyParseSearch = reportHelpers.parseSearch = jest.fn(() => ({ options: {}}));
    spyGetShare = reportHelpers.getShareLink = jest.fn(() => ({ link: '', search: '' }));
    wrapper = shallow(<BouncePage {...props} />);
  });

  afterEach(() => {
    spyFilterListFromSearch.mockRestore();
    spyParseSearch.mockRestore();
    spyGetShare.mockRestore();
  });

  it('should render', () => {
    const parseSpy = jest.spyOn(wrapper.instance(), 'parseSearch');
    wrapper.instance().componentDidMount();
    expect(props.refreshBounceChartMetrics).toHaveBeenCalled();
    expect(props.refreshBounceTableMetrics).toHaveBeenCalled();
    expect(parseSpy).toHaveBeenCalled();
    expect(props.refreshTypeaheadCache).toHaveBeenCalled();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with no bounces', () => {
    wrapper.setProps({ aggregates: null });
    expect(wrapper).toMatchSnapshot();
  });
});
