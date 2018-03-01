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

  describe('with active filters', () => {

    beforeEach(() => {
      wrapper.setProps({
        reportOptions: { filters: [
          { type: 'A', value: 'aaa' },
          { type: 'B', value: 'bbb' },
          { type: 'C', value: 'ccc' }
        ]}
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

  it('should update the link when report options change', () => {
    const newReportOptions = {
      filters: []
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

    beforeEach(() => {
      testProps.reportOptions.from = 'from';
      testProps.reportOptions.to = 'to';
      testProps.reportOptions.relativeRange = 'custom';
    });

    it('should not refresh if relative range does not change', () => {
      isSameDate.mockImplementation(() => false);
      testProps.reportOptions.relativeRange = 'day';

      wrapper.setProps({
        reportOptions: {
          ...testProps.reportOptions,
          from: 'changed-from',
          to: 'changed-to',
          relativeRange: 'day'
        }
      });

      expect(testProps.refreshTypeaheadCache).not.toHaveBeenCalled();
    });

    it('should not refresh if range is "custom" but dates have not changed', () => {
      isSameDate.mockImplementation(() => true);
      testProps.reportOptions.relativeRange = 'custom';

      wrapper.setProps({
        reportOptions: {
          ...testProps.reportOptions,
          from: 'from',
          to: 'to',
          relativeRange: 'custom'
        }
      });

      expect(testProps.refreshTypeaheadCache).not.toHaveBeenCalled();
    });

    it('should refresh if the range changes', () => {
      isSameDate.mockImplementation(() => true);
      testProps.reportOptions.relativeRange = 'day';

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

    // it('should refresh if dates change and relative range is "custom"', () => {
    //   reportOptions.maybeRefreshTypeaheadCache({
    //     from: updatedFrom,
    //     to: currentTo,
    //     relativeRange: 'custom'
    //   })(dispatchMock, getStateMock);

    //   expect(dispatchMock).toHaveBeenCalledTimes(1);
    // });

    // it('should refresh if dates change and relative range is also changing', () => {
    //   testState.reportOptions.relativeRange = 'day';
    //   reportOptions.maybeRefreshTypeaheadCache({
    //     from: updatedFrom,
    //     to: currentTo,
    //     relativeRange: '7days'
    //   })(dispatchMock, getStateMock);

    //   expect(dispatchMock).toHaveBeenCalledTimes(1);
    // });

    // it('should not refresh if dates change but relative range stays the same and is not "custom"', () => {
    //   testState.reportOptions.relativeRange = 'day';
    //   reportOptions.maybeRefreshTypeaheadCache({
    //     from: updatedFrom,
    //     to: currentTo,
    //     relativeRange: 'day'
    //   })(dispatchMock, getStateMock);

    //   expect(dispatchMock).not.toHaveBeenCalled();
    // });

  });

});
