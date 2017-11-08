import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';

import { Button, Panel } from '@sparkpost/matchbox';

import { NameField, IpPoolSelect, StatusSelect } from './FormFields';

export class SubaccountEditForm extends Component {

  render() {
    const {
      handleSubmit,
      pristine,
      submitting,
      ipPools,
      compliance,
      reset
    } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <Panel.Section>
          <NameField disabled={submitting}/>

          { !!ipPools.length && <IpPoolSelect ipPools={ipPools} disabled={submitting} /> }

          <StatusSelect disabled={submitting} compliance={compliance} />
        </Panel.Section>
        <Panel.Section>
          <Button submit primary disabled={pristine || submitting}>
            { submitting ? 'Updating...' : 'Update' }
          </Button>
          { !pristine && <Button style={{ marginLeft: '1em' }} disabled={pristine || submitting} onClick={reset}>Cancel</Button> }
        </Panel.Section>
      </form>
    );
  }
}

const formName = 'SubaccountEditForm';

const mapStateToProps = (state, { subaccount }) => ({
  ipPools: state.ipPools.list,
  compliance: subaccount.compliance_status,
  initialValues: {
    ipPool: subaccount.ip_pool || 'default',
    ...subaccount
  }
});

const SubaccountEditReduxForm = reduxForm({ form: formName })(SubaccountEditForm);
export default connect(mapStateToProps, {})(SubaccountEditReduxForm);
