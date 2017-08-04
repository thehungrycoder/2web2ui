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

export function deleteWebhook (id) {
  return {
    type: 'SPARKPOST_API_REQUEST',
    meta: {
      type: 'DELETE_WEBHOOK',
      method: 'DELETE',
      url: `/webhooks/${id}`
    }
  };
}

export function testWebhook (id, payload) {
  return {
    type: 'SPARKPOST_API_REQUEST',
    meta: {
      type: 'TEST_WEBHOOK',
      method: 'POST',
      url: `/webhooks/${id}/validate`,
      data: { message: payload }
    }
  };
}

export function getEventDocs () {
  return {
    type: 'SPARKPOST_API_REQUEST',
    meta: {
      type: 'GET_EVENT_DOCS',
      method: 'GET',
      url: 'webhooks/events/documentation'
    }
  };
}

export function getEventSamples (events) {
  return {
    type: 'SPARKPOST_API_REQUEST',
    meta: {
      type: 'GET_EVENT_SAMPLES',
      method: 'GET',
      url: 'webhooks/events/samples',
      params: { events: events.join(',') }
    }
  };
}
