import React from 'react';
import { shallow } from 'enzyme';
import _ from 'lodash';
import * as metricsHelpers from 'src/helpers/metrics';
import ManualEntryForm from '../ManualEntryForm';
import { delay } from 'src/__testHelpers__';
import moment from 'moment';

describe('Component: DatePicker ManualEntryForm', () => {

  let props;
  let wrapper;
  let instance;
  let selectDates;
  let onEnter;
  let mockNow;
  let mockFrom;
  let mockTo;

  beforeEach(() => {
    selectDates = jest.fn();
    onEnter = jest.fn();
    mockNow = moment('2018-01-15T12:00:00');
    mockFrom = moment('2018-01-10T11:00:00');
    mockTo = moment('2018-01-15T11:00:00');

    props = {
      selectDates,
      onEnter,
      now: mockNow,
      to: mockTo,
      from: mockFrom
    };

    metricsHelpers.getValidDateRange = jest.fn(() => ({ from: mockFrom, to: mockTo }));
    metricsHelpers.getPrecision = jest.fn(() => 'hour');

    wrapper = shallow(<ManualEntryForm {...props} />);
    instance = wrapper.instance();
    _.functions(instance).forEach((f) => jest.spyOn(instance, f));
    jest.spyOn(instance, 'syncPropsToState');
  });

  it('should render correctly by default', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should sync props to state', () => {
    instance.syncPropsToState({
      from: moment('2018-01-10T10:00:00'),
      to: moment('2018-01-15T14:00:00')
    });
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
  });

  it('should update state from new props', () => {
    wrapper.setProps({
      from: moment('2018-01-10T10:00:00'),
      to: moment('2018-01-15T14:00:00')
    });
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
  });

  it('should handle a field change', () => {
    const event = { target: { id: 'fromDate', value: '2018-04-15' }};

    instance.handleFieldChange(event);

    expect(wrapper.state('fromDate')).toEqual(event.target.value);
    expect(instance.debounceChanges).toHaveBeenCalledTimes(1);
  });

  it('should debounce validation changes', async () => {
    instance.debounceChanges();

    await delay(instance.DEBOUNCE + 100);

    instance.debounceChanges();
    instance.debounceChanges();
    instance.debounceChanges();
    expect(instance.validate).toHaveBeenCalledTimes(1);
  });

  it('should validate on enter key event', () => {
    const e = { key: 'Enter' };
    instance.handleEnter(e);
    expect(instance.validate).toHaveBeenCalledWith(e, true);
  });

  it('should do nothing on key events that aren\'t Enter', () => {
    const e = { key: 'X' };
    instance.handleEnter(e);
    expect(instance.validate).not.toHaveBeenCalled();
  });

  it('should validate on blur', () => {
    const e = {};
    instance.handleBlur(e);
    expect(instance.validate).toHaveBeenCalledWith(e, true);
  });

  describe('validate', () => {
    it('should reset with invalid date', () => {
      metricsHelpers.getValidDateRange = jest.fn(() => { throw new Error('invalid dates!'); });

      instance.validate({}, true);
      expect(metricsHelpers.getValidDateRange).toHaveBeenCalled();
      expect(props.selectDates).not.toHaveBeenCalled();
      expect(instance.syncPropsToState).toHaveBeenCalled();
    });

    it('should NOT reset with invalid date (when shouldReset is false)', () => {
      metricsHelpers.getValidDateRange = jest.fn(() => { throw new Error('invalid dates!'); });

      instance.validate({}, false);
      expect(metricsHelpers.getValidDateRange).toHaveBeenCalled();
      expect(props.selectDates).not.toHaveBeenCalled();
      expect(instance.syncPropsToState).not.toHaveBeenCalled();
    });

    it('should select dates when valid', () => {
      instance.validate({}, true);
      expect(metricsHelpers.getValidDateRange).toHaveBeenCalled();
      expect(props.selectDates).toHaveBeenCalledWith({
        from: mockFrom.toDate(),
        to: mockTo.toDate()
      }, expect.any(Function));
      expect(props.onEnter).not.toHaveBeenCalled();
    });

    it('should enter if event is an enter keydown event', () => {
      const e = { key: 'Enter' };
      const selectDates = jest.fn((range, cb) => cb());
      const onEnter = jest.fn();
      wrapper.setProps({ selectDates, onEnter });

      instance.validate(e, true);

      expect(metricsHelpers.getValidDateRange).toHaveBeenCalled();
      expect(selectDates).toHaveBeenCalledWith({
        from: mockFrom.toDate(),
        to: mockTo.toDate()
      }, expect.any(Function));
      expect(onEnter).toHaveBeenCalledWith(e);
    });
  });
});
