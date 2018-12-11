import React from 'react';
import _ from 'lodash';
import { getPlanPrice } from 'src/helpers/billing';
import styles from './PlanPrice.module.scss';

const PlanPrice = ({ plan, showOverage = false, showIp = false, showCsm = false, discount = {} , ...rest }) => {
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

  const displayCsm = showCsm && plan.includesCsm;

  let discountAmount = priceInfo.price;

  if (discount.discount_amount) {
    discountAmount = Math.max(priceInfo.price - discount.discount_amount, 0);
  }

  if (discount.discount_percentage) {
    discountAmount = discountAmount * ((100 - discount.discount_percentage) / 100);
  }

  return (
    <span className='notranslate'>
      <span className={styles.MainLabel} {...rest}>
        <strong>{plan.volume.toLocaleString()}</strong> emails/month
        {priceInfo.price > 0 && <span> at {discountAmount !== priceInfo.price && <s className={styles.DiscountedLabel}>${priceInfo.price}</s>} <strong>${discountAmount.toLocaleString()}</strong>/{priceInfo.intervalShort}</span>}
        {plan.isFree && ' for Free'}
      </span>
      <span className={styles.SupportLabel}>
        {showOverage && overage}
        {showIp && ip}
      </span>
      {displayCsm && <span className={styles.SupportLabel}>Customer Success Manager included.</span>}
    </span>
  );
};

export default PlanPrice;
