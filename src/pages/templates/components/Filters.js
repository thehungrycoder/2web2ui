/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import _ from 'lodash';

import { Panel, TextField, Button, Grid, Icon, Popover, ActionList } from '@sparkpost/matchbox';
import { TextFieldWrapper, FilterDropdown } from 'src/components';

import styles from './Filters.module.scss';

const FORMNAME = 'templateFilters';

const Filters = () => {
  const statusOptions = [
    { content: 'Draft', name: 'draft' },
    { content: 'Published', name: 'published' }
  ];

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

const mapDispatchtoProps = { };
const formOptions = { form: FORMNAME };
export default connect(mapStateToProps, mapDispatchtoProps)(reduxForm(formOptions)(Filters));
