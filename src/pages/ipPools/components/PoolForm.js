import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import { Button, Select } from '@sparkpost/matchbox';

import { TableCollection } from 'src/components';
import { required } from 'src/helpers/validation';
import { TextFieldWrapper } from 'src/components';

const columns = ['Sending IP', 'Hostname', 'IP Pool'];

export class PoolForm extends Component {
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
    const getRowDataFunc = this.getRowData.bind(this);

    if (this.props.isNew || !this.props.ips) {
      return null;
    }

    return (
      <TableCollection
        columns={columns}
        rows={this.props.ips}
        getRowData={getRowDataFunc}
        pagination={false}
      />
    );
  }

  render() {
    const { isNew } = this.props;

    const { handleSubmit, submitting, pristine } = this.props;
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
          {submitting ? 'Saving' : submitText}
        </Button>
      </form>
    );
  }
}

const PoolReduxForm = reduxForm({ form: 'poolForm' })(PoolForm);

const mapStateToProps = ({ ipPools }, { isNew }) => ({
  ips: ipPools.pool.ips,
  initialValues: {
    name: isNew ? null : ipPools.pool.name
  }
});

export default connect(mapStateToProps)(PoolReduxForm);
