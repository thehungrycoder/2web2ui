/* eslint max-lines: ["error", 341] */
import React from 'react';
import { shallow } from 'enzyme';
import _ from 'lodash';
import * as dateHelpers from 'src/helpers/date';
import { DateFilter } from '../DateFilter';
import utc from 'src/__testHelpers__/time';

jest.mock('src/helpers/date');
jest.mock('react-dom');
jest.mock('date-fns');

describe('Component: DateFilter', () => {

  let wrapper;
  let instance;
  let props;
  let mockNow;
  let mockFrom;

  beforeEach(() => {
    mockNow = utc({ year: 2017, month: 1, day: 15, hour: 12 });
    mockFrom = utc({ year: 2017, month: 1, day: 15, hour: 11 });
    props = {
      filter: {
        from: mockFrom,
        to: mockNow,
        relativeRange: 'day'
      },
      refreshReportOptions: jest.fn(),
      now: mockNow,
      reportLoading: false
    };
    wrapper = shallow(<DateFilter {...props} />);
    instance = wrapper.instance();
    // spy on all instance methods
    _.functions(instance).forEach((f) => jest.spyOn(instance, f));

    dateHelpers.getStartOfDay = jest.fn(() => 'start-of-day');
    dateHelpers.getEndOfDay = jest.fn(() => 'end-of-day');
  });

  it('should render ok by default', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should sync props to state on new props', () => {
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

  describe('handleClickOutside', () => {

    it('should hide date picker when no DOM node is found', () => {
      wrapper.setState({ showDatePicker: true });
      instance.handleClickOutside();
      expect(wrapper.state('showDatePicker')).toEqual(false);
    });

    // Note: can't test other scenarios for this method because you
    // can't (AFAICT) mock react-dom's findDOMNode method to return
    // different things in different tests

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

  describe('handleDayHover', () => {

    it('should handle a day hover while selecting', () => {
      const mockOrderedRange = { from: 'from', to: 'to' };
      const mockHovered = {};
      instance.getOrderedRange = jest.fn(() => mockOrderedRange);
      wrapper.setState({ selecting: true });

      instance.handleDayHover(mockHovered);

      expect(instance.getOrderedRange).toHaveBeenCalledWith(mockHovered);
      expect(wrapper.state('selected')).toEqual(mockOrderedRange);
    });

    it('should handle a day hover when not selecting', () => {
      const mockHovered = {};
      const mockSelected = {};
      instance.getOrderedRange = jest.fn();
      wrapper.setState({ selecting: false, selected: mockSelected });

      instance.handleDayHover(mockHovered);

      expect(instance.getOrderedRange).not.toHaveBeenCalled();
      expect(wrapper.state('selected')).toEqual(mockSelected);
    });

  });

  describe('getOrderedRange', () => {

    it('should return correct range when new date is between from and to', () => {
      const from = new Date('2018-01-01');
      const newDate = new Date('2018-01-02');
      const to = new Date('2018-01-03');

      wrapper.setState({ beforeSelected: { from, to }});
      const range = instance.getOrderedRange(newDate);

      expect(dateHelpers.getEndOfDay).toHaveBeenCalledWith(newDate, { preventFuture: true });
      expect(dateHelpers.getStartOfDay).not.toHaveBeenCalled();
      expect(range).toEqual({ from, to: 'end-of-day' });
    });

    it('should return correct range when new date is before from and to', () => {
      const newDate = new Date('2018-01-01');
      const from = new Date('2018-01-02');
      const to = new Date('2018-01-03');

      wrapper.setState({ beforeSelected: { from, to }});
      const range = instance.getOrderedRange(newDate);

      expect(dateHelpers.getEndOfDay).not.toHaveBeenCalled();
      expect(dateHelpers.getStartOfDay).toHaveBeenCalledWith(newDate);
      expect(range).toEqual({ from: 'start-of-day', to });
    });

    it('should return correct range when new date is after from and to', () => {
      const from = new Date('2018-01-01');
      const to = new Date('2018-01-02');
      const newDate = new Date('2018-01-03');

      wrapper.setState({ beforeSelected: { from, to }});
      const range = instance.getOrderedRange(newDate);

      expect(dateHelpers.getEndOfDay).toHaveBeenCalledWith(newDate, { preventFuture: true });
      expect(dateHelpers.getStartOfDay).not.toHaveBeenCalled();
      expect(range).toEqual({ from, to: 'end-of-day' });
    });

    it('should return correct range when from and newDate are the same', () => {
      const from = new Date('2018-01-01');
      const newDate = new Date('2018-01-01');
      const to = new Date('2018-01-03');

      wrapper.setState({ beforeSelected: { from, to }});
      const range = instance.getOrderedRange(newDate);

      expect(dateHelpers.getEndOfDay).toHaveBeenCalledWith(newDate, { preventFuture: true });
      expect(dateHelpers.getStartOfDay).not.toHaveBeenCalled();
      expect(range).toEqual({ from, to: 'end-of-day' });
    });

  });

  describe('handleSelectRange', () => {

    let e;

    beforeEach(() => {
      e = {
        currentTarget: {}
      };
    });

    it('should open date picker for custom value', () => {
      e.currentTarget.value = 'custom';
      wrapper.setState({ showDatePicker: false });
      instance.handleSelectRange(e);
      expect(wrapper.state('showDatePicker')).toEqual(true);
      expect(props.refreshReportOptions).not.toHaveBeenCalled();
    });

    it('should close date picker and refresh for non-custom value', () => {
      e.currentTarget.value = 'lasagna';
      wrapper.setState({ showDatePicker: true });
      instance.handleSelectRange(e);
      expect(wrapper.state('showDatePicker')).toEqual(false);
      expect(props.refresh).toHaveBeenCalledWith({ relativeRange: 'lasagna' });
    });

  });

  describe('handleFormDates', () => {

    it('should set from and to state and call the passed in callback', () => {
      wrapper.setState({ selected: false });
      const mockCallback = jest.fn();
      const mockSelected = { from: 'from', to: 'to' };
      instance.handleFormDates(mockSelected, mockCallback);
      expect(wrapper.state('selected')).toEqual(mockSelected);
      expect(mockCallback).toHaveBeenCalledTimes(1);
    });

  });

  describe('handleSubmit', () => {

    it('should reset some state and refresh', () => {
      const mockSelected = { a: 1, b: 2, c: 3 };
      wrapper.setState({ showDatePicker: true, selecting: true, selected: mockSelected });
      instance.handleSubmit();
      expect(wrapper.state('showDatePicker')).toEqual(false);
      expect(wrapper.state('selecting')).toEqual(false);
      expect(props.refresh).toHaveBeenCalledWith({ ...mockSelected, relativeRange: 'custom' });
    });

  });

});
