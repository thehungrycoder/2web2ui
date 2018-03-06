import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { reduxForm, Field } from 'redux-form';
import _ from 'lodash';
import { getMessageEvents, refreshMessageEventsDateRange } from 'src/actions/messageEvents';
import { Grid } from '@sparkpost/matchbox';
import DatePicker from 'src/components/datePicker/DatePicker';
import { TextFieldWrapper } from 'src/components';
import { email as emailValidator } from 'src/helpers/validation';
import { onEnter } from 'src/helpers/keyEvents';

export class BasicFilter extends Component {

  // TODO: move this to redux
  state = {
    recipients: ''
  };

  componentDidMount() {
    const relativeRange = this.props.dateOptions.relativeRange || 'hour';
    this.props.refreshMessageEventsDateRange({ relativeRange });
  }

  componentDidUpdate(prevProps) {
    const { dateOptions } = this.props;
    if (prevProps.dateOptions !== dateOptions) {
      this.refresh();
    }
  }

  refresh = () => {
    this.props.getMessageEvents({ ...this.state, dateOptions: this.props.dateOptions });
  }

  parseAddresses = (value) => {
    value = _.trim(value, ' ,'); //strip whitespace and commas
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
    let value = event.target.value;
    const addresses = this.parseAddresses(value);
    const invalids = this.getInvalidAddresses(addresses);
    if (invalids.length) {
      return;
    }

    if (addresses.length) {
      value = addresses.join(',');
    }

    // TODO: can this ever be true? Isn't it checking array references?
    if (this.state.recipients === value) { //nothing changed, don't trigger search
      return;
    }

    this.setState({ recipients: value }, this.refresh);
  }

  emailValidator = (value) => {
    const invalids = this.getInvalidAddresses(this.parseAddresses(value));

    if (invalids.length) {
      return `${invalids.join(', ')} ${invalids.length > 1 ? 'are not' : 'is not a'} valid email ${invalids.length > 1 ? 'addresses' : 'address'}`;
    }
  }

  render() {
    const { dateOptions, refreshMessageEventsDateRange, loading } = this.props;
    return (
      <Grid>
        <Grid.Column xs={12} md={6}>
          <DatePicker
            {...dateOptions}
            relativeDateOptions={[
              'hour',
              'day',
              '7days',
              '10days',
              'custom'
            ]}
            disabled={loading}
            onChange={refreshMessageEventsDateRange}
            datePickerProps={{
              disabledDays: {
                after: new Date(),
                before: moment().utc().subtract(10, 'days').toDate()
              }
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

const formName = 'msgEventsBasicFilter';
const formOptions = { form: formName };

const mapStateToProps = ({ messageEvents }) => ({
  dateOptions: messageEvents.dateOptions,
  loading: messageEvents.loading
});
const mapDispatchToProps = { getMessageEvents, refreshMessageEventsDateRange };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(reduxForm(formOptions)(BasicFilter));
