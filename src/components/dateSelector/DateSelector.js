import React, { Component } from 'react';
import DayPicker, { DateUtils } from 'react-day-picker';

import { ArrowForward, ArrowBack } from '@sparkpost/matchbox-icons';
import styles from './DateSelector.module.scss';

export class Navbar extends Component {
  render() {
    const {
      onPreviousClick,
      onNextClick
    } = this.props;

    return (
      <div className={styles.Navbar}>
        <ArrowBack
          size={21}
          onClick={() => onPreviousClick()}
          className={styles.Prev} />
        <ArrowForward
          size={21}
          onClick={() => onNextClick()}
          className={styles.Next} />
      </div>
    );
  }
}

const DateSelector = ({ isSameDay = DateUtils.isSameDay, selectedDays, ...props }) => {
  const modifiers = selectedDays
    ? {
      firstSelected: (day) => isSameDay(day, selectedDays.from),
      lastSelected: (day) => isSameDay(day, selectedDays.to)
    }
    : {};

  const modifiersStyles = {
    firstSelected: {
      color: 'white',
      backgroundColor: '#2693c3',
      borderTopLeftRadius: '4px',
      borderBottomLeftRadius: '4px'
    },
    lastSelected: {
      color: 'white',
      backgroundColor: '#2693c3',
      borderTopRightRadius: '4px',
      borderBottomRightRadius: '4px'
    }
  };

  return (
    <DayPicker
      modifiers={modifiers}
      classNames={styles}
      modifiersStyles={modifiersStyles}
      navbarElement={Navbar}
      {...props}
    />
  );
};

export default DateSelector;
