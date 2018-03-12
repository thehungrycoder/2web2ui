import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { Button, Error, Panel, Banner } from '@sparkpost/matchbox';
import { addDedicatedIps } from 'src/actions/billing';
import { showAlert } from 'src/actions/globalAlert';
import { createPool } from 'src/actions/ipPools';
import { TextFieldWrapper } from 'src/components';
import config from 'src/config';
import IpPoolSelect from './fields/IpPoolSelect';
import ErrorTracker from 'src/helpers/errorTracker';
import { required, minNumber, maxNumber } from 'src/helpers/validation';
import { currentPlanSelector } from 'src/selectors/accountBillingInfo';
import DedicatedIpCost from '../components/DedicatedIpCost';
import styles from './Forms.module.scss';

const FORM_NAME = 'add-sending-ips';

class AddIps extends Component {
  getOrCreateIpPool = async({ action, id, name }) => {
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

  onSubmit = async({ ipPool, quantity }) => {
    const ip_pool = await this.getOrCreateIpPool(ipPool);
    const { isAwsAccount } = this.props.currentPlan;

    try {
      await this.props.addDedicatedIps({ ip_pool, isAwsAccount, quantity });
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

  renderFreeIpNotice() {
    if (this.props.currentPlan.isAwsAccount) {
      return <Banner status='info'>Your plan includes one free dedicated IP address.</Banner>;
    }

    return (
      <Banner status='info'>
        Your plan includes one free dedicated IP address. {this.props.sendingIps.length === 0 && 'Once you\'ve purchased at least one IP, your account statement will show a charge with a matching refund.'}
      </Banner>
    );
  }

  render() {
    const { currentPlan, error, handleSubmit, onClose, submitting } = this.props;
    const { maxPerAccount } = config.sendingIps;

    const remainingCount = maxPerAccount - Math.min(this.props.sendingIps.length, maxPerAccount);

    // This form should not be rendered if the account has no remaining IP addresses
    const isDisabled = submitting || remainingCount === 0;

    const action = { content: 'Manage Your IPs', to: '/account/ip-pools', Component: Link };

    return (
      <form onSubmit={handleSubmit(this.onSubmit)} noValidate>
        <Panel title='Add Dedicated IPs' actions={[action]}>
          <Panel.Section>
            <p>
              Dedicated IPs give you better control over your sending reputation.
            </p>
            { currentPlan.includesIp && this.renderFreeIpNotice() }
            <Field
              component={TextFieldWrapper}
              disabled={isDisabled}
              label='Quantity'
              name='quantity'
              min='1' max={remainingCount}
              required
              type='number'
              validate={[required, minNumber(1), maxNumber(remainingCount)]}
              autoFocus
              helpText={<span>You can add up to {maxPerAccount} total dedicated IPs to your plan for <DedicatedIpCost plan={currentPlan} quantity='1' /> each.</span>}
            />
            <IpPoolSelect disabled={isDisabled} formName={FORM_NAME} />
          </Panel.Section>
          <Panel.Section>
            <Button type='submit' primary disabled={isDisabled}>Add Dedicated IPs</Button>
            <Button onClick={onClose} className={styles.Cancel}>Cancel</Button>
            { error && <div className={styles.ErrorWrapper}><Error error={error} /></div> }
          </Panel.Section>
        </Panel>
      </form>
    );
  }
}

const mapStateToProps = (state) => ({
  currentPlan: currentPlanSelector(state),
  sendingIps: state.sendingIps.list,
  initialValues: {
    ipPool: {
      action: 'new'
    }
  }
});

const mapDispatchtoProps = { addDedicatedIps, createPool, showAlert };
export default connect(mapStateToProps, mapDispatchtoProps)(reduxForm({ form: FORM_NAME })(AddIps));
