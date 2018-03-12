import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { getPlanPrice } from 'src/helpers/billing';
import styles from './PlanPicker.module.scss';

class Plan extends React.Component {
  getPrice(plan) {
    const priceInfo = getPlanPrice(plan);

    return priceInfo.price
      ? <span><strong>${priceInfo.price.toLocaleString()}</strong>/{priceInfo.intervalShort}</span>
      : <strong>Free</strong>;
  }

  render() {
    const { plan, className, ...rest } = this.props;
    const overage = plan.isFree
      ? 'Full-featured developer account'
      : `$${plan.overage.toFixed(2)}/ thousand extra emails`;

    const ip = plan.includesIp
      ? ', first dedicated IP address is free'
      : '';

    return (
      <a className={className} {...rest} >
        <span
          className={styles.MainLabel}><strong>{ plan.volume.toLocaleString() }</strong> emails/month for {this.getPrice(plan)}</span>
        <span className={styles.SupportLabel}>{ overage }{ ip }</span>
      </a>
    );
  }
}

function eitherMonthlyOrHourly(props, propName, componentName) {
  const hasMonthly = _.has(props, 'monthly');
  const hasHourly = _.has(props, 'hourly');

  // If both are provided, or neither, error
  if ((hasMonthly && hasHourly) || !(hasMonthly || hasHourly)) {
    return new Error('Plan\'s pricing should either be hourly or monthly but not both');
  }
}

Plan.propTypes = {
  plan: PropTypes.shape({
    volume: PropTypes.number.isRequired,
    monthly: eitherMonthlyOrHourly,
    hourly: eitherMonthlyOrHourly,
    overage: PropTypes.number.isRequired,
    includesIp: PropTypes.bool,
    isFree: PropTypes.bool
  }).isRequired
};

export default Plan;
