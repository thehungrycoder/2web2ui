import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';

import { Panel, Grid, Icon } from '@sparkpost/matchbox';
import { TextFieldWrapper, FilterDropdown } from 'src/components';

const FORMNAME = 'apiKeysFilters';
const subaccountOptions = [
  { content: 'Assigned to Master', name: 'master' },
  { content: 'Assigned to Subaccount', name: 'subaccount' }
];

const Filters = () => (
  <Panel sectioned>
    <Grid>
      <Grid.Column xs={8}>
        <Field
          name='search'
          placeholder='Search by name, user, key, or subaccount ID'
          prefix={<Icon name='Search'/>}
          component={TextFieldWrapper}
        />
      </Grid.Column>
      <Grid.Column>
        <FilterDropdown
          formName={FORMNAME}
          namespace='subaccount'
          options={subaccountOptions}
          displayValue='Subaccount' />
      </Grid.Column>
    </Grid>
  </Panel>
);

const mapStateToProps = (state) => ({
  initialValues: {}
});

const mapDispatchtoProps = { };
const formOptions = { form: FORMNAME };
export default connect(mapStateToProps, mapDispatchtoProps)(reduxForm(formOptions)(Filters));
