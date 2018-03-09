import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styles from './PlanPicker.module.scss';

class Plan extends React.Component {
  getPrice(plan) {
    const pricingInterval = _.has(plan, 'hourly') ? 'hourly' : 'monthly';
    const intervalShortName = pricingInterval === 'hourly' ? 'hr' : 'mo';
    const pricePerInterval = plan[pricingInterval];
    return pricePerInterval
      ? <span>for {pricePerInterval.toLocaleString()}/{intervalShortName}</span>
      : 'for Free';
  }

  getVolume(plan) {
    const pricingInterval = _.has(plan, 'hourly') ? 'hourly' : 'monthly';
    const intervalShortName = pricingInterval === 'hourly' ? 'hr' : 'mo';
    const pricePerInterval = plan[pricingInterval];
    return pricePerInterval
      ? <span>for {pricePerInterval.toLocaleString()}/{intervalShortName}</span>
      : 'for Free';
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
        <span className={styles.MainLabel}><strong>{ plan.volume.toLocaleString() }</strong> emails/month {this.getPrice(plan)}</span>
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
