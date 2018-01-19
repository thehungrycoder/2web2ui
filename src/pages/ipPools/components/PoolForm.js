import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Button } from '@sparkpost/matchbox';
import { SelectWrapper } from 'src/components/reduxFormWrappers';
import { TableCollection } from 'src/components';
import { required } from 'src/helpers/validation';
import { TextFieldWrapper } from 'src/components';
import { selectCurrentPoolInitialValues, selectCurrentPoolIps } from 'src/selectors/ipPools';
import isDefaultPool from '../helpers/defaultPool';

const columns = ['Sending IP', 'Hostname', 'IP Pool'];

export class PoolForm extends Component {
  poolSelect = (ip, poolOptions, submitting) => (<Field
    name={ip.id}
    component={SelectWrapper}
    options={poolOptions}
    disabled={submitting}/>
  );

  getRowData = (poolOptions, ip) => {
    const { submitting } = this.props;

    return [
      ip.external_ip,
      ip.hostname,
      this.poolSelect(ip, poolOptions, submitting)
    ];
  }

  renderCollection() {
    const { isNew, ips, list, pool: currentPool } = this.props;
    const poolOptions = list.map((pool) => ({
      value: pool.id,
      label: (pool.id === currentPool.id) ? '-- Change Pool --' : `${pool.name} (${pool.id})`
    }));
    const getRowDataFunc = this.getRowData.bind(this, poolOptions);

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
    const { isNew, pool, handleSubmit, submitting, pristine } = this.props;
    const submitText = isNew ? 'Create IP Pool' : 'Update IP Pool';
    const editingDefault = isDefaultPool(pool.id);
    const helpText = editingDefault ? 'Sorry, you can\'t edit the default pool\'s name. Then it wouldn\'t be the default!' : '';

    return (
      <form onSubmit={handleSubmit}>
        <Field
          name="name"
          component={TextFieldWrapper}
          validate={required}
          label="Pool Name"
          disabled={editingDefault || submitting}
          helpText={helpText}
        />

        { this.renderCollection() }

        <Button submit primary disabled={submitting || pristine}>
          {submitting ? 'Saving' : submitText}
        </Button>
      </form>
    );
  }
}

const mapStateToProps = (state, { isNew }) => {
  const { ipPools } = state;
  const { pool, list = []} = ipPools;

  return {
    list,
    pool,
    ips: selectCurrentPoolIps(state),
    initialValues: selectCurrentPoolInitialValues(state)
  };
};

const PoolReduxForm = reduxForm({ form: 'poolForm' })(PoolForm);
export default connect(mapStateToProps, {})(PoolReduxForm);
