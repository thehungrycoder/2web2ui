import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import { Panel, Button, UnstyledLink } from '@sparkpost/matchbox';
import { SelectWrapper } from 'src/components/reduxFormWrappers';
import { TableCollection } from 'src/components';
import AccessControl from 'src/components/auth/AccessControl';
import { required } from 'src/helpers/validation';
import { configFlag } from 'src/helpers/conditions/config';
import { TextFieldWrapper, SendingDomainTypeaheadWrapper } from 'src/components';
import { selectIpPoolFormInitialValues, selectIpsForCurrentPool, shouldShowIpPurchaseCTA } from 'src/selectors/ipPools';
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
    const { isNew, ips, list, pool: currentPool, showPurchaseCTA } = this.props;
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

    const purchaseCTA = showPurchaseCTA
      ? <Fragment>, or by <UnstyledLink to="/account/billing" component={Link}>purchasing new IPs</UnstyledLink></Fragment>
      : null;

    return (
      <Fragment>
        <Panel.Section>
          <p>
            Add dedicated IPs to this pool by moving them from their current pool{purchaseCTA}.
          </p>
        </Panel.Section>
        <TableCollection
          columns={columns}
          rows={ips}
          getRowData={getRowDataFunc}
          pagination={false}
        />
      </Fragment>
    );
  }

  render() {
    const { isNew, pool, handleSubmit, submitting, pristine } = this.props;
    const submitText = isNew ? 'Create IP Pool' : 'Update IP Pool';
    const editingDefault = !isNew && isDefaultPool(pool.id);
    const helpText = editingDefault ? 'You cannot change the default IP pool\'s name' : '';

    return (
      <Panel>
        <form onSubmit={handleSubmit}>
          <Panel.Section>
            <Field
              name='name'
              component={TextFieldWrapper}
              validate={required}
              label='Pool Name'
              placeholder='My IP Pool'
              disabled={editingDefault || submitting}
              helpText={helpText}
            />

            {!editingDefault &&
              <AccessControl condition={configFlag('featureFlags.allow_default_signing_domains_for_ip_pools')}>
                <Field
                  name="signing_domain"
                  component={SendingDomainTypeaheadWrapper}
                  label="Default Signing Domain"
                  disabled={submitting}
                />
              </AccessControl>
            }
          </Panel.Section>

          {this.renderCollection()}

          <Panel.Section>
            <Button submit primary disabled={submitting || pristine}>
              {submitting ? 'Saving' : submitText}
            </Button>
          </Panel.Section>
        </form>
      </Panel>
    );
  }
}

const mapStateToProps = (state, props) => {
  const { ipPools } = state;
  const { pool, list = []} = ipPools;

  return {
    list,
    pool,
    ips: selectIpsForCurrentPool(state),
    initialValues: selectIpPoolFormInitialValues(state, props),
    showPurchaseCTA: shouldShowIpPurchaseCTA(state)
  };
};

const formOptions = {
  form: 'poolForm',
  enableReinitialize: true
};

const PoolReduxForm = reduxForm(formOptions)(PoolForm);
export default connect(mapStateToProps, {})(PoolReduxForm);
