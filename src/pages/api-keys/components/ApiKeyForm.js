import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { Button } from '@sparkpost/matchbox';

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
  getInitialSubaccount,
  getInitialValues
} from 'src/selectors/api-keys';
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
        <Field
          name='label'
          component={TextFieldWrapper}
          validate={required}
          label='API Key Name'
        />
        <Field
          name='subaccount'
          component={SubaccountTypeaheadWrapper}
          disabled={!isNew}
        />
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

        <Button submit primary disabled={submitting || pristine}>
          {submitting ? 'Loading...' : submitText}
        </Button>
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
    subaccount: getInitialSubaccount(state, props),
    ...getInitialValues(state, props)
  }
});

const formOptions = { form: formName };
export default connect(mapStateToProps, {})(reduxForm(formOptions)(ApiKeyForm));
