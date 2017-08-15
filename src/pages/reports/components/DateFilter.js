import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { subMonths, format } from 'date-fns';
import { Grid, Button, Panel, Icon, Datepicker, TextField, Tooltip, Select, Popover } from '@sparkpost/matchbox';

import styles from './DateFilter.module.scss';

class DateFilter extends Component {
  constructor (props) {
    super(props);

    this.state = {
      showDatePicker: false,
      eventTime: true,
      datepicker: {
        selecting: false,
        selected: { from: props.from, to: props.to }
      }
    };
  }

  rangeOptions = [
    {
      value: 'hour',
      label: 'Last Hour'
    },
    {
      value: 'day',
      label: 'Last 24 Hours'
    },
    {
      value: '7days',
      label: 'Last 7 Days'
    },
    {
      value: '30days',
      label: 'Last 30 Days'
    },
    {
      value: '90days',
      label: 'Last 90 Days'
    },
    {
      value: 'custom',
      label: 'Custom'
    }
  ];

  componentDidMount () {
    this.setState({
      datepicker: {
        ...this.state.datepicker,
        selected: { from: this.props.from, to: this.props.to }
      }
    });
    window.addEventListener('click', this.handleClickOutside);
    window.addEventListener('keydown', this.handleEsc);
  }

  componentWillUnmount () {
    window.removeEventListener('click', this.handleClickOutside);
    window.removeEventListener('keydown', this.handleEsc);
  }

  // Closes popover when clicking outside
  handleClickOutside = (e) => {
    const domNode = ReactDOM.findDOMNode(this);
    if ((!domNode || !domNode.contains(e.target))) {
      this.setState({ showDatePicker: false });
    }
  }

  // Closes popover pressing escape key
  handleEsc = (e) => {
    if (this.state.showDatePicker && e.code === 'Escape') {
      this.setState({ showDatePicker: false });
    }
  }

  showDatePicker = () => {
    this.setState({ showDatePicker: true });
  }

  handleTimeToggle = () => {
    this.setState({ eventTime: !this.state.eventTime });
  }

  handleDayClick = (clicked) => {
    const { selecting, selected } = this.state.datepicker;
    const range = selecting ? selected : { from: clicked, to: getEndOfDay(clicked) };

    this.setState({
      datepicker: {
        ...this.state.datepicker,
        range: 'custom',
        selected: range,
        selecting: !selecting,
        beforeSelected: { ...range }
      }
    });
  }

  handleDayHover = (hovered) => {
    const { selecting } = this.state.datepicker;

    if (selecting) {
      this.setState({
        datepicker: {
          ...this.state.datepicker,
          selected: {
            ...this.state.datepicker.selected,
            ...this.getOrderedRange(hovered)
          }
        }
      });
    }
  }

  getOrderedRange (newDate) {
    const { from, to } = this.state.datepicker.beforeSelected;
    return (from.getTime() <= newDate.getTime()) ? { from, to: newDate } : { from: newDate, to };
  }

  handleSelectRange = () => {

  }

  handleSubmit = () => {
    this.setState({ showDatePicker: false });
    this.props.onSubmit(this.state.datepicker.selected);
  }

  render () {
    const { from, to } = this.state.datepicker.selected;
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

    const timeConnect = this.state.eventTime
    ? <Tooltip content='Sort events by injection time'>
        <Button onClick={() => this.handleTimeToggle()}>Event Time</Button>
      </Tooltip>
    : <Tooltip content='Sort events by event time'>
        <Button onClick={() => this.handleTimeToggle()}>Injection Time</Button>
      </Tooltip>;

    const dateField = <TextField
      labelHidden={true}
      onClick={() => this.showDatePicker()}
      // connectLeft={timeConnect}
      connectLeft={<Select
        options={this.rangeOptions}
        defaultValue='7days' />}
      value={`${formatted.from.full} - ${formatted.to.full}`}
    />;

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
          selectedDays={this.state.datepicker.selected}
        />

        <div className={styles.DateFields}>
          <Grid>
            <Grid.Column xs={6}>
              <Grid>
                <Grid.Column xs={6}>
                  <TextField label='From' labelHidden value={formatted.from.day} />
                </Grid.Column>
                <Grid.Column xs={6}>
                  <TextField labelHidden value={formatted.from.time} />
                </Grid.Column>
              </Grid>
            </Grid.Column>
            <Grid.Column xs={6}>
              <Grid>
                <Grid.Column xs={6}>
                  <TextField label='To' labelHidden value={formatted.to.day} />
                </Grid.Column>
                <Grid.Column xs={6}>
                  <TextField labelHidden value={formatted.to.time} />
                </Grid.Column>
              </Grid>
            </Grid.Column>
          </Grid>
        </div>
        <Button primary onClick={this.handleSubmit}>Apply</Button>
      </Popover>
    );
  }
}

function getEndOfDay (date) {
  const end = new Date(date);
  end.setHours(11);
  end.setMinutes(59);
  end.setSeconds(59);
  end.setMilliseconds(0);

  return end;
}

export default DateFilter;
