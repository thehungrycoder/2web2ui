import React from 'react';
import { shallow } from 'enzyme';
import DateSelector, { Navbar } from '../DateSelector';
import * as DayPicker from 'react-day-picker';
import moment from 'moment';
import { ArrowForward, ArrowBack } from '@sparkpost/matchbox-icons';

jest.mock('react-day-picker');

describe('dateselector', () => {
  let wrapper;

  beforeEach(() => {
    const testDate = moment('2018-05-20').toDate();
    DayPicker.DateUtils.isSameDay = jest.fn();
    DayPicker.DateUtils.isDayBetween = jest.fn();
    wrapper = shallow(<DateSelector initialMonth={testDate} selectedDays={{ from: 1, to: 1000 }} />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should compare first selected day against isSameDay', () => {
    wrapper.prop('modifiers').firstSelected(123);
    expect(DayPicker.DateUtils.isSameDay).toHaveBeenCalledWith(123, 1);
  });

  it('should compare last selected day against isSameDay', () => {
    wrapper.prop('modifiers').lastSelected(123);
    expect(DayPicker.DateUtils.isSameDay).toHaveBeenCalledWith(123, 1000);
  });

  it('should compare in between days against isDayBetween', () => {
    wrapper.prop('modifiers').inBetween(123);
    expect(DayPicker.DateUtils.isDayBetween).toHaveBeenCalledWith(123, 1, 1000);
  });
});

describe('Navbar', () => {

  it('should render correctly', () => {
    expect(shallow(<Navbar />)).toMatchSnapshot();
  });

  it('should call previous button handler', () => {
    const handlePreviousClick = jest.fn();
    const wrapper = shallow(<Navbar onPreviousClick={handlePreviousClick} />);
    wrapper.find(ArrowBack).simulate('click');
    expect(handlePreviousClick).toHaveBeenCalled();
  });

  it('should call next button handler', () => {
    const handleNextClick = jest.fn();
    const wrapper = shallow(<Navbar onNextClick={handleNextClick} />);
    wrapper.find(ArrowForward).simulate('click');
    expect(handleNextClick).toHaveBeenCalled();
  });
});
