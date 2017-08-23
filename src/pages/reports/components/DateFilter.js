import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import { subMonths, format } from 'date-fns';
import { getEndOfDay, relativeDateOptions } from 'helpers/metrics';
import { Button, Datepicker, TextField, Select, Popover } from '@sparkpost/matchbox';
import { setExactTime, setRelativeTime } from 'actions/reportFilters';
import DateForm from './DateForm';
import styles from './DateFilter.module.scss';

class DateFilter extends Component {
  format = 'MMM DD, YY h:mma';
  state = {
    showDatePicker: false,
    selecting: false,
    selected: { }
  }

  componentDidMount() {
    this.syncStateToProps(this.props);
    window.addEventListener('click', this.handleClickOutside);
    window.addEventListener('keydown', this.handleEsc);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleClickOutside);
    window.removeEventListener('keydown', this.handleEsc);
  }

  componentWillReceiveProps(nextProps) {
    this.syncStateToProps(nextProps);
  }

  // Sets local state from reportFilters redux state - need to separate to handle pre-apply state
  syncStateToProps = ({ filter }) => {
    this.setState({ selected: { from: filter.from, to: filter.to }});
  }

  // Closes popover when clicking outside
  handleClickOutside = (e) => {
    const domNode = ReactDOM.findDOMNode(this);
    if ((!domNode || !domNode.contains(e.target))) {
      this.setState({ showDatePicker: false });
    }
  }

  // Closes popover on escape
  handleEsc = (e) => {
    if (this.state.showDatePicker && e.code === 'Escape') {
      this.setState({ showDatePicker: false });
    }
  }

  showDatePicker = () => {
    this.setState({ showDatePicker: true });
  }

  handleDayClick = (clicked) => {
    const { selecting, selected } = this.state;
    const dates = selecting ? selected : { from: clicked, to: getEndOfDay(clicked) };

    this.props.setRelativeTime('custom').then(() => {
      this.setState({
        selected: dates,
        beforeSelected: dates,
        selecting: !selecting
      });
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
    return (from.getTime() <= newDate.getTime()) ? { from, to: newDate } : { from: newDate, to };
  }

  handleSelectRange = (e) => {
    const value = e.currentTarget.value;

    if (value === 'custom') {
      this.setState({ showDatePicker: true });
      this.props.setRelativeTime(value);
    } else {
      this.setState({ showDatePicker: false });
      this.props.setRelativeTime(value).then(() => this.props.refresh());
    }
  }

  handleFormBlur = ({ from, to }) => {
    this.setState({ selected: { from, to }});
  }

  handleSubmit = () => {
    this.setState({ showDatePicker: false });
    this.props.setExactTime(this.state.selected).then(() => this.props.refresh());
  }

  render() {
    const { selected: { from, to }} = this.state;

    const rangeSelect = <Select
      options={relativeDateOptions}
      onChange={this.handleSelectRange}
      value={this.props.filter.range} />;

    const dateField = <TextField
      labelHidden={true}
      onClick={this.showDatePicker}
      connectLeft={rangeSelect}
      value={`${format(from, this.format)} - ${format(to, this.format)}`}
      readOnly />;

    return (
      <Popover
        className={styles.Popover}
        manualTrigger
        trigger={dateField}
        open={this.state.showDatePicker} >

        <Datepicker
          numberOfMonths={2}
          fixedWeeks
          enableOutsideDays={false}
          initialMonth={subMonths(new Date(), 1)}
          toMonth={new Date()}
          disabledDays={{ after: new Date() }}
          onDayClick={this.handleDayClick}
          onDayMouseEnter={this.handleDayHover}
          onDayFocus={this.handleDayHover}
          selectedDays={this.state.selected} />

          <DateForm onBlur={this.handleFormBlur} to={to} from={from} />
        <Button primary onClick={this.handleSubmit}>Apply</Button>
      </Popover>
    );
  }
}

const mapStateToProps = ({ reportFilters }) => ({ filter: reportFilters });
export default connect(mapStateToProps, { setExactTime, setRelativeTime })(DateFilter);
