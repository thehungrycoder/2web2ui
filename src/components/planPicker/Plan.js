import React from 'react';
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
        <span className={styles.MainLabel}><strong>{ plan.volume.toLocaleString() }</strong> emails/month for {this.getPrice(plan)}</span>
        <span className={styles.SupportLabel}>{ overage }{ ip }</span>
      </a>
    );
  }
}

Plan.propTypes = {
  plan: PropTypes.shape({
    volume: PropTypes.number.isRequired,
    // monthly: PropTypes.number.isRequired, //TODO it would be either monthly or hourly
    overage: PropTypes.number.isRequired,
    includesIp: PropTypes.bool,
    isFree: PropTypes.bool
  }).isRequired
};

export default Plan;
