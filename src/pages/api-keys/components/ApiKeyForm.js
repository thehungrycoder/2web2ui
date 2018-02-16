import _ from 'lodash';
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
import GrantsCheckboxes from 'src/components/grantBoxes/GrantsCheckboxes';

const formName = 'apiKeyForm';
const grantsOptions = [
  { value: 'all', label: 'All' },
  { value: 'select', label: 'Select' }
];

export class ApiKeyForm extends Component {
  get availableGrants() {
    return this.props.subaccount ? this.props.subaccountGrants : this.props.grants;
  }

  onSubmit = ({ grants = {}, grantsRadio, label, subaccount, validIps = '' }) => {
    const availableGrantKeys = Object.keys(this.availableGrants);
    // extracts all checked grants and returns array of all checked ['grant1', 'grant2']
    const checkedGrantKeys = _.reduce(grants, (result, checked, key) => checked ? [...result, key] : result, []);

    return this.props.onSubmit({
      label,
      grants: grantsRadio === 'select' ? _.intersection(availableGrantKeys, checkedGrantKeys) : availableGrantKeys,
      subaccount,
      validIps: _.trim(validIps) !== '' ? validIps.split(',').map(_.trim) : undefined
    });
  }

  render() {
    const { handleSubmit, isNew, pristine, showGrants, submitting } = this.props;
    const submitText = isNew ? 'Create API Key' : 'Update API Key';

    return (
      <form onSubmit={handleSubmit(this.onSubmit)}>
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
          <GrantsCheckboxes grants={this.availableGrants} show={showGrants} />
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
  subaccount: valueSelector(state, 'subaccount'),
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
