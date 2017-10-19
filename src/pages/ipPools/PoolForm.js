import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import { TextField, Button, Select } from '@sparkpost/matchbox';

import { TableCollection } from 'src/components';
import { getPool } from '../../actions/ipPools';

const required = (value) => (value || value === null ? undefined : 'Required');

const TextFieldWrapper = ({ input, meta: { error }, ...rest }) => (
  <TextField {...rest} {...input} error={error} />
);

const columns = ['Sending IP', 'Hostname', 'IP Pool'];

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

        { this.renderCollection() }


        <Button submit primary disabled={submitting || pristine}>
          {submitText}
        </Button>
        {submitting && !submitSucceeded && <div>Loading&hellip;</div>}
      </form>
    );
  }

  getRowData(ip) {
    const { list = []} = this.props;

    return [
      ip.external_ip,
      ip.hostname,
      <Select
        id="id"
        placeholder="Select IP Pool"
        options={ list }
    />
    ];
  }


  renderCollection() {
    const { ips = []} = this.props.pool;
    const getRowDataFunc = this.getRowData.bind(this);

    return (
      <TableCollection
        columns={columns}
        rows={ips}
        getRowData={getRowDataFunc}
        pagination={true}
      />
    );
  }
}

const mapStateToProps = ({ form, ipPools }) => {
  const pool = ipPools.pool || {};
  return {
    theForm: form,
    pool: pool, //TODO need to figure out how to access from initialValues and get rid of this
    initialValues: pool
  };
};

const formOptions = {
  form: 'poolForm',
  enableReinitialize: true
};

// breaks if you do reduxForm first
export default connect(mapStateToProps, { getPool })(reduxForm(formOptions)(PoolForm));
