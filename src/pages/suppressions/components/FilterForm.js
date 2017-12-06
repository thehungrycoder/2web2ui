import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { reduxForm } from 'redux-form';
import { Grid } from '@sparkpost/matchbox';
import { FilterDropdown } from 'src/components';
import DateFilter from 'src/pages/reports/components/DateFilter';
import { getRelativeDates } from 'src/helpers/date';


const DEFAULT_RANGE = 'day';

const types = [
  {
    content: 'Transactional',
    name: 'transactional'
  }, {
    content: 'Non-Transactional',
    name: 'non_transactional'
  }
];
const sources = [
  {
    content: 'Spam Complaint',
    name: 'Spam Complaint'
  },
  {
    content: 'List Unsubscribe',
    name: 'List Unsubscribe'
  },
  {
    content: 'Bounce Rule',
    name: 'Bounce Rule'
  },
  {
    content: 'Unsubscribe Link',
    name: 'Unsubscribe Link'
  },
  {
    content: 'Manually Added',
    name: 'Manually Added'
  },
  {
    content: 'Compliance',
    name: 'Compliance'
  }
];

export class Results extends Component {
  state = {
    ...getRelativeDates(DEFAULT_RANGE),
    types: null,
    sources: null
  }

  refresh() {
    this.props.onSubmit(this.state);
  }

  handleDateSelection(options) {
    const { relativeRange } = options;
    if (relativeRange) {
      Object.assign(options, getRelativeDates(relativeRange));
    }

    this.setState({
      from: options.from,
      to: options.to
    }, this.refresh);
  }

  handleTypesSelection(selected) {
    const values = _.compact(_.map(selected, (val, key) => val ? key : undefined));
    this.setState({ types: values }, this.refresh);
  }

  handleSourcesSelection(selected) {
    const values = _.compact(_.map(selected, (val, key) => val ? key : undefined));
    this.setState({ sources: values }, this.refresh);
  }

  render() {

    return (
    <Grid>
      <Grid.Column xs={12} md={5}>
        <div className=''>
          <DateFilter refresh={this.handleDateSelection.bind(this)} />
        </div>
      </Grid.Column>
      <Grid.Column xs={6} md={3}>
        <div className=''>
          <FilterDropdown
            formName='filterForm'
            options={types}
            namespace='types'
            displayValue='Type'
            onClose={this.handleTypesSelection.bind(this)}
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
            onClose={this.handleSourcesSelection.bind(this)}
          />
        </div>
      </Grid.Column>
    </Grid>
    );
  }
}

const formName = 'filterForm';

const formOptions = {
  form: formName
};

export default connect(null)(reduxForm(formOptions)(Results));
