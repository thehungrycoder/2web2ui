import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Grid, Button, Panel, Icon, Datepicker, TextField, Tooltip, Select, Popover } from '@sparkpost/matchbox';

import styles from './DateFilter.module.scss';

class DateFilter extends Component {
  constructor (props) {
    super(props);
    this.state = {
      showDatePicker: false,
      eventTime: true
    };

    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleEsc = this.handleEsc.bind(this);
  }

  componentDidMount () {
    window.addEventListener('click', this.handleClickOutside);
    window.addEventListener('keydown', this.handleEsc);
  }

  componentWillUnmount () {
    window.removeEventListener('click', this.handleClickOutside);
    window.removeEventListener('keydown', this.handleEsc);
  }

  handleClickOutside (e) {
    const domNode = ReactDOM.findDOMNode(this);
    if ((!domNode || !domNode.contains(e.target))) {
      this.setState({ showDatePicker: false });
    }
  }

  handleEsc (e) {
    if (this.state.showDatePicker && e.code === 'Escape') {
      this.setState({ showDatePicker: false });
    }
  }

  handleDateFieldClick () {
    this.setState({ showDatePicker: true });
  }

  handleTimeToggle () {
    this.setState({ eventTime: !this.state.eventTime });
  }

  render () {
    const rangeConnect = <Select options={[
      'Last Hour',
      'Last 24 hours',
      'Last 7 Days',
      'Last 30 Days',
      'Last 90 Days',
      'Custom'
    ]}/>;

    const shareConnect = this.state.eventTime
    ? <Tooltip content='Sort events by injection time' style={{ width: '190px' }}>
        <Button onClick={() => this.handleTimeToggle()}>Event Time</Button>
      </Tooltip>
    : <Tooltip content='Sort events by event time' style={{ width: '190px' }}>
        <Button onClick={() => this.handleTimeToggle()}>Injection Time</Button>
      </Tooltip>;

    const dateField = <TextField
      labelHidden={true}
      onClick={() => this.handleDateFieldClick()}
      connectLeft={shareConnect}
      value='Jan 1 2017 - Dec 23 2017'
    />;

    return (
      <Popover
        className={styles.Popover}
        manualTrigger
        trigger={dateField}
        open={this.state.showDatePicker}
        >
          <Grid middle='xs'>
            <Grid.Column xs={8}>
              <Datepicker
                numberOfMonths={1}
                fixedWeeks
                disabledDays={{ after: new Date() }}

              />
            </Grid.Column>
            <Grid.Column xs={4}>
              <div className={styles.RangeButtonWrapper}>
                <Button size='small' fullWidth>Last Hour</Button>
              </div>
              <div className={styles.RangeButtonWrapper}>
                <Button size='small' fullWidth>Last 24 Hours</Button>
              </div>
              <div className={styles.RangeButtonWrapper}>
                <Button size='small' fullWidth>Last 7 Days</Button>
              </div>
              <div className={styles.RangeButtonWrapper}>
                <Button size='small' fullWidth>Last 30 Days</Button>
              </div>
              <div className={styles.RangeButtonWrapper}>
                <Button size='small' fullWidth>Last 90 Days</Button>
              </div>
            </Grid.Column>
        </Grid>
      </Popover>
    );
  }
}

export default DateFilter;
