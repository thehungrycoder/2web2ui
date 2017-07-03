// TODO: support timezone param?
export function listWebhooks () {
  return {
    type: 'SPARKPOST_API_REQUEST',
    meta: {
      type: 'LIST_WEBHOOKS',
      method: 'GET',
      url: `/webhooks`
    }
  };
}
