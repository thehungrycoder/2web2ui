import React from 'react';
import _ from 'lodash';
import { getPlanPrice } from 'src/helpers/billing';
import styles from './PlanPrice.module.scss';

const PlanPrice = ({ plan, showOverage = false, showIp = false, ...rest }) => {
  if (_.isEmpty(plan)) {
    return null;
  }

  const priceInfo = getPlanPrice(plan);

  const overage = plan.isFree
    ? 'Full-featured developer account'
    : plan.overage ? `$${plan.overage.toFixed(2)}/ thousand extra emails. ` : null;

  const ip = plan.includesIp
    ? 'First dedicated IP address is free'
    : null;

  return (
    <span className='notranslate'>
      <span className={styles.MainLabel} {...rest}>
        <strong>{plan.volume.toLocaleString()}</strong> emails/month
        {priceInfo.price > 0 && <span> at <strong>${priceInfo.price.toLocaleString()}</strong>/{priceInfo.intervalShort}</span>}
        {plan.isFree && ' for Free'}
      </span>
      <span className={styles.SupportLabel}>
        {showOverage && overage}

        {showIp && ip}
      </span>
    </span>
  );
};

export default PlanPrice;
