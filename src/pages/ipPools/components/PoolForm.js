import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import { Button } from '@sparkpost/matchbox';
import { SelectWrapper } from 'src/components/reduxFormWrappers';

import { TableCollection } from 'src/components';
import { required } from 'src/helpers/validation';
import { TextFieldWrapper } from 'src/components';

const columns = ['Sending IP', 'Hostname', 'IP Pool'];

const safeIpId = (ip) => ip.hostname.replace(/\./g, '_');

export class PoolForm extends Component {
  ipOptions = (pools) => pools.map((pool) => ({
    value: pool.id,
    label: pool.name
  }));

  poolSelect = (ip, pools, submitting) => (<Field
    name={safeIpId(ip)}
    component={SelectWrapper}
    options={this.ipOptions(pools)}
    label="IP pool"
    disabled={submitting}/>
  );

  getRowData(ip) {
    const { submitting, list = []} = this.props;

    return [
      ip.external_ip,
      ip.hostname,
      this.poolSelect(ip, list, submitting)
    ];
  }

  renderCollection() {
    const getRowDataFunc = this.getRowData.bind(this);
    const { isNew, ips } = this.props;

    // New pools have no IPs
    if (isNew) {
      return null;
    }

    // Loading
    if (!ips) {
      return null;
    }

    // Empty pool
    if (ips.length === 0) {
      return <p>Add sending IPs to this poll by moving them from their current pool.</p>;
    }

    return (
      <TableCollection
        columns={columns}
        rows={ips}
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

const mapStateToProps = ({ ipPools }, { isNew }) => {
  const { pool, list } = ipPools;
  const { ips } = pool;
  let initialValues = {};

  if (ips) {
    // Each IP has an IP pool drop down, named using the IP's hostname.
    // We set each select's initial value to the current pool id:
    // { ip_1: 'My favorite pool', ... }
    // The user can then reassign each IP to another pool.
    initialValues = ips.reduce((vals, ip) => {
      vals[safeIpId(ip)] = pool.id;
      return vals;
    }, {});
  }

  return {
    list: isNew ? [] : list,
    ips: ips,
    initialValues: {
      name: isNew ? null : pool.name,
      ...initialValues
    }
  };
};

const PoolReduxForm = reduxForm({ form: 'poolForm' })(PoolForm);
export default connect(mapStateToProps, {})(PoolReduxForm);
