import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { reduxForm } from 'redux-form';
import { Grid } from '@sparkpost/matchbox';
import { FilterDropdown } from 'src/components';
import DateFilter from 'src/pages/reports/components/DateFilter';
import { getRelativeDates } from 'src/helpers/date';
import styles from './FilterForm.module.scss';

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

export class FilterForm extends Component {
  constructor(props) {
    super(props);

    const { reportOptions } = props;
    this.state = {
      reportOptions,
      types: [],
      sources: []
    };
  }

  refresh() {
    this.props.onSubmit(this.state);
  }

  handleDateSelection = (options) => {
    const { relativeRange } = options;
    if (relativeRange) {
      Object.assign(options, getRelativeDates(relativeRange));
    }

    this.setState({
      reportOptions: {
        from: options.from,
        to: options.to,
        relativeRange: relativeRange
      }
    });
  }

  handleTypesSelection = (selected) => {
    const values = _.compact(_.map(selected, (val, key) => val ? key : undefined));
    const { types } = this.state;
    if (_.isEqual(types, values)) {
      return; //same value, no need to do anything
    }
    this.setState({ types: values });
  }

  handleSourcesSelection = (selected) => {
    const values = _.compact(_.map(selected, (val, key) => val ? key : undefined));
    const { sources } = this.state;
    if (_.isEqual(sources, values)) {
      return; //same value, no need to do anything
    }
    this.setState({ sources: values });
  }

  componentDidUpdate(prevProps, prevState) {
    if (!_.isEqual(this.state, prevState)) {
      this.refresh();
    }
  }

  componentDidMount() {
    const { list } = this.props;
    // Note: This will cause API request each time this section is visited but that's ok
    if (list && !list.length) {
      this.refresh();
    }
  }

  render() {
    return (
      <Grid>
        <Grid.Column xs={12} md={6}>
          <div>
            <DateFilter refresh={this.handleDateSelection} />
          </div>
        </Grid.Column>
        <Grid.Column xs={6} md={3}>
          <div>
            <FilterDropdown
              popoverClassName={styles.suppresionPopver} formName='filterForm' options={types} namespace='types' displayValue='Type'
              onClose={this.handleTypesSelection}
            />
          </div>
        </Grid.Column>

        <Grid.Column xs={6} md={3}>
          <div>
            <FilterDropdown
              formName='filterForm' options={sources} namespace='sources' displayValue='Sources'
              popoverClassName={styles.fatPopover} onClose={this.handleSourcesSelection}
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
const mapStateToProps = (state) => ({
  reportOptions: state.reportOptions,
  list: state.suppressions.list
});
export default connect(mapStateToProps)(reduxForm(formOptions)(FilterForm));
