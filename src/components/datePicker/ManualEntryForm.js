import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import { Grid, TextField, Icon } from '@sparkpost/matchbox';
import { formatFormDate, formatFormTime, parseDateTime } from 'src/helpers/date';
import styles from './ManualEntryForm.module.scss';

export default class ManualEntryForm extends Component {
  DEBOUNCE = 500;

  state = {
    toDate: '',
    toTime: '',
    fromDate: '',
    fromTime: ''
  }

  componentWillReceiveProps(nextProps) {
    this.syncPropsToState(nextProps);
  }

  syncPropsToState({ to, from }) {
    this.setState({
      toDate: formatFormDate(to),
      toTime: formatFormTime(to),
      fromDate: formatFormDate(from),
      fromTime: formatFormTime(from)
    });
  }

  handleFieldChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
    this.debounceChanges();
  }

  debounceChanges = _.debounce(() => {
    this.validate();
  }, this.DEBOUNCE);

  handleEnter = (e) => {
    if (e.key === 'Enter') {
      this.validate(e, true);
    }
  };

  handleBlur = (e) => {
    this.validate(e, true);
  }

  validate = (e, shouldReset) => {
    const from = parseDateTime(this.state.fromDate, this.state.fromTime);
    const to = parseDateTime(this.state.toDate, this.state.toTime);

    // allow for prop-level override of "now" (DI, etc.)
    const { now = moment() } = this.props;

    if (to.isValid() && from.isValid() && from.isBefore(to) && to.isBefore(now)) {
      return this.props.selectDates({ to: to.toDate(), from: from.toDate() }, () => {
        if (e && e.key === 'Enter') {
          this.props.onEnter(e);
        }
      });
    } else if (shouldReset) {
      this.syncPropsToState(this.props); // Resets fields if dates are not valid
    }
  }

  render() {
    const { toDate, toTime, fromDate, fromTime } = this.state;

    return (
      <form onKeyDown={this.handleEnter} className={styles.DateFields}>
        <Grid middle='xs'>
          <Grid.Column >
            <TextField
              id="fromDate"
              label='From Date' labelHidden placeholder='YYYY-MM-DD'
              onChange={this.handleFieldChange}
              onBlur={this.handleBlur}
              value={fromDate} />
          </Grid.Column>
          <Grid.Column >
            <TextField
              id="fromTime"
              label='From Time' labelHidden placeholder='HH:MMam'
              onChange={this.handleFieldChange}
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
              id="toDate"
              label='To Date' labelHidden placeholder='YYYY-MM-DD'
              onChange={this.handleFieldChange}
              onBlur={this.handleBlur}
              value={toDate} />
          </Grid.Column>
          <Grid.Column >
            <TextField
              id="toTime"
              label='To Time' labelHidden placeholder='HH:MMam'
              onChange={this.handleFieldChange}
              onBlur={this.handleBlur}
              value={toTime} />
          </Grid.Column>
        </Grid>
      </form>
    );
  }
}
