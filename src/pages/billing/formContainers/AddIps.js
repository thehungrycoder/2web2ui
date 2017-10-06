import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';

import { showAlert } from 'src/actions/globalAlert';

import { Panel, Button } from '@sparkpost/matchbox';
import DedicatedIpsForm from './forms/DedicatedIpsForm';

import styles from './formContainers.module.scss';

const FORMNAME = 'add-ips';

class AddIps extends Component {

  onSubmit = (values) => {

  }

  render() {
    const { onCancel, handleSubmit, submitting } = this.props;

    return (
      <form onSubmit={handleSubmit((values) => this.onSubmit(values))}>
        <Panel title='Add Dedicated IPs'>
          <Panel.Section>
            <DedicatedIpsForm
              ipPools={[]}
              formName={FORMNAME}
              disabled={submitting} />
          </Panel.Section>
          <Panel.Section>
            <Button type='submit' primary disabled={submitting}>Add Dedicated Ips</Button>
            <Button onClick={onCancel} className={styles.Cancel}>Cancel</Button>
          </Panel.Section>
        </Panel>
      </form>
    );
  }
}

const mapStateToProps = (state) => ({
  billing: state.billing
  // initialValues:
});

const mapDispatchtoProps = { showAlert };
const formOptions = { form: FORMNAME, enableReinitialize: true };
export default connect(mapStateToProps, mapDispatchtoProps)(reduxForm(formOptions)(AddIps));
