import React, { Component } from 'react';
import moment from 'moment';
import { format } from 'date-fns';

import { Grid, TextField, Icon } from '@sparkpost/matchbox';
import styles from './DateForm.module.scss';

class DateForm extends Component {
  dayFormat = 'MM/DD/YY';
  timeFormat = 'h:mma';

  state = {
    toDate: '',
    toTime: '',
    fromDate: '',
    fromTime: ''
  }

  componentWillReceiveProps(nextProps) {
    this.syncStateToProps(nextProps);
  }

  syncStateToProps({ to, from }) {
    this.setState({
      toDate: format(to, this.dayFormat),
      toTime: format(to, this.timeFormat),
      fromDate: format(from, this.dayFormat),
      fromTime: format(from, this.timeFormat)
    });
  }

  handleFieldChange = (e, key) => {
    this.setState({ [key]: e.target.value });
  }

  handleBlur = (e) => {
    const format = `${this.dayFormat} ${this.timeFormat}`;
    const to = moment(`${this.state.toDate} ${this.state.toTime}`, format, true);
    const from = moment(`${this.state.fromDate} ${this.state.fromTime}`, format, true);
    const now = moment();

    if (to.isValid() && from.isValid() && from.isBefore(to) && to.isBefore(now)) {
      this.props.onBlur({ to: to.toDate(), from: from.toDate() });
    } else {
      // Resets fields if dates are not valid
      this.syncStateToProps(this.props);
    }
  }

  render() {
    const { toDate, toTime, fromDate, fromTime } = this.state;

    return (
      <div className={styles.DateFields}>
        <Grid middle='xs'>
          <Grid.Column >
            <TextField
              label='From Date' labelHidden
              onChange={(e) => this.handleFieldChange(e, 'fromDate')}
              onBlur={this.handleBlur}
              value={fromDate} />
          </Grid.Column>
          <Grid.Column >
            <TextField
              label='From Time' labelHidden
              onChange={(e) => this.handleFieldChange(e, 'fromTime')}
              onBlur={this.handleBlur}
              value={fromTime} />
          </Grid.Column>
          <Grid.Column xs={1}>
            <div className={styles.ArrowWrapper}>
              <Icon name='ArrowRight'/>
            </div>
          </Grid.Column>
          <Grid.Column >
            <TextField
              label='To Date' labelHidden
              onChange={(e) => this.handleFieldChange(e, 'toDate')}
              onBlur={this.handleBlur}
              value={toDate} />
          </Grid.Column>
          <Grid.Column >
            <TextField
              label='To Time' labelHidden
              onChange={(e) => this.handleFieldChange(e, 'toTime')}
              onBlur={this.handleBlur}
              value={toTime} />
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default DateForm;
