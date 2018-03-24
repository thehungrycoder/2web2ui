import React from 'react';
import { shallow } from 'enzyme';
import { ReportOptions } from '../ReportOptions';
import { Tag } from '@sparkpost/matchbox';
import Typeahead from '../Typeahead';
import * as reportHelpers from 'src/helpers/reports';
import { isSameDate } from 'src/helpers/date';

jest.mock('src/helpers/date');
jest.mock('src/helpers/reports');

describe('Component: Report Options', () => {

  let wrapper;
  let testProps;
  let filters;
  let options;
  let testQuery;

  beforeEach(() => {
    const testDate = new Date('2018-02-15T12:00:00Z');
    options = {};
    filters = [];
    testQuery = {};
    reportHelpers.getReportSearchOptions = jest.fn(() => testQuery);
    reportHelpers.parseSearch = jest.fn(() => ({ options, filters }));
    testProps = {
      addFilters: jest.fn(),
      removeFilter: jest.fn(),
      typeaheadCache: [],
      reportOptions: {
        from: testDate,
        to: testDate,
        relativeRange: 'day',
        filters
      },
      location: {
        search: '?some=test',
        pathname: 'my-pathname'
      },
      history: {
        replace: jest.fn()
      },
      initTypeaheadCache: jest.fn(),
      refreshReportOptions: jest.fn(),
      refreshTypeaheadCache: jest.fn()
    };
    wrapper = shallow(<ReportOptions {...testProps} />);
  });

  it('should mount and render correctly', () => {
    expect(reportHelpers.parseSearch).toHaveBeenCalledWith(testProps.location.search);
    expect(testProps.addFilters).toHaveBeenCalledWith(filters);
    expect(testProps.refreshReportOptions).toHaveBeenCalledWith(options);
    expect(testProps.initTypeaheadCache).toHaveBeenCalledTimes(1);
    expect(wrapper).toMatchSnapshot();
  });

  describe('componentDidUpdate', () => {
    let instance;
    beforeEach(() => {
      instance = wrapper.instance();
      wrapper.setProps({ reportOptions: { filters: []}});
      instance.maybeRefreshFilterTypeaheadCache = jest.fn();
    });

    it('refreshes typeahead cache if searchOptions change', () => {
      instance.componentDidUpdate({ reportOptions: { filters: ['something']}});
      expect(instance.maybeRefreshFilterTypeaheadCache).toHaveBeenCalledTimes(1);

    });

    it('does not refresh typeahead cache if searchOptions do not change', () => {
      instance.componentDidUpdate({ reportOptions: { filters: []}});
      expect(instance.maybeRefreshFilterTypeaheadCache).toHaveBeenCalledTimes(0);

    });
  });
  describe('with active filters', () => {

    beforeEach(() => {
      wrapper.setProps({
        reportOptions: {
          ...testProps.reportOptions,
          filters: [
            { type: 'A', value: 'aaa' },
            { type: 'B', value: 'bbb' },
            { type: 'C', value: 'ccc' }
          ]
        }
      });
    });

    it('should render', () => {
      const tags = wrapper.find(Tag);
      expect(tags).toHaveLength(3);
      expect(wrapper).toMatchSnapshot();
    });

    it('should remove a filter by index', () => {
      const tags = wrapper.find(Tag);
      tags.first().simulate('remove');
      expect(testProps.removeFilter).toHaveBeenCalledWith(0);
    });

  });

  it('should select a typeahead item', () => {
    const typeahead = wrapper.find(Typeahead);
    const item = {};
    typeahead.simulate('select', item);
    expect(testProps.addFilters).toHaveBeenCalledWith([item]);
  });

  describe('maybeRefreshFilterTypeaheadCache', () => {
    let instance;
    let reportOptions;
    beforeEach(() => {
      reportOptions = {
        ...testProps.reportOptions,
        relativeRange: 'day'
      };

      instance = wrapper.instance();
      isSameDate.mockImplementation(() => false);
    });

    it('should not refresh if relative range does not change', () => {
      instance.maybeRefreshFilterTypeaheadCache(reportOptions);
      expect(testProps.refreshTypeaheadCache).not.toHaveBeenCalled();
    });

    it('should not refresh if range is "custom" and dates have not changed', () => {
      isSameDate.mockReturnValue(true);
      reportOptions.relativeRange = 'custom';
      wrapper.setProps({ reportOptions });
      testProps.refreshTypeaheadCache.mockReset();

      instance.maybeRefreshFilterTypeaheadCache(reportOptions);
      expect(testProps.refreshTypeaheadCache).not.toHaveBeenCalled();
    });

    it('should refresh if the range changes', () => {
      const newReportOptions = { ...reportOptions, relativeRange: '7days' };
      instance.maybeRefreshFilterTypeaheadCache(newReportOptions);
      expect(testProps.refreshTypeaheadCache).toHaveBeenCalledWith(reportOptions);
    });

    it('should refresh if range is "custom" and dates change', () => {
      const newReportOptions = { ...reportOptions, relativeRange: 'custom' };
      instance.maybeRefreshFilterTypeaheadCache(newReportOptions);
      expect(testProps.refreshTypeaheadCache).toHaveBeenCalledWith(reportOptions);
    });

  });

});
