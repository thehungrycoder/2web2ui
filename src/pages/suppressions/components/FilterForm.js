import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import config from 'src/config';

import { reduxForm } from 'redux-form';
import { Grid } from '@sparkpost/matchbox';
import { FilterDropdown } from 'src/components';
import DateFilter from 'src/pages/reports/components/DateFilter';
import { getRelativeDates } from 'src/helpers/date';
import { relative } from 'path';

const { apiDateFormat } = config;

const types = [
  {
    content: 'Transactional',
    name: 'txn'
  }, {
    content: 'Non-Transactional',
    name: 'nonTxn'
  }
];
const sources = [
  {
    content: 'Spam Complaint',
    name: 'spam'
  },
  {
    content: 'List Unsubscribe',
    name: 'listunsub'
  },
  {
    content: 'Bounce Rule',
    name: 'bounce'
  },
  {
    content: 'Unsubscribe Link',
    name: 'linkunsub'
  },
  {
    content: 'Manually Added',
    name: 'manual'
  },
  {
    content: 'Compliance',
    name: 'compliance'
  }
];

export class FilterForm extends Component {

  handleChange() {
    debugger;
  }

  refresh(options) {
    const { relativeRange } = options;

    if (relativeRange) {
      Object.assign(options, getRelativeDates(relativeRange));
    }

    options.from = moment(options.from).utc().format(apiDateFormat);
    options.to = moment(options.to).utc().format(apiDateFormat);

    this.props.onSubmit(options);
  }

  render() {

    return (
    <Grid>
      <Grid.Column xs={12} md={5}>
        <div className=''>
          <DateFilter refresh={this.refresh.bind(this)} />
        </div>
      </Grid.Column>
      <Grid.Column xs={6} md={3}>
        <div className=''>
          <FilterDropdown
            formName='filterForm'
            options={types}
            namespace='types'
            displayValue='Type'
            onChange={this.handleChange}
          />
        </div>
      </Grid.Column>

      <Grid.Column xs={6} md={3}>
        <div>
          <FilterDropdown
            formName='filterForm'
            options={sources}
            namespace='sources'
            displayValue='Sources'
          />
        </div>
      </Grid.Column>
    </Grid>
    );
  }
}

const formName = 'filterForm';

const mapStateToProps = (state, props) => {
  const { from, to, types, sources } = props;

  return {
    from,
    to,
    types,
    sources


  };
};

const formOptions = {
  form: formName
};

export default connect(mapStateToProps)(reduxForm(formOptions)(FilterForm));
