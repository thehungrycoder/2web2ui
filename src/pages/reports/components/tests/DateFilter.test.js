import React from 'react';
import { shallow } from 'enzyme';
import _ from 'lodash';
import * as dateHelpers from 'src/helpers/date';
import { DateFilter } from '../DateFilter';

jest.mock('src/helpers/date');

describe('Component: DateFilter', () => {

  let wrapper;
  let instance;
  let props;
  let mockNow;
  let mockFrom;

  beforeEach(() => {
    mockNow = new Date('2018-01-15T12:00:00');
    mockFrom = new Date(mockNow);
    mockFrom.setHours(mockFrom.getHours() - 1);
    props = {
      filter: {
        from: mockFrom,
        to: mockNow,
        relativeRange: 'day'
      },
      refresh: jest.fn(),
      now: mockNow
    };
    wrapper = shallow(<DateFilter {...props} />);
    instance = wrapper.instance();
    // spy on all instance methods
    _.functions(instance).forEach((f) => jest.spyOn(instance, f));
  });

  afterEach(() => jest.restoreAllMocks());

  it('should render ok by default', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should sync state to props on new props', () => {
    wrapper.setProps({});
    expect(instance.syncPropsToState).toHaveBeenCalledTimes(1);
  });

  it('should properly mount', () => {
    jest.spyOn(window, 'addEventListener');

    instance.componentDidMount();
    expect(instance.syncPropsToState).toHaveBeenCalledTimes(1);
    expect(window.addEventListener).toHaveBeenCalledTimes(2);
    expect(window.addEventListener).toHaveBeenCalledWith('click', instance.handleClickOutside);
    expect(window.addEventListener).toHaveBeenCalledWith('keydown', instance.handleKeyDown);
  });

  it('should properly unmount', () => {
    jest.spyOn(window, 'removeEventListener');

    instance.componentWillUnmount();
    expect(window.removeEventListener).toHaveBeenCalledTimes(2);
    expect(window.removeEventListener).toHaveBeenCalledWith('click', instance.handleClickOutside);
    expect(window.removeEventListener).toHaveBeenCalledWith('keydown', instance.handleKeyDown);
  });

  describe('syncPropsToState', () => {

    it('should sync the state', () => {
      const before = { from: 'unchanged', to: 'unchanged' };
      const after = { from: 'changed', to: 'changed' };
      wrapper.setState({ selected: before });
      expect(wrapper.state('selected')).toEqual(before);

      instance.syncPropsToState({ filter: after });
      expect(wrapper.state('selected')).toEqual(after);
    });

  });

  describe('handleKeyDown', () => {

    const ESCAPE = { key: 'Escape' };
    const ENTER = { key: 'Enter' };

    it('should do nothing if picker is closed already', () => {
      wrapper.setState({ showDatePicker: false });
      instance.handleKeyDown(ESCAPE);
      expect(instance.cancelDatePicker).not.toHaveBeenCalled();
      expect(instance.handleSubmit).not.toHaveBeenCalled();
      expect(wrapper.state('showDatePicker')).toEqual(false);
    });

    it('should cancel date picker on escape keydown', () => {
      wrapper.setState({ showDatePicker: true });
      instance.handleKeyDown(ESCAPE);
      expect(instance.cancelDatePicker).toHaveBeenCalledTimes(1);
      expect(instance.handleSubmit).not.toHaveBeenCalled();
      expect(wrapper.state('showDatePicker')).toEqual(false);
    });

    it('should submit on enter', () => {
      wrapper.setState({ showDatePicker: true, selecting: false });
      instance.handleKeyDown(ENTER);
      expect(instance.cancelDatePicker).not.toHaveBeenCalled();
      expect(instance.handleSubmit).toHaveBeenCalledTimes(1);
      expect(wrapper.state('showDatePicker')).toEqual(false);
    });

    it('should not submit if selecting is true', () => {
      wrapper.setState({ showDatePicker: true, selecting: true });
      instance.handleKeyDown(ENTER);
      expect(instance.cancelDatePicker).not.toHaveBeenCalled();
      expect(instance.handleSubmit).not.toHaveBeenCalled();
      expect(wrapper.state('showDatePicker')).toEqual(true);
    });

  });

  describe('handleDayKeyDown', () => {

    it('should stop propagation on a day key down event', () => {
      const e = { stopPropagation: jest.fn() };
      const x = '';
      instance.handleDayKeyDown(x, x, e);
      expect(instance.handleKeyDown).toHaveBeenCalledWith(e);
      expect(e.stopPropagation).toHaveBeenCalledTimes(1);
    });

  });

  describe('cancelDatePicker', () => {

    it('should sync props and close date picker', () => {
      wrapper.setState({ showDatePicker: true });
      instance.cancelDatePicker();
      expect(instance.syncPropsToState).toHaveBeenCalledWith(instance.props);
      expect(wrapper.state('showDatePicker')).toEqual(false);
    });

  });

  describe('showDatePicker', () => {

    it('should set date picker state', () => {
      wrapper.setState({ showDatePicker: false });
      instance.showDatePicker();
      expect(wrapper.state('showDatePicker')).toEqual(true);
    });

  });

  describe('handleDayClick', () => {

    it('should handle a day click while selecting', () => {
      const mockSelected = {};
      wrapper.setState({ selecting: true, selected: mockSelected, beforeSelected: null });
      instance.handleDayClick();
      expect(dateHelpers.getStartOfDay).not.toHaveBeenCalled();
      expect(wrapper.state('selected')).toBe(mockSelected);
      expect(wrapper.state('beforeSelected')).toBe(mockSelected);
      expect(wrapper.state('selecting')).toEqual(false);
    });

    it('should handle a day click when not selecting', () => {
      const mockSelected = {};
      const mockClicked = {};
      dateHelpers.getStartOfDay = jest.fn(() => 'start-of-day');
      dateHelpers.getEndOfDay = jest.fn(() => 'end-of-day');
      wrapper.setState({ selecting: false, selected: mockSelected, beforeSelected: null });
      const mockNewSelected = { from: 'start-of-day', to: 'end-of-day' };

      instance.handleDayClick(mockClicked);

      expect(dateHelpers.getStartOfDay).toHaveBeenCalledWith(mockClicked);
      expect(dateHelpers.getEndOfDay).toHaveBeenCalledWith(mockClicked, { preventFuture: true });
      expect(wrapper.state('selected')).toEqual(mockNewSelected);
      expect(wrapper.state('beforeSelected')).toEqual(mockNewSelected);
      expect(wrapper.state('selecting')).toEqual(true);
    });

  });

});
