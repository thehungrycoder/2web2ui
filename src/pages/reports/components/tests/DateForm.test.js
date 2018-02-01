/* eslint max-lines: ["error", 207] */
import React from 'react';
import { shallow } from 'enzyme';
import _ from 'lodash';
import cases from 'jest-in-case';
import DateForm from '../DateForm';
import { delay } from 'src/__testHelpers__';
import moment from 'moment';

describe('Component: Date Form', () => {

  let props;
  let wrapper;
  let instance;
  let selectDates;
  let onEnter;
  let mockNow;

  beforeEach(() => {
    selectDates = jest.fn();
    onEnter = jest.fn();
    mockNow = moment('2018-01-15T12:00:00');

    props = {
      selectDates,
      onEnter,
      now: mockNow
    };

    wrapper = shallow(<DateForm {...props} />);
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
    const e = { target: { value: 100 }};
    wrapper.setState({ a: 1 });
    instance.handleFieldChange(e, 'a');
    expect(wrapper.state('a')).toEqual(100);
    expect(instance.debounceChanges).toHaveBeenCalledTimes(1);
  });

  it('should debounce validation changes', async() => {
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

    let mockTo;
    let mockFrom;
    let mockNow;

    const invalidCases = [
      {
        name: 'with invalid to',
        state: { toDate: 'garbage' }
      },
      {
        name: 'with invalid from',
        state: { fromDate: 'garbage' }
      },
      {
        name: 'when to is before from',
        state: { fromDate: '2018-01-15', toDate: '2017-12-15' }
      },
      {
        name: 'when to is after now',
        state: { toDate: '2018-02-15' }
      }
    ];

    const shouldResetCases = invalidCases.map(({ name, state }) => ({
      name: `should reset ${name}`,
      state,
      shouldReset: true
    }));

    const shouldNotResetCases = invalidCases.map(({ name, state }) => ({
      name: `should NOT reset ${name} (when shouldReset is false)`,
      state,
      shouldReset: false
    }));

    beforeEach(() => {
      mockFrom = moment('2017-11-15');
      mockTo = moment('2017-12-15');
      mockNow = moment('2018-01-15');
      wrapper.setProps({ to: mockTo, from: mockFrom, now: mockNow });
    });

    cases('with invalid dates', ({ state, shouldReset }) => {
      wrapper.setState(state);
      instance.validate({}, shouldReset);
      expect(props.selectDates).not.toHaveBeenCalled();
      expect(instance.syncPropsToState).toHaveBeenCalledTimes(shouldReset ? 2 : 1);
    }, [ ...shouldResetCases, ...shouldNotResetCases ]);

    describe('with valid dates', () => {

      it('should select dates', () => {
        instance.validate({}, true);
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

        expect(selectDates).toHaveBeenCalledWith({
          from: mockFrom.toDate(),
          to: mockTo.toDate()
        }, expect.any(Function));
        expect(onEnter).toHaveBeenCalledWith(e);
      });

    });

  });

  cases('handle field change', ({ id, value }) => {
    const field = wrapper.find(id);
    const event = { target: { value: 'whatever' }};
    field.simulate('change', event);
    expect(instance.handleFieldChange).toHaveBeenCalledWith(event, value);
  }, [
    {
      name: 'for fromDate field',
      id: '#fieldFromDate',
      value: 'fromDate'
    },
    {
      name: 'for fromTime field',
      id: '#fieldFromTime',
      value: 'fromTime'
    },
    {
      name: 'for toDate field',
      id: '#fieldToDate',
      value: 'toDate'
    },
    {
      name: 'for toTime field',
      id: '#fieldToTime',
      value: 'toTime'
    }
  ]);


});
