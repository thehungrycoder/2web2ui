import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';
import setSubaccountHeader from './helpers/setSubaccountHeader';

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

export function getWebhook({ id, subaccountId = null }) {
  const headers = setSubaccountHeader(subaccountId);

  return sparkpostApiRequest({
    type: 'GET_WEBHOOK',
    meta: {
      method: 'GET',
      url: `/webhooks/${id}`,
      headers
    }
  });
}

export function createWebhook({ subaccount, ...data }) {
  const headers = setSubaccountHeader(subaccount);
  return sparkpostApiRequest({
    type: 'CREATE_WEBHOOK',
    meta: {
      method: 'POST',
      url: '/webhooks',
      data,
      headers
    }
  });
}

export function updateWebhook({ id, subaccount = null, ...data }) {
  const headers = setSubaccountHeader(subaccount);
  return sparkpostApiRequest({
    type: 'UPDATE_WEBHOOK',
    meta: {
      method: 'PUT',
      url: `/webhooks/${id}`,
      data,
      headers
    }
  });
}

export function deleteWebhook({ id, subaccount }) {
  const headers = setSubaccountHeader(subaccount);
  return sparkpostApiRequest({
    type: 'DELETE_WEBHOOK',
    meta: {
      method: 'DELETE',
      url: `/webhooks/${id}`,
      headers
    }
  });
}

export function testWebhook({ id, subaccount, ...data }) {
  const headers = setSubaccountHeader(subaccount);
  return sparkpostApiRequest({
    type: 'TEST_WEBHOOK',
    meta: {
      method: 'POST',
      url: `/webhooks/${id}/validate`,
      data,
      headers
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
