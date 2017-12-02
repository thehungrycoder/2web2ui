import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
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
import { currentPlanSelector } from 'src/selectors/accountBillingInfo';
import DedicatedIpCost from '../components/DedicatedIpCost';

import styles from './Forms.module.scss';

const FORM_NAME = 'add-sending-ips';
const MAX = config.sendingIps.maxPerAccount;
const WarmUpArticleLink = () => (
  <a
    href='https://support.sparkpost.com/customer/portal/articles/1972209-ip-warm-up-overview'
    rel='noopener noreferrer'
    target='_blank'
  >
    IP Warm-up Overview article
  </a>
);

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

  renderDescription() {
    const { currentPlan } = this.props;
    const cost = <DedicatedIpCost plan={currentPlan} quantity={1} />;

    if (currentPlan.isAwsAccount) {
      return (
        <p>
          Dedicated IP addresses are available to AWS Marketplace customers for { cost }
          They give you better control over your sending reputation. You can purchase up to { MAX }.
          { currentPlan.includesIp && 'Your plan includes one free.' } New dedicated IP addresses
          will need to be warmed up first. Read the <WarmUpArticleLink /> for more information. Visit
          the <Link to="/account/ip-pools">IP Pools page</Link> to manage your dedicated IP addresses.
        </p>
      );
    }

    return (
      <p>
        Dedicated IP addresses are available to paid plan customers for { cost }. They
        give you better control over your sending reputation. You can purchase up to { MAX }.
        { currentPlan.includesIp && `Your plan includes one free. Your account statement will show
        a charge with a matching refund.` } New dedicated IP addresses will need to be warmed up
        first. Read the <WarmUpArticleLink /> for more information. Visit
        the <Link to='/account/ip-pools'>IP Pools page</Link> to manage your dedicated IP addresses.
      </p>
    );
  }

  render() {
    const { error, handleSubmit, onClose, sendingIps, submitting } = this.props;
    const remaining = MAX - Math.min(sendingIps.length, MAX);

    // This form should not be rendered if the account has no remaining IP addresses
    const isDisabled = submitting || remaining === 0;

    return (
      <form onSubmit={handleSubmit(this.onSubmit)} noValidate>
        <Panel title='Add Dedicated IPs'>
          <Panel.Section>
            { this.renderDescription() }
            <Field
              component={TextFieldWrapper}
              disabled={isDisabled}
              label='Quantity'
              name='quantity'
              min='1' max={remaining}
              required
              type='number'
              validate={[required, minNumber(1), maxNumber(remaining)]}
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
