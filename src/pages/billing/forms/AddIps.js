import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { Button, Error, Panel } from '@sparkpost/matchbox';

import { addDedicatedIps } from 'src/actions/billing';
import { showAlert } from 'src/actions/globalAlert';
import { createPool } from 'src/actions/ipPools';
import { TextFieldWrapper } from 'src/components';
import config from 'src/config';
import IpPoolSelect from './fields/IpPoolSelect';
import ErrorTracker from 'src/helpers/errorTracker';
import { required, minNumber, maxNumber } from 'src/helpers/validation';

import styles from './Forms.module.scss';

const FORM_NAME = 'add-sending-ips';
const MAX = config.sendingIps.maxPerAccount;

class AddIps extends Component {
  getOrCreateIpPool = async ({ action, id, name }) => {
    let response;

    // Exit early with provided IP pool ID
    if (action !== 'new') { return id; }

    try {
      response = await this.props.createPool({ name });
    } catch (error) {
      ErrorTracker.report('create-ip-pool', error);

      // field-level error
      throw new SubmissionError({
        ipPool: {
          name: 'Unable to create your new IP Pool'
        }
      });
    }

    return response.id;
  }

  onSubmit = async ({ ipPool, quantity }) => {
    const ip_pool = await this.getOrCreateIpPool(ipPool);

    try {
      await this.props.addDedicatedIps({ ip_pool, quantity });
    } catch (error) {
      ErrorTracker.report('add-dedicated-sending-ips', error);

      // form-level error
      throw new SubmissionError({
        _error: 'Unable to complete your request at this time'
      });
    }

    this.props.showAlert({
      message: `Successfully added ${quantity} dedicated IPs!`,
      type: 'success'
    });

    this.props.onClose();
  }

  render() {
    const { error, handleSubmit, onClose, submitting } = this.props;

    return (
      <form onSubmit={handleSubmit(this.onSubmit)}>
        <Panel title='Add Dedicated IPs'>
          <Panel.Section>
            <p>
              Dedicated IP addresses are available to paid plan customers for
              $20.00/mo each, and give you better control over your sending
              reputation. IPs can be managed on the IP Pools management page
              after purchase.
            </p>
            <Field
              autoFocus={true}
              component={TextFieldWrapper}
              label='Quantity'
              name='quantity'
              min='1' max={MAX}
              type='number'
              validate={[required, minNumber(1), maxNumber(MAX)]}
            />
            <IpPoolSelect formName={FORM_NAME} />
          </Panel.Section>
          <Panel.Section>
            <Button type='submit' primary disabled={submitting}>Add Dedicated IPs</Button>
            <Button onClick={onClose} className={styles.Cancel}>Cancel</Button>
            { error && <div class={styles.ErrorWrapper}><Error error={error} /></div> }
          </Panel.Section>
        </Panel>
      </form>
    );
  }
}

const mapStateToProps = (state) => ({
  sendingIps: state.sendingIps.list
});

const mapDispatchtoProps = { addDedicatedIps, createPool, showAlert };
export default connect(mapStateToProps, mapDispatchtoProps)(reduxForm({ form: FORM_NAME })(AddIps));
