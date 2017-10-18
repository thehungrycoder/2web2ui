import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import { TextField, Button } from '@sparkpost/matchbox';

import { getPool } from '../../actions/ipPools';

const required = (value) => (value || value === null ? undefined : 'Required');

const TextFieldWrapper = ({ input, meta: { error }, ...rest }) => (
  <TextField {...rest} {...input} error={error} />
);

export class PoolForm extends Component {
  render() {
    const { isNew } = this.props;

    const { handleSubmit, submitSucceeded, submitting, pristine } = this.props;
    const submitText = isNew ? 'Create IP Pool' : 'Update IP Pool';

    return (
      <form onSubmit={handleSubmit}>
        <Field
          name="name"
          component={TextFieldWrapper}
          validate={required}
          label="Pool Name"
        />

        <p>IP listing coming soon...</p>

        <Button submit primary disabled={submitting || pristine}>
          {submitText}
        </Button>
        {submitting && !submitSucceeded && <div>Loading&hellip;</div>}
      </form>
    );
  }
}

const mapStateToProps = ({ form, ipPools }) => ({
  theForm: form,
  initialValues: ipPools.pool
});

const formOptions = {
  form: 'poolForm',
  enableReinitialize: true
};

// breaks if you do reduxForm first
export default connect(mapStateToProps, { getPool })(reduxForm(formOptions)(PoolForm));
