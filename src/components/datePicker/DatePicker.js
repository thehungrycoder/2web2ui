/* eslint max-lines: ["error", 235] */
import React, { Component } from 'react';
import { subMonths, format } from 'date-fns';
import { getStartOfDay, getEndOfDay, getRelativeDateOptions, getNextHour, isSameDate } from 'src/helpers/date';
import { roundBoundaries } from 'src/helpers/metrics';
import { Button, TextField, Select, Popover, WindowEvent } from '@sparkpost/matchbox';
import DateSelector from 'src/components/dateSelector/DateSelector';
import ManualEntryForm from './ManualEntryForm';
import { FORMATS } from 'src/constants';
import styles from './DatePicker.module.scss';
import PropTypes from 'prop-types';

export default class AppDatePicker extends Component {

  DATE_FORMAT = FORMATS.LONG_DATETIME;
  state = {
    showDatePicker: false,
    selecting: false,
    selected: { }
  }

  componentDidMount() {
    this.syncTimeToState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.from !== this.props.from || nextProps.to !== this.props.to) {
      this.syncTimeToState(nextProps);
    }
  }

  // Sets local state from reportOptions redux state - need to separate to handle pre-apply state
  syncTimeToState = ({ from, to }) => {
    this.setState({ selected: { from, to }});
  }

  // Closes popover on escape, submits on enter
  handleKeyDown = (e) => {
    if (!this.state.showDatePicker) {
      return;
    }

    if (e.key === 'Escape') {
      this.cancelDatePicker();
    }

    if (!this.state.selecting && e.key === 'Enter') {
      this.handleSubmit();
    }
  }

  handleDayKeyDown = (day, modifiers, e) => {
    this.handleKeyDown(e);
    e.stopPropagation();
  }

  cancelDatePicker = () => {
    this.syncTimeToState(this.props);
    this.setState({ showDatePicker: false });
  }

  showDatePicker = () => {
    this.setState({ showDatePicker: true });
  }

  handleDayClick = (clicked) => {
    const { selecting, selected } = this.state;
    const dates = selecting
      ? selected
      : { from: this.fromFormatter(clicked), to: getEndOfDay(clicked, { preventFuture: this.props.preventFuture }) };

    this.setState({
      selected: dates,
      beforeSelected: dates,
      selecting: !selecting
    });
  }

  handleDayHover = (hovered) => {
    const { selecting } = this.state;

    if (selecting) {
      this.setState({ selected: { ...this.getOrderedRange(hovered) }});
    }
  }

  getOrderedRange(newDate) {
    let { from, to } = this.state.beforeSelected;

    if (from.getTime() <= newDate.getTime()) {
      to = getEndOfDay(newDate, { preventFuture: this.props.preventFuture });
    } else {
      from = this.fromFormatter(newDate);
    }

    if (this.props.roundToPrecision) {
      const rounded = roundBoundaries(from, to);
      from = rounded.from.toDate();
      to = rounded.to.toDate();
    }
    return { from, to };
  }

  handleSelectRange = (e) => {
    const value = e.currentTarget.value;

    if (value === 'custom') {
      this.setState({ showDatePicker: true });
    } else {
      this.setState({ showDatePicker: false });
      this.props.onChange({ relativeRange: value });
    }
  }

  handleFormDates = ({ from, to }, callback) => {
    this.setState({ selected: { from, to }}, () => callback());
  }

  handleSubmit = () => {
    this.setState({ showDatePicker: false, selecting: false });
    this.props.onChange({ ...this.state.selected, relativeRange: 'custom' });
  }

  handleTextUpdate = () => {
    if (this.props.onBlur) {
      this.props.onBlur();
    }
  }

  fromFormatter = (fromDate) => {
    const isDateToday = isSameDate(getStartOfDay(fromDate), getStartOfDay(new Date()));
    const formatter = (this.props.fromSelectsNextHour && isDateToday) ? getNextHour : getStartOfDay;
    return formatter(fromDate);
  }

  render() {
    const { selected: { from, to }, showDatePicker } = this.state;
    const selectedRange = showDatePicker ? 'custom' : this.props.relativeRange;

    // allow for prop-level override of "now" (DI, etc.)
    const {
      now = new Date(),
      relativeDateOptions = [],
      disabled,
      datePickerProps = {},
      textFieldProps = {},
      dateFieldFormat,
      roundToPrecision,
      preventFuture,
      showPresets = true,
      error,
      left
    } = this.props;
    const dateFormat = dateFieldFormat || this.DATE_FORMAT;

    const rangeSelect = showPresets
      ? <Select
        options={getRelativeDateOptions(relativeDateOptions)}
        onChange={this.handleSelectRange}
        value={selectedRange}
        disabled={disabled} />
      : null;

    const dateField = <TextField
      onClick={this.showDatePicker}
      connectLeft={rangeSelect}
      value={`${format(from, dateFormat)} – ${format(to, dateFormat)}`}
      readOnly
      onBlur={this.handleTextUpdate}
      error={error}
      disabled={disabled}
      {...textFieldProps} />;

    return (
      <Popover
        wrapper='div'
        className={styles.Popover}
        trigger={dateField}
        onClose={this.cancelDatePicker}
        open={this.state.showDatePicker}
        left={left} >

        <DateSelector
          numberOfMonths={2}
          fixedWeeks
          enableOutsideDays={false}
          initialMonth={subMonths(now, 1)}
          toMonth={now}
          disabledDays={{ after: now }}
          onDayClick={this.handleDayClick}
          onDayMouseEnter={this.handleDayHover}
          onDayFocus={this.handleDayHover}
          onKeyDown={this.handleKeyDown}
          onDayKeyDown={this.handleDayKeyDown}
          selectedDays={this.state.selected}
          {...datePickerProps}
        />

        <ManualEntryForm
          selectDates={this.handleFormDates}
          onEnter={this.handleKeyDown}
          to={to}
          from={from}
          roundToPrecision={roundToPrecision}
          preventFuture={preventFuture}
        />

        <Button primary onClick={this.handleSubmit} className={styles.Apply}>Apply</Button>
        <Button onClick={this.cancelDatePicker}>Cancel</Button>
        <WindowEvent event='keydown' handler={this.handleKeyDown} />
      </Popover>
    );
  }
}

AppDatePicker.propTypes = {
  now: PropTypes.instanceOf(Date),
  from: PropTypes.instanceOf(Date),
  to: PropTypes.instanceOf(Date),
  relativeRange: PropTypes.string,
  relativeDateOptions: PropTypes.arrayOf(PropTypes.string),
  roundToPrecision: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  datePickerProps: PropTypes.object,
  dateFieldFormat: PropTypes.string,
  disabled: PropTypes.bool,
  showPresets: PropTypes.bool
};

AppDatePicker.defaultProps = {
  roundToPrecision: true,
  preventFuture: true
};
