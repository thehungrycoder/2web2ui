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
    refresh: jest.fn((a) => Promise.resolve()),
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
    expect(props.refresh).toHaveBeenCalled();
    expect(parseSpy).toHaveBeenCalled();
    expect(props.refreshTypeaheadCache).toHaveBeenCalled();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with no bounces', () => {
    wrapper.setProps({ aggregates: null });
    expect(wrapper).toMatchSnapshot();
  });
});
