import React from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import PlanPicker from './PlanPicker';
import config from 'config';
import styles from './PlanPicker.module.scss';

const PlanPickerWrapper = ({ plans, pendingSubscription, subscription }) => {
  /**
   * Hide PlanPicker for users with non-self-serve plans
   */
  if (!subscription.self_serve) {
    let supportText = (
      <span>
        To make changes to your plan or billing information, <a href={`mailto:${config.contact.supportEmail}`}>contact support</a>.
      </span>
    );

    if (typeof pendingSubscription !== 'undefined') {
      supportText = (
        <span>
          You're scheduled to switch to the { pendingSubscription.name } plan on {pendingSubscription.effective_date}. If you have any questions, please <a href={`mailto:${config.contact.supportEmail}`}>contact support</a>.
        </span>
      );
    }

    return (
      <div className={styles.PlanPicker}>
        <p className={styles.ManualTitle}>Your current <strong>{ subscription.name }</strong> plan includes <strong>{ subscription.plan_volume.toLocaleString() }</strong> emails per month.</p>
        <p className={styles.ManualHelp}>{ supportText }</p>
      </div>
    );
  }

  /**
   * This component will register the a redux-form field named 'planpicker'
   * Entire plan object is stored in state
   */
  return <Field component={PlanPicker} name='planpicker' plans={plans} />;
};

PlanPickerWrapper.propTypes = {
  // List of plans in the dropdown
  plans: PropTypes.arrayOf(PropTypes.shape({
    code: PropTypes.string.isRequired,
    volume: PropTypes.number.isRequired,
    monthly: PropTypes.number.isRequired,
    overage: PropTypes.number.isRequired
  })).isRequired,

  // The account.subscription object
  subscription: PropTypes.shape({
    self_serve: PropTypes.bool.isRequired,
    plan_volume: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,

  // The account.pending_subscription object
  pendingSubscription: PropTypes.shape({
    effective_date: PropTypes.string,
    name: PropTypes.string
  })
};

export default PlanPickerWrapper;
