import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { Button, Panel } from '@sparkpost/matchbox';

import {
  RadioGroup,
  TextFieldWrapper,
  SubaccountTypeaheadWrapper
} from 'src/components/reduxFormWrappers';
import {
  getGrants,
  getSubaccountGrants,
  getIsNew,
  getInitialGrantsRadio,
  getInitialValues
} from 'src/selectors/api-keys';
import { selectSubaccountFromQuery } from 'src/selectors/subaccounts';
import validIpList from '../helpers/validIpList';
import { required } from 'src/helpers/validation';
import GrantsCheckboxes from './GrantsCheckboxes';

const formName = 'apiKeyForm';
const grantsOptions = [
  { value: 'all', label: 'All' },
  { value: 'select', label: 'Select' }
];

export class ApiKeyForm extends Component {
  render() {
    const {
      grants,
      subaccountGrants,
      isNew,
      handleSubmit,
      pristine,
      showGrants,
      showSubaccountGrants,
      submitting
    } = this.props;

    const submitText = isNew ? 'Create API Key' : 'Update API Key';

    return (
      <form onSubmit={handleSubmit}>
        <Panel.Section>
          <Field
            name='label'
            component={TextFieldWrapper}
            validate={required}
            label='API Key Name'
          />
          <Field
            name='subaccount'
            helpText='This assigment is permanent. Leave blank to assign to master account.'
            component={SubaccountTypeaheadWrapper}
            disabled={!isNew}
          />
        </Panel.Section>
        <Panel.Section>
          <Field
            name='grantsRadio'
            component={RadioGroup}
            title='API Permissions'
            options={grantsOptions}
          />
          <GrantsCheckboxes grants={showSubaccountGrants ? subaccountGrants : grants} show={showGrants} />
          <Field
            name='validIps'
            component={TextFieldWrapper}
            label='Allowed IPs'
            helpText='Leaving the field blank will allow access by valid API keys from any IP address.'
            placeholder='10.20.30.40, 10.20.30.0/24'
            validate={validIpList}
          />
        </Panel.Section>
        <Panel.Section>
          <Button submit primary disabled={submitting || pristine}>
            {submitting ? 'Loading...' : submitText}
          </Button>
        </Panel.Section>
      </form>
    );
  }
}

const valueSelector = formValueSelector(formName);
const mapStateToProps = (state, props) => ({
  grants: getGrants(state),
  subaccountGrants: getSubaccountGrants(state),
  showSubaccountGrants: !!valueSelector(state, 'subaccount'),
  showGrants: valueSelector(state, 'grantsRadio') === 'select',
  isNew: getIsNew(state, props),
  initialValues: {
    grantsRadio: getInitialGrantsRadio(state, props),
    subaccount: selectSubaccountFromQuery(state, props),
    ...getInitialValues(state, props)
  }
});

const formOptions = {
  form: formName,
  enableReinitialize: true
};
export default withRouter(connect(mapStateToProps, {})(reduxForm(formOptions)(ApiKeyForm)));
