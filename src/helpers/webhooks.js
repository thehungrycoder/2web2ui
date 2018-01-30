import _ from 'lodash';

/*
 * Assigns subaccount_id to 0 on webhooks that are assigned only to master account
 */
export function mergeWebhooks(masterAccountWebhooks, webhooks) {
  const masterAccountIds = masterAccountWebhooks.map(({ id }) => id);

  return webhooks.map((webhook) => {
    if (_.includes(masterAccountIds, webhook.id)) {
      webhook.subaccount_id = 0;
    }

    return webhook;
  });
}
