import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import { subMonths, format } from 'date-fns';
import { getEndOfDay } from 'helpers/metrics';
import { Grid, Button, Datepicker, TextField, Select, Popover, Icon } from '@sparkpost/matchbox';
import { setExactTime } from 'actions/reportFilters';

import styles from './DateFilter.module.scss';

class DateFilter extends Component {
  state = {
    showDatePicker: false,
    datepicker: {
      selecting: false,
      selected: {
        from: null,
        to: null
      }
    }
  }

  rangeOptions = [
    { value: 'hour', label: 'Last Hour' },
    { value: 'day', label: 'Last 24 Hours' },
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '90days', label: 'Last 90 Days' },
    { value: 'custom', label: 'Custom' }
  ];

  componentDidMount() {
    this.setState({
      datepicker: {
        ...this.state.datepicker,
        selected: { from: this.props.filter.from, to: this.props.filter.to }
      }
    });
    window.addEventListener('click', this.handleClickOutside);
    window.addEventListener('keydown', this.handleEsc);
  }

  componentWillUnmount() {
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

  getOrderedRange(newDate) {
    const { from, to } = this.state.datepicker.beforeSelected;
    return (from.getTime() <= newDate.getTime()) ? { from, to: newDate } : { from: newDate, to };
  }

  handleSelectRange = () => {

  }

  handleFieldChange = () => {

  }

  handleSubmit = () => {
    this.setState({ showDatePicker: false });
    this.props.setExactTime(this.state.datepicker.selected).then(() => this.props.refresh());
  }

  render() {
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

    const dateField = <TextField
      labelHidden={true}
      onClick={() => this.showDatePicker()}
      connectLeft={<Select
        options={this.rangeOptions}
        defaultValue='7days' />}
      value={`${formatted.from.full} - ${formatted.to.full}`}
      readOnly
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
export default connect(mapStateToProps, { setExactTime })(DateFilter);
