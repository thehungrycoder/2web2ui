import React from 'react';
import { connect } from 'react-redux';

import { reduxForm } from 'redux-form';
import { Button, Grid } from '@sparkpost/matchbox';
import { FilterDropdown } from 'src/components';
import DateFilter from 'src/pages/reports/components/DateFilter';

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

export let FilterForm = (props) => {
  const { handleSubmit, submitting, pristine, refresh } = props;

  return (
    <Grid>
      <Grid.Column xs={12} md={5}>
        <div className=''>
          <DateFilter refresh={refresh} />
        </div>
      </Grid.Column>
      <Grid.Column xs={6} md={3}>
        <div className=''>
          <FilterDropdown
            formName='filterForm'
            options={types}
            namespace='types'
            displayValue='Type'
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
};

const formName = 'filterForm';

FilterForm = reduxForm({
  form: formName
})(FilterForm);

const mapStateToProps = (state, props) => {
  const { from, to, types, sources } = props;

  return {
    from,
    to,
    types,
    sources,
    initialValues: {
    }
  };
};

export default connect(mapStateToProps)(FilterForm);
