import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { reduxForm, Field } from 'redux-form';
import _ from 'lodash';
import { getMessageEvents, refreshMessageEventsDateRange, updateMessageEventsSearchOptions } from 'src/actions/messageEvents';
import { Grid } from '@sparkpost/matchbox';
import DatePicker from 'src/components/datePicker/DatePicker';
import { TextFieldWrapper } from 'src/components';
import { email as emailValidator } from 'src/helpers/validation';
import { onEnter } from 'src/helpers/keyEvents';

const RELATIVE_DATE_OPTIONS = [
  'hour',
  'day',
  '7days',
  '10days',
  'custom'
];

export class MessageEventsSearch extends Component {

  componentDidMount() {
    // range defaults to "hour"
    const relativeRange = this.props.search.dateOptions.relativeRange || 'hour';
    this.props.refreshMessageEventsDateRange({ relativeRange });
  }

  componentDidUpdate(prevProps) {
    const { search } = this.props;
    if (prevProps.search !== search) {
      this.props.getMessageEvents(search);
    }
  }

  parseAddresses = (value) => {
    value = _.trim(value, ' ,'); // strip whitespace and commas
    if (!value) {
      return [];
    }

    return value.split(',').map((address) => _.trim(address));
  }

  getInvalidAddresses = (addresses) => {
    const invalids = _.filter(addresses, (address) => {
      address = _.trim(address);

      return address && emailValidator(address) !== undefined;
    });

    return invalids;
  }

  handleRecipientsChange = (event) => {
    const value = event.target.value;
    const recipients = this.parseAddresses(value);
    const invalids = this.getInvalidAddresses(recipients);

    if (invalids.length) {
      return;
    }

    this.props.updateMessageEventsSearchOptions({ recipients });
  }

  emailValidator = (value) => {
    const invalids = this.getInvalidAddresses(this.parseAddresses(value));

    if (invalids.length) {
      return `${invalids.join(', ')} ${invalids.length > 1 ? 'are not' : 'is not a'} valid email ${invalids.length > 1 ? 'addresses' : 'address'}`;
    }
  }

  render() {
    const { search, refreshMessageEventsDateRange, loading, now = new Date() } = this.props;
    return (
      <Grid>
        <Grid.Column xs={12} md={6}>
          <DatePicker
            {...search.dateOptions}
            relativeDateOptions={RELATIVE_DATE_OPTIONS}
            disabled={loading}
            onChange={refreshMessageEventsDateRange}
            datePickerProps={{
              disabledDays: {
                after: now,
                before: moment(now).subtract(10, 'days').toDate()
              },
              canChangeMonth: false
            }}
          />
        </Grid.Column>
        <Grid.Column xs={12} md={6}>
          <Field
            name="recipients"
            onBlur={this.handleRecipientsChange}
            onKeyDown={onEnter(this.handleRecipientsChange)}
            component={TextFieldWrapper}
            title="Recipient Email(s)"
            validate={this.emailValidator}
            placeholder="Filter by recipient email address"
          />
        </Grid.Column>
      </Grid>
    );
  }
}

const formName = 'messageEventsSearchOptions';
const formOptions = { form: formName };

const mapStateToProps = ({ messageEvents }) => ({
  search: messageEvents.search,
  loading: messageEvents.loading,
  initialValues: {
    recipients: messageEvents.search.recipients.join(', ')
  }
});
const mapDispatchToProps = { getMessageEvents, refreshMessageEventsDateRange, updateMessageEventsSearchOptions };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(reduxForm(formOptions)(MessageEventsSearch));
