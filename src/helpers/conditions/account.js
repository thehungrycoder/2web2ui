import { any, all } from './compose';
import _ from 'lodash';

export const onPlan = (plan) => ({ account }) => account.subscription.code === plan;
export const onServiceLevel = (level) => ({ account }) => account.service_level === level;
export const isEnterprise = any(
  onPlan('ent1'),
  onServiceLevel('enterprise')
);
export const hasStatus = (status) => ({ account }) => account.status === status;
export const hasStatusReasonCategory = (category) => ({ account }) => account.status_reason_category === category;
export const isSuspendedForBilling = all(
  hasStatus('suspended'),
  hasStatusReasonCategory('100.01')
);
export const isSelfServeBilling = ({ account }) => _.get(account, 'subscription.self_serve', false);
