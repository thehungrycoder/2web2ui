import React from 'react';
import PropTypes from 'prop-types';
import styles from './PlanPicker.module.scss';

const Plan = ({ plan, className, ...rest }) => {
  const monthly = plan.monthly === 0
    ? <strong>Free</strong>
    : <span><strong>${ plan.monthly.toLocaleString() }</strong>/mo</span>;

  const overage = plan.isFree
    ? 'Full-featured developer account'
    : `$${plan.overage.toFixed(2)}/ thousand extra emails`;

  const ip = plan.includesIp
    ? ', first dedicated IP address is free'
    : '';

  return (
    <a className={className} {...rest} >
      <span className={styles.MainLabel}><strong>{ plan.volume.toLocaleString() }</strong> emails for { monthly }</span>
      <span className={styles.SupportLabel}>{ overage }{ ip }</span>
    </a>
  );
};

Plan.propTypes = {
  plan: PropTypes.shape({
    code: PropTypes.string.isRequired,
    volume: PropTypes.number.isRequired,
    monthly: PropTypes.number.isRequired,
    overage: PropTypes.number.isRequired,
    includesIp: PropTypes.bool,
    isFree: PropTypes.bool
  }).isRequired
};

export default Plan;
