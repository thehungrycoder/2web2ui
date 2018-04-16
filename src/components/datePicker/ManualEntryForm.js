import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import { Grid, TextField, Icon } from '@sparkpost/matchbox';
import { DATE_FORMATS } from 'src/constants';
import styles from './ManualEntryForm.module.scss';

export default class ManualEntryForm extends Component {
  DATE_FORMAT = DATE_FORMATS.INPUT_DATE;
  TIME_FORMAT = DATE_FORMATS.INPUT_TIME;
  DATE_TIME_FORMAT = `${DATE_FORMATS.INPUT_DATE} ${DATE_FORMATS.INPUT_TIME}`;
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
      toDate: moment(to).format(this.DATE_FORMAT),
      toTime: moment(to).format(this.TIME_FORMAT),
      fromDate: moment(from).format(this.DATE_FORMAT),
      fromTime: moment(from).format(this.TIME_FORMAT)
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
    const to = moment(`${this.state.toDate} ${this.state.toTime}`, this.DATE_TIME_FORMAT, true);
    const from = moment(`${this.state.fromDate} ${this.state.fromTime}`, this.DATE_TIME_FORMAT, true);

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
              label='From Time' labelHidden placeholder='12:00am'
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
              label='To Time' labelHidden placeholder='12:00am'
              onChange={this.handleFieldChange}
              onBlur={this.handleBlur}
              value={toTime} />
          </Grid.Column>
        </Grid>
      </form>
    );
  }
}
