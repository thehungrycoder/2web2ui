import React from 'react';
import { shallow } from 'enzyme';
import DateSelector, { Navbar } from '../DateSelector';
import moment from 'moment';
import { ArrowForward, ArrowBack } from '@sparkpost/matchbox-icons';

describe('dateselector', () => {
  const subject = (props) => {
    // Unfortunately, need to stub because of DayPicker's defaultProps
    const testDate = moment('2018-05-20').toDate();
    return shallow(<DateSelector initialMonth={testDate} {...props} />);
  };

  it('should render', () => {
    expect(subject()).toMatchSnapshot()
  });

  it('should compare selected days against isSameDay', () => {
    const isSameDayStub = jest.fn();
    const selectedDays = { from: 999 };
    const wrapper = subject({
      isSameDay: isSameDayStub,
      selectedDays: selectedDays
    });
    const modifiers = wrapper.prop('modifiers');

    modifiers.firstSelected(123);
    expect(isSameDayStub).toHaveBeenCalledWith(123, selectedDays.from);
  });

  it('should render with custom modifier', () => {
    const isSameDayStub = jest.fn();
    const selectedDays = { to: 888 };
    const wrapper = subject({
      isSameDay: isSameDayStub,
      selectedDays: selectedDays
    });
    const modifiers = wrapper.prop('modifiers');

    modifiers.lastSelected(123);
    expect(isSameDayStub).toHaveBeenCalledWith(123, selectedDays.to);
  });
});

describe('Navbar', () => {
  const subject = (props) => {
    return shallow(<Navbar {...props}/>)
  }

  it('should render correctly', () => {
    const wrapper = subject();
    expect(subject()).toMatchSnapshot();
  });

  it('should call previous button handler', () => {
    const handlePreviousClick = jest.fn();
    const wrapper = shallow(<Navbar onPreviousClick = {handlePreviousClick} />);
    wrapper.find(ArrowBack).simulate('click');
    expect(handlePreviousClick).toHaveBeenCalled();
  });

  it('should call next button handler', () => {
    const handleNextClick = jest.fn();
    const wrapper = shallow(<Navbar onNextClick = {handleNextClick} />);
    wrapper.find(ArrowForward).simulate('click');
    expect(handleNextClick).toHaveBeenCalled();
  });
});
