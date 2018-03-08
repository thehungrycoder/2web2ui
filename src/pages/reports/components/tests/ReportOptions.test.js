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

  it('should render with share modal on', () => {
    wrapper.find('#shareModalButton').simulate('click');
    expect(wrapper).toMatchSnapshot();
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

  it('should update the link when report options reference changes', () => {
    const newReportOptions = {
      ...testProps.reportOptions
    };
    testQuery.abc = 123;
    wrapper.setProps({ reportOptions: newReportOptions, extraLinkParams: ['hello']});
    expect(reportHelpers.getReportSearchOptions).toHaveBeenCalledWith(newReportOptions, ['hello']);
    expect(testProps.history.replace).toHaveBeenCalledWith({
      pathname: 'my-pathname',
      search: 'abc=123'
    });
    expect(wrapper.state('query')).toEqual(testQuery);
  });

  describe('maybeRefreshFilterTypeaheadCache', () => {

    it('should not refresh if relative range does not change', () => {
      isSameDate.mockImplementation(() => false);

      wrapper.setProps({
        reportOptions: {
          ...testProps.reportOptions,
          relativeRange: 'day'
        }
      });

      expect(testProps.refreshTypeaheadCache).not.toHaveBeenCalled();
    });

    it('should not refresh if range is "custom" and dates have not changed', () => {
      isSameDate.mockImplementation(() => true);

      wrapper.setProps({
        reportOptions: {
          ...testProps.reportOptions,
          relativeRange: 'custom'
        }
      });

      testProps.refreshTypeaheadCache.mockReset();

      wrapper.setProps({
        reportOptions: {
          ...testProps.reportOptions,
          relativeRange: 'custom'
        }
      });

      expect(testProps.refreshTypeaheadCache).not.toHaveBeenCalled();
    });

    it('should refresh if the range changes', () => {
      isSameDate.mockImplementation(() => true);

      wrapper.setProps({
        reportOptions: {
          ...testProps.reportOptions,
          relativeRange: '7days'
        }
      });

      expect(testProps.refreshTypeaheadCache).toHaveBeenCalledWith(wrapper.instance().props.reportOptions);
    });

    it('should refresh if custom range dates change', () => {
      isSameDate.mockImplementation(() => false);
      testProps.reportOptions.relativeRange = 'custom';

      wrapper.setProps({
        reportOptions: {
          ...testProps.reportOptions,
          relativeRange: 'custom'
        }
      });

      expect(testProps.refreshTypeaheadCache).toHaveBeenCalledWith(wrapper.instance().props.reportOptions);
    });

  });

});
