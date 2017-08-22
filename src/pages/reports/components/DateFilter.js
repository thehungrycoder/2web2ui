/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import { subMonths, format } from 'date-fns';
import { getEndOfDay, relativeDateOptions } from 'helpers/metrics';
import { Grid, Button, Datepicker, TextField, Select, Popover, Icon } from '@sparkpost/matchbox';
import { setExactTime, setRelativeTime } from 'actions/reportFilters';

import styles from './DateFilter.module.scss';

class DateFilter extends Component {
  state = {
    showDatePicker: false,
    selecting: false,
    selected: {
      from: null,
      to: null
    }
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
        ...this.state,
        selected: dates,
        selecting: !selecting,
        beforeSelected: { ...dates }
      });
    });
  }

  handleDayHover = (hovered) => {
    const { selecting } = this.state;

    if (selecting) {
      this.setState({
        ...this.state,
        selected: { ...this.state.selected, ...this.getOrderedRange(hovered) }
      });
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
      this.props.setRelativeTime(value).then(() => this.props.refresh());
    }
  }

  handleFieldChange = () => {

  }

  handleSubmit = () => {
    this.setState({ showDatePicker: false });
    this.props.setExactTime(this.state.selected).then(() => this.props.refresh());
  }

  render() {
    const { selected: { from, to } } = this.state;
    const fullFormat = 'MMM DD, YY h:mma';
    const dayFormat = 'MM/DD/YY';
    const timeFormat = 'h:mma';

    const formatted = {
      from: {
        full: format(from, fullFormat),
        day: format(from, dayFormat),
        time: format(from, timeFormat)
      },
      to: {
        full: format(to, fullFormat),
        day: format(to, dayFormat),
        time: format(to, timeFormat)
      }
    };

    const rangeSelect = <Select
      options={relativeDateOptions}
      onChange={this.handleSelectRange}
      value={this.props.filter.range} />;

    const dateField = <TextField
      labelHidden={true}
      onClick={() => this.showDatePicker()}
      connectLeft={rangeSelect}
      value={`${formatted.from.full} - ${formatted.to.full}`}
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

        <div className={styles.DateFields}>
          <Grid middle='xs'>
            <Grid.Column >
              <TextField
                label='From'
                labelHidden
                onChange={this.handleFieldChange}
                value={formatted.from.day} />
            </Grid.Column>
            <Grid.Column >
              <TextField
                labelHidden
                onChange={this.handleFieldChange}
                value={formatted.from.time} />
            </Grid.Column>
            <Grid.Column xs={1}>
              <div className={styles.ArrowWrapper}>
                <Icon name='ArrowRight'/>
              </div>
            </Grid.Column>
            <Grid.Column >
              <TextField
                label='To'
                labelHidden
                onChange={this.handleFieldChange}
                value={formatted.to.day} />
            </Grid.Column>
            <Grid.Column >
              <TextField
                labelHidden
                onChange={this.handleFieldChange}
                value={formatted.to.time} />
            </Grid.Column>
          </Grid>
        </div>
        <Button primary onClick={this.handleSubmit}>Apply</Button>
      </Popover>
    );
  }
}

const mapStateToProps = ({ reportFilters }) => ({ filter: reportFilters });
export default connect(mapStateToProps, { setExactTime, setRelativeTime })(DateFilter);
