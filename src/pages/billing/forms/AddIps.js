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
import { currentPlanSelector, dedicatedIpPrice } from 'src/selectors/accountBillingInfo';

import styles from './Forms.module.scss';

const FORM_NAME = 'add-sending-ips';
const MAX = config.sendingIps.maxPerAccount;
const WarmUpArticleLink = () => (
  <a
    href='https://support.sparkpost.com/customer/portal/articles/1972209-ip-warm-up-overview'
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

  renderDescription() {
    const { currentPlan, dedicatedIpPrice } = this.props;

    if (currentPlan.isAwsAccount) {
      return (
        <p>
          Dedicated IP addresses are available to AWS Marketplace customers for { dedicatedIpPrice }
          They give you better control over your sending reputation. You can purchase up to { MAX }.
          { currentPlan.includesIp && 'Your plan includes one free.' } New dedicated IP addresses
          will need to be warmed up first. Read the <WarmUpArticleLink /> for more information. Visit
          the <Link to="/account/ip-pools">IP Pools page</Link> to manage your dedicated IP addresses.
        </p>
      );
    }

    return (
      <p>
        Dedicated IP addresses are available to paid plan customers for { dedicatedIpPrice }. They
        give you better control over your sending reputation. You can purchase up to { MAX }.
        { currentPlan.includesIp && `Your plan includes one free. Your account statement will show
        a charge with a matching refund.` } New dedicated IP addresses will need to be warmed up
        first. Read the <WarmUpArticleLink /> for more information. Visit
        the <Link to='/account/ip-pools'>IP Pools page</Link> to manage your dedicated IP addresses.
      </p>
    );
  }

  render() {
    const { error, handleSubmit, onClose, submitting } = this.props;

    return (
      <form onSubmit={handleSubmit(this.onSubmit)}>
        <Panel title='Add Dedicated IPs'>
          <Panel.Section>
            { this.renderDescription() }
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
  currentPlan: currentPlanSelector(state),
  dedicatedIpPrice: dedicatedIpPrice(state),
  sendingIps: state.sendingIps.list
});

const mapDispatchtoProps = { addDedicatedIps, createPool, showAlert };
export default connect(mapStateToProps, mapDispatchtoProps)(reduxForm({ form: FORM_NAME })(AddIps));
