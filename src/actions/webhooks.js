import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';

// TODO: support timezone param?
export function listWebhooks() {
  return sparkpostApiRequest({
    type: 'LIST_WEBHOOKS',
    meta: {
      method: 'GET',
      url: '/webhooks'
    }
  });
}

export function getWebhook(id) {
  return sparkpostApiRequest({
    type: 'GET_WEBHOOK',
    meta: {
      method: 'GET',
      url: `/webhooks/${id}`
    }
  });
}

export function createWebhook(webhook) {
  return sparkpostApiRequest({
    type: 'CREATE_WEBHOOK',
    meta: {
      method: 'POST',
      url: '/webhooks',
      data: webhook
    }
  });
}

export function updateWebhook(id, update) {
  return sparkpostApiRequest({
    type: 'UPDATE_WEBHOOK',
    meta: {
      method: 'PUT',
      url: `/webhooks/${id}`,
      data: update
    }
  });
}

export function deleteWebhook(id) {
  return sparkpostApiRequest({
    type: 'DELETE_WEBHOOK',
    meta: {
      method: 'DELETE',
      url: `/webhooks/${id}`
    }
  });
}

export function testWebhook(id, payload) {
  return sparkpostApiRequest({
    type: 'TEST_WEBHOOK',
    meta: {
      method: 'POST',
      url: `/webhooks/${id}/validate`,
      data: { message: payload }
    }
  });
}

export function getEventDocs() {
  return sparkpostApiRequest({
    type: 'GET_EVENT_DOCS',
    meta: {
      method: 'GET',
      url: 'webhooks/events/documentation'
    }
  });
}

export function getEventSamples(events) {
  return sparkpostApiRequest({
    type: 'GET_EVENT_SAMPLES',
    meta: {
      method: 'GET',
      url: 'webhooks/events/samples',
      params: { events: events.join(',') }
    }
  });
}

export function getBatches(id) {
  return sparkpostApiRequest({
    type: 'GET_WEBHOOK_BATCHES',
    meta: {
      method: 'GET',
      url: `/webhooks/${id}/batch-status`
    }
  });
}
