import config from 'src/config';

export const selectBrightbackData = (state) => {
  const { customer_id, created } = state.account;
  const { brightback: brightbackConfig } = config;

  return {
    app_id: brightbackConfig.app_id,
    context: {
      locale: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, // eslint-disable-line new-cap
      user_agent: navigator.userAgent,
      url: window.location.href,
      referrer: document.referrer
    },
    save_return_url: `${window.location.origin}${brightbackConfig.save_return_url}`,
    cancel_confirmation_url: `${window.location.origin}${brightbackConfig.cancel_confirmation_url}`,
    billing_url: `${window.location.origin}${brightbackConfig.billing_url}`,
    account: {
      created_at: new Date(created).getTime(),
      internal_id: customer_id
    }
  };
};
