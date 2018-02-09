import composeConditions from './compose';

export const notOnPlan = (plan) => ({ account }) => account.subscription.code !== plan;

export const notOnServiceLevel = (level) => ({ account }) => account.service_level !== level;

export const notEnterprise = () => composeConditions(
  notOnPlan('ent1'),
  notOnServiceLevel('enterprise')
);
