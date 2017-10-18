import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { TextField, Button } from '@sparkpost/matchbox';

const required = (value) => (value || value === null ? undefined : 'Required');

const TextFieldWrapper = ({ input, meta: { error }, ...rest }) => (
  <TextField {...rest} {...input} error={error} />
);

export class PoolForm extends Component {
  render() {
    const { handleSubmit, submitSucceeded, submitting, isNew, pristine } = this.props;
    const submitText = isNew ? 'Create IP Pool' : 'Update IP Pool';

    return (
      <form onSubmit={handleSubmit}>
        <Field
          name="name"
          component={TextFieldWrapper}
          validate={required}
          label="Pool Name"
        />

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
  isNew: true,
  initialValues: { name: null }
});

const formOptions = {
  form: 'poolForm'
};

// breaks if you do reduxForm first
export default connect(mapStateToProps)(reduxForm(formOptions)(PoolForm));
