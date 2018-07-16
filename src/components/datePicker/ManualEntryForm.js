import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import { Grid, TextField } from '@sparkpost/matchbox';
import { ArrowForward } from '@sparkpost/matchbox-icons';
import { formatInputDate, formatInputTime, parseDatetime } from 'src/helpers/date';
import styles from './ManualEntryForm.module.scss';

const DATE_PLACEHOLDER = '1970-01-20';
const TIME_PLACEHOLDER = '12:00am';

export default class ManualEntryForm extends Component {
  DEBOUNCE = 500;

  state = {
    toDate: '',
    toTime: '',
    fromDate: '',
    fromTime: ''
  }

  componentDidMount() {
    const { to, from } = this.props;
    this.syncPropsToState({ to, from });
  }

  componentWillReceiveProps(nextProps) {
    this.syncPropsToState(nextProps);
  }

  syncPropsToState({ to, from }) {
    this.setState({
      toDate: formatInputDate(to),
      toTime: formatInputTime(to),
      fromDate: formatInputDate(from),
      fromTime: formatInputTime(from)
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
    const from = parseDatetime(this.state.fromDate, this.state.fromTime);
    const to = parseDatetime(this.state.toDate, this.state.toTime);

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
              label='From Date' labelHidden placeholder={DATE_PLACEHOLDER}
              onChange={this.handleFieldChange}
              onBlur={this.handleBlur}
              value={fromDate} />
          </Grid.Column>
          <Grid.Column >
            <TextField
              id="fromTime"
              label='From Time' labelHidden placeholder={TIME_PLACEHOLDER}
              onChange={this.handleFieldChange}
              onBlur={this.handleBlur}
              value={fromTime} />
          </Grid.Column>
          <Grid.Column xs={1}>
            <div className={styles.ArrowWrapper}>
              <ArrowForward />
            </div>
          </Grid.Column>
          <Grid.Column >
            <TextField
              id="toDate"
              label='To Date' labelHidden placeholder={DATE_PLACEHOLDER}
              onChange={this.handleFieldChange}
              onBlur={this.handleBlur}
              value={toDate} />
          </Grid.Column>
          <Grid.Column >
            <TextField
              id="toTime"
              label='To Time' labelHidden placeholder={TIME_PLACEHOLDER}
              onChange={this.handleFieldChange}
              onBlur={this.handleBlur}
              value={toTime} />
          </Grid.Column>
        </Grid>
      </form>
    );
  }
}
