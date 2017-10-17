import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';

import { Panel, Grid, Icon } from '@sparkpost/matchbox';
import { TextFieldWrapper, FilterDropdown } from 'src/components';

const formName = 'templateFilters';
const statusOptions = [
  { content: 'Draft', name: 'draft' },
  { content: 'Published', name: 'published' }
];
const subaccountOptions = [
  { content: 'Assigned to Master', name: 'master' },
  { content: 'Assigned to Subaccount', name: 'subaccount' },
  { content: 'Shared with all', name: 'all' }
];

const Filters = () => (
  <Panel sectioned>
    <Grid>
      <Grid.Column xs={5}>
        <Field
          name='search'
          placeholder='Search by label, ID, or subaccount id'
          prefix={<Icon name='Search'/>}
          component={TextFieldWrapper}
        />
      </Grid.Column>
      <Grid.Column>
        <FilterDropdown
          formName={formName}
          namespace='status'
          options={statusOptions}
          displayValue='Status' />
      </Grid.Column>
      <Grid.Column>
        <FilterDropdown
          formName={formName}
          namespace='subaccount'
          options={subaccountOptions}
          displayValue='Subaccount' />
      </Grid.Column>
    </Grid>
  </Panel>
);

  const subaccountOptions = [
    { content: 'Assigned to Master', name: 'master' },
    { content: 'Shared with all', name: 'all' }
  ];

  return (
    <Panel sectioned>
      <Grid>
        <Grid.Column xs={5}>
          <Field
            name='search'
            placeholder='Search by label, ID, or subaccount'
            component={TextFieldWrapper}
          />
        </Grid.Column>
        <Grid.Column>
          <FilterDropdown
            formName={FORMNAME}
            namespace='status'
            options={statusOptions}
            triggerValue='Status' />
        </Grid.Column>
        <Grid.Column>
          {/* <FilterDropdown
            formName={FORMNAME}
            namespace='subaccount'
            options={subaccountOptions}
            triggerValue='Subaccount' /> */}
        </Grid.Column>
      </Grid>
    </Panel>
  );
}

const mapStateToProps = (state) => {
  return {
    initialValues: {}
  };
};

const formOptions = { form: formName };
export default connect(mapStateToProps, {})(reduxForm(formOptions)(Filters));
