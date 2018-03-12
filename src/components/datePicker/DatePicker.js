/* eslint max-lines: ["error", 200] */
import React, { Component } from 'react';
import { subMonths, format } from 'date-fns';
import { getStartOfDay, getEndOfDay, getRelativeDateOptions } from 'src/helpers/date';
import { Button, Datepicker, TextField, Select, Popover, WindowEvent } from '@sparkpost/matchbox';
import ManualEntryForm from './ManualEntryForm';
import { DATE_FORMATS } from 'src/constants';
import styles from './DatePicker.module.scss';
import PropTypes from 'prop-types';

export default class AppDatePicker extends Component {
  DATE_FORMAT = DATE_FORMATS.READABLE_DATE_TIME;
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
      : { from: getStartOfDay(clicked), to: getEndOfDay(clicked, { preventFuture: true }) };

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
    const { from, to } = this.state.beforeSelected;
    return (from.getTime() <= newDate.getTime())
      ? { from, to: getEndOfDay(newDate, { preventFuture: true }) }
      : { from: getStartOfDay(newDate), to };
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

  render() {
    const { selected: { from, to }, showDatePicker } = this.state;
    const selectedRange = showDatePicker ? 'custom' : this.props.relativeRange;

    // allow for prop-level override of "now" (DI, etc.)
    const { now = new Date(), relativeDateOptions = [], disabled, datePickerProps = {}} = this.props;

    const rangeSelect = <Select
      options={getRelativeDateOptions(relativeDateOptions)}
      onChange={this.handleSelectRange}
      value={selectedRange}
      disabled={disabled} />;

    const dateField = <TextField
      labelHidden={true}
      onClick={this.showDatePicker}
      connectLeft={rangeSelect}
      value={`${format(from, this.DATE_FORMAT)} – ${format(to, this.DATE_FORMAT)}`}
      readOnly />;

    return (
      <Popover
        wrapper='div'
        className={styles.Popover}
        trigger={dateField}
        onOutsideClick={this.cancelDatePicker}
        open={this.state.showDatePicker} >

        <Datepicker
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

        <ManualEntryForm selectDates={this.handleFormDates} onEnter={this.handleKeyDown} to={to} from={from} />
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
  relativeDateOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  datePickerProps: PropTypes.object,
  disabled: PropTypes.bool
};
