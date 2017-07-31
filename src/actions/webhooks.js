// TODO: support timezone param?
export function listWebhooks () {
  return {
    type: 'SPARKPOST_API_REQUEST',
    meta: {
      type: 'LIST_WEBHOOKS',
      method: 'GET',
      url: '/webhooks'
    }
  };
}

export function getWebhook (id) {
  return {
    type: 'SPARKPOST_API_REQUEST',
    meta: {
      type: 'GET_WEBHOOK',
      method: 'GET',
      url: `/webhooks/${id}`
    }
  };
}

export function createWebhook (webhook) {
  return {
    type: 'SPARKPOST_API_REQUEST',
    meta: {
      type: 'CREATE_WEBHOOK',
      method: 'POST',
      url: '/webhooks',
      data: webhook
    }
  };
}

export function updateWebhook (id, update) {
  return {
    type: 'SPARKPOST_API_REQUEST',
    meta: {
      type: 'UPDATE_WEBHOOK',
      method: 'PUT',
      url: `/webhooks/${id}`,
      data: update
    }
  };
}

export function getEventDocs () {
  return {
    type: 'SPARKPOST_API_REQUEST',
    meta: {
      type: 'GET_EVENT_DOCS',
      method: 'GET',
      url: 'webhooks/events/documentation '
    }
  };
}
