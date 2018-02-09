import React from 'react';
import { shallow } from 'enzyme';
import { EngagementFilters } from '../EngagementFilters';
import time from 'src/__testHelpers__/time';

const defaultProps = {
  addFilters: jest.fn(),
  filters: {
    activeList: [],
    from: time({ day: 1 }),
    relativeRange: 'day',
    to: time({ day: 2 })
  },
  location: { search: '' },
  onLoad: jest.fn(),
  refreshRelativeRange: jest.fn(),
  initTypeaheadCache: jest.fn()
};

it('renders filters, hydrates with filters from query string, and requests data', () => {
  const props = {
    ...defaultProps,
    location: { search: '?range=custom&from=2018-01-15T00:00:00Z&to=2018-01-16T00:00:00Z' }
  };
  const wrapper = shallow(<EngagementFilters {...props} />);

  expect(props.addFilters).toHaveBeenCalledWith([]);
  expect(props.refreshRelativeRange).toHaveBeenCalledWith({
    from: time({ year: 2018, month: 1, day: 15 }),
    metrics: [],
    relativeRange: 'custom',
    to: time({ year: 2018, month: 1, day: 16 })
  });
  expect(props.onLoad).toHaveBeenCalled();
  expect(props.initTypeaheadCache).toHaveBeenCalled();
  expect(wrapper).toMatchSnapshot();
});

it('updates range and requests new data when filters change', () => {
  const props = { ...defaultProps };
  const nextRange = {
    from: time({ year: 2018, month: 1, day: 15 }),
    relativeRange: 'custom',
    to: time({ year: 2018, month: 1, day: 16 })
  };
  const wrapper = shallow(<EngagementFilters {...props} />);
  wrapper.instance().onFilterChange(nextRange);

  expect(props.refreshRelativeRange).toHaveBeenCalledWith(nextRange);
  expect(props.onLoad).toHaveBeenCalledTimes(2); // on mount and event
});

it('displays share modal', () => {
  const props = { ...defaultProps };
  const wrapper = shallow(<EngagementFilters {...props} />);

  wrapper.instance().onToggleShareModal();
  wrapper.update();

  expect(wrapper).toMatchSnapshot();
});
