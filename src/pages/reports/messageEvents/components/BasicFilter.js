import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import _ from 'lodash';
import { getMessageEvents } from 'src/actions/messageEvents';
import { refreshReportOptions } from 'src/actions/reportOptions';
import { Grid } from '@sparkpost/matchbox';
import DateFilter from 'src/pages/reports/components/DateFilter';
import { TextFieldWrapper } from 'src/components';
import { email as emailValidator } from 'src/helpers/validation';
import { onEnter } from 'src/helpers/keyEvents';

export class BasicFilter extends Component {

  // TODO: move this to redux
  state = {
    recipients: ''
  };

  componentDidMount() {
    this.props.refreshReportOptions();
  }

  componentDidUpdate(prevProps) {
    const { reportOptions } = this.props;
    if (prevProps.reportOptions !== reportOptions) {
      this.refresh();
    }
  }

  refresh = () => {
    this.props.getMessageEvents({ ...this.state, reportOptions: this.props.reportOptions });
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
    return (
      <Grid>
        <Grid.Column xs={12} md={6}>
          <DateFilter />
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

const mapStateToProps = ({ reportOptions }) => ({ reportOptions });
const mapDispatchToProps = { getMessageEvents, refreshReportOptions };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(reduxForm(formOptions)(BasicFilter));
