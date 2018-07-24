import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';

import { Button, Panel } from '@sparkpost/matchbox';
import { getNonDefaultIpPools } from 'src/selectors/ipPools';
import { selectFirstIpPoolId } from 'src/selectors/ipPools';
import { NameField, StatusSelect } from './formFields';
import IpPoolSelect from './IpPoolSelect';
import RestrictToIpPoolCheckbox from './RestrictToIpPoolCheckbox';

export class SubaccountEditForm extends Component {

  render() {
    const {
      handleSubmit,
      pristine,
      submitting,
      ipPools,
      compliance,
      reset,
      restrictedToIpPool
    } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <Panel.Section>
          <NameField disabled={submitting || compliance}/>
          <StatusSelect disabled={submitting || compliance} compliance={compliance} />
        </Panel.Section>
        {Boolean(ipPools.length) && (
          <Panel.Section>
            <RestrictToIpPoolCheckbox disabled={submitting || compliance} />
            {restrictedToIpPool && <IpPoolSelect disabled={submitting || compliance} options={ipPools} />}
          </Panel.Section>
        )}
        <Panel.Section>
          <Button submit primary disabled={pristine || submitting || compliance}>
            {submitting ? 'Updating...' : 'Update Subaccount'}
          </Button>
          {!pristine && <Button style={{ marginLeft: '1em' }} disabled={pristine || submitting} onClick={reset}>Cancel</Button>}
        </Panel.Section>
      </form>
    );
  }
}

const formName = 'SubaccountEditForm';
const valueSelector = formValueSelector(formName);

const mapStateToProps = (state, { subaccount }) => {
  const { compliance, ip_pool, name, status } = subaccount;

  return {
    compliance,
    ipPools: getNonDefaultIpPools(state),
    restrictedToIpPool: valueSelector(state, 'restrictedToIpPool'),
    initialValues: {
      ipPool: ip_pool || selectFirstIpPoolId(state),
      name,
      restrictedToIpPool: Boolean(ip_pool),
      status: compliance ? `${status} by SparkPost` : status
    }
  };
};

const SubaccountEditReduxForm = reduxForm({ form: formName })(SubaccountEditForm);
export default connect(mapStateToProps, {})(SubaccountEditReduxForm);
