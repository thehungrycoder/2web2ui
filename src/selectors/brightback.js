import config from 'src/config';
import { getLocalTimezone } from 'src/helpers/date';

export const selectBrightbackData = (state, { urls = {}}) => {
  const { customer_id, created } = state.account;
  const { email } = state.currentUser;
  const { brightback: brightbackConfig, defaultPlan } = config;
  const { save_return_url, cancel_confirmation_url, billing_url } = urls;

  return {
    app_id: brightbackConfig.app_id,
    timestamp: new Date().toISOString(),
    context: {
      locale: navigator.language,
      timezone: getLocalTimezone(),
      user_agent: navigator.userAgent,
      url: window.location.href,
      referrer: document.referrer
    },
    save_return_url: `${window.location.origin}${save_return_url}`,
    cancel_confirmation_url: `${window.location.origin}${cancel_confirmation_url}?immediatePlanChange=${defaultPlan}`,
    billing_url: `${window.location.origin}${billing_url}`,
    account: {
      created_at: new Date(created).getTime(),
      internal_id: customer_id
    },
    email
  };
};
