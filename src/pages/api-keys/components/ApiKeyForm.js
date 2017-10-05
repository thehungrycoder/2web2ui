import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, change, reduxForm, formValueSelector } from 'redux-form';
import { Button } from '@sparkpost/matchbox';

import { listGrants } from 'src/actions/api-keys';
import { list as listSubaccounts } from 'src/actions/subaccounts';
import {
  RadioGroup,
  TextFieldWrapper,
  SubaccountTypeaheadWrapper
} from 'src/components/reduxFormWrappers';
import {
  getGrants,
  getIsNew,
  getInitialGrantsRadio,
  getInitialSubaccount,
  getInitialValues
} from 'src/selectors/api-keys';
import validIpList from '../helpers/validIpList';
import GrantsCheckboxes from './GrantsCheckboxes';


const formName = 'apiKeyForm';
const grantsOptions = [
  { value: 'all', label: 'All' },
  { value: 'select', label: 'Select' }
];

const required = (value) => (value ? undefined : 'Required');

export class ApiKeyForm extends Component {
  componentDidMount() {
    this.props.listGrants();
    this.props.listSubaccounts();
  }

  render() {
    const {
      grants,
      subaccounts,
      isNew,
      handleSubmit,
      pristine,
      showGrants,
      submitSucceeded,
      submitting
    } = this.props;

    const submitText = isNew ? 'Create API Key' : 'Update API Key';

    return (
      <form onSubmit={handleSubmit}>
        <Field
          name="label"
          component={TextFieldWrapper}
          validate={required}
          label="API Key Name"
        />
        <Field
          name="subaccount"
          component={SubaccountTypeaheadWrapper}
          subaccounts={subaccounts}
        />
        <Field
          name="grantsRadio"
          component={RadioGroup}
          title="API Permissions"
          options={grantsOptions}
        />
        <GrantsCheckboxes grants={grants} show={showGrants} />
        <Field
          name="validIps"
          component={TextFieldWrapper}
          label="Allowed IPs"
          helpText="Leaving the field blank will allow access by valid API keys from any IP address."
          placeholder="10.20.30.40, 10.20.30.0/24"
          validate={validIpList}
        />

        <Button submit primary disabled={submitting || pristine}>
          {submitText}
        </Button>
        {submitting && !submitSucceeded && <div>Loading&hellip;</div>}
      </form>
    );
  }
}

const ApiKeyReduxForm = reduxForm({ form: formName })(ApiKeyForm);
const valueSelector = formValueSelector(formName);

const mapStateToProps = (state, props) => ({
  grants: getGrants(state),
  subaccounts: state.subaccounts.list,
  showGrants: valueSelector(state, 'grantsRadio') === 'select',
  isNew: getIsNew(state, props),
  initialValues: {
    grantsRadio: getInitialGrantsRadio(state, props),
    subaccount: getInitialSubaccount(state, props),
    ...getInitialValues(state, props)
  }
});

export default connect(mapStateToProps, {
  formChange: change,
  listGrants,
  listSubaccounts
})(ApiKeyReduxForm);
