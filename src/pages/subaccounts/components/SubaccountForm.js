import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';

import { Button, Panel } from '@sparkpost/matchbox';
import { getSubaccountGrants } from 'src/selectors/api-keys';

import { NameField, ApiKeyCheckBox, ApiKeyFields, IpPoolSelect } from './formFields';

export class SubaccountForm extends Component {

  render() {
    const {
      handleSubmit,
      pristine,
      showGrants,
      grants,
      submitting,
      createApiKey,
      ipPools
    } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <Panel.Section>
          <NameField disabled={submitting}/>
        </Panel.Section>
        <Panel.Section>
          <ApiKeyCheckBox disabled={submitting} createApiKey={createApiKey}/>
          <ApiKeyFields show={createApiKey} showGrants={showGrants} grants={grants} submitting={submitting}/>
        </Panel.Section>
        { !!ipPools.length &&
          <Panel.Section>
            <IpPoolSelect ipPools={ipPools} disabled={submitting} />
          </Panel.Section>
        }
        <Panel.Section>
          <Button submit primary disabled={submitting || pristine}>
            { submitting ? 'Loading...' : 'Create' }
          </Button>
        </Panel.Section>
      </form>
    );
  }
}

const formName = 'SubaccountForm';
const valueSelector = formValueSelector(formName);

const mapStateToProps = (state, props) => ({
  grants: getSubaccountGrants(state),
  createApiKey: valueSelector(state, 'createApiKey'),
  showGrants: valueSelector(state, 'grantsRadio') === 'select',
  ipPools: state.ipPools.list,
  initialValues: {
    grantsRadio: 'all',
    createApiKey: true,
    ipPool: 'default'
  }
});

const SubaccountReduxForm = reduxForm({ form: formName })(SubaccountForm);
export default connect(mapStateToProps, {})(SubaccountReduxForm);
