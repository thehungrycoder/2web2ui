import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';

import { Button, Panel } from '@sparkpost/matchbox';
import { getNonDefaultIpPools } from 'src/selectors/ipPools';
import { selectInitialSubaccountValues } from 'src/selectors/subaccounts';
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
  const { compliance } = subaccount;

  return {
    compliance,
    ipPools: getNonDefaultIpPools(state),
    restrictedToIpPool: valueSelector(state, 'restrictedToIpPool'),
    initialValues: selectInitialSubaccountValues(subaccount)
  };
};

const SubaccountEditReduxForm = reduxForm({ form: formName })(SubaccountEditForm);
export default connect(mapStateToProps, {})(SubaccountEditReduxForm);
