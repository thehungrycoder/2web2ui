import { any, all } from './compose';
import _ from 'lodash';

export const onPlan = (planCode) => ({ accountPlan }) => accountPlan.code === planCode;
export const onPlanWithStatus = (status) => ({ accountPlan }) => accountPlan.status === status;
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
export const subscriptionSelfServeIsTrue = ({ account }) => _.get(account, 'subscription.self_serve', false);
export const isAws = ({ account }) => _.get(account, 'subscription.type') === 'aws';
export const isSelfServeBilling = any(subscriptionSelfServeIsTrue, isAws);
export const hasOnlineSupport = ({ account }) => _.get(account, 'support.online', false);
export const hasUiOption = (option) => ({ account }) => _.has(account.options, `ui.${option}`);
