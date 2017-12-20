import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, change } from 'redux-form';
import _ from 'lodash';

import { Grid } from '@sparkpost/matchbox';
import DateFilter from 'src/pages/reports/components/DateFilter';
import { TextFieldWrapper } from 'src/components';
import { getRelativeDates } from 'src/helpers/date';
import { email as emailValidator } from 'src/helpers/validation';

export class BasicFilter extends Component {
  constructor(props) {
    super(props);

    const { reportFilters } = props;
    this.state = {
      reportFilters,
      recipients: ''
    };
  }

  refresh = () => {
    this.props.onSubmit(this.state);
  }

  getInvalidAddresses = (addresses) => {
    if (!addresses) {
      return [];
    }
    const emails = addresses.split(',');
    const invalids = _.filter(emails, (email) => {
      email = _.trim(email);

      email && emailValidator(email) !== undefined;
    });

    return invalids;
  }

  handleRecipientsChange = (event) => {
    let value = _.trim(event.target.value, ' ,');

    if (!value) {
      return;
    }

    const invalids = this.getInvalidAddresses(value);
    if (invalids.length) {
      return;
    }

    value = _.split(value, ',');
    value = _.map(value, (value) => _.trim(value));

    this.setState({ recipients: value.join(',') }, this.refresh);
  }

  handleDateSelection = (options) => {
    const { relativeRange } = options;
    if (relativeRange) {
      Object.assign(options, getRelativeDates(relativeRange));
    }

    this.setState({
      reportFilters: {
        from: options.from,
        to: options.to,
        relativeRange: relativeRange
      }
    }, this.refresh);
  }

  emailValidator = (value) => {
    const invalids = this.getInvalidAddresses(_.trim(value, ' ,'));

    if (invalids.length) {
      return `${invalids.join(',')} ${invalids.length > 1 ? 'are' : 'is'} not valid email ${invalids.length > 1 ? 'addresess' : 'address'}`;
    }
  }

  render() {
    return (
      <Grid>
        <Grid.Column xs={12} md={6}>
          <DateFilter refresh={this.handleDateSelection} />
        </Grid.Column>
        <Grid.Column xs={12} md={6}>
          <Field
            name="recipients"
            onBlur={(e) => this.handleRecipientsChange(e)}
            component={TextFieldWrapper}
            title="Email"
            validate={this.emailValidator}
            placeholder='recipient1@domain.com, recipient2@domain.com'
          />
        </Grid.Column>
      </Grid>
    );
  }
}

const formName = 'basicFilter';
const formOptions = { form: formName };
const mapStateToProps = ({ reportFilters }) => ({
  reportFilters,
  formName
});

export default connect(mapStateToProps, { change })(reduxForm(formOptions)(BasicFilter));
