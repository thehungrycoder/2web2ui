import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';
import setSubaccountHeader from './helpers/setSubaccountHeader';

export function listWebhooks() {
  return sparkpostApiRequest({
    type: 'LIST_WEBHOOKS',
    meta: {
      method: 'GET',
      url: '/webhooks',
      showErrorAlert: false
    }
  });
}

export function getWebhook({ id, subaccount = null }) {
  const headers = setSubaccountHeader(subaccount);

  // Subaccount is passed through from qp because:
  // - 'subaccount_id: 0' is not returned from this call
  // - don't have to read qp again
  return sparkpostApiRequest({
    type: 'GET_WEBHOOK',
    meta: {
      method: 'GET',
      url: `/webhooks/${id}`,
      subaccount,
      headers
    }
  });
}

export function createWebhook({ webhook, subaccount = null }) {
  const headers = setSubaccountHeader(subaccount);

  // Subaccount is passed through to be used in the redirect in componentDidMount
  // webhook ID for the target url is only available after this action succeeds
  return sparkpostApiRequest({
    type: 'CREATE_WEBHOOK',
    meta: {
      method: 'POST',
      url: '/webhooks',
      data: webhook,
      subaccount,
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

export function deleteWebhook({ id, subaccount = null }) {
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

export function testWebhook({ id, subaccount = null, message }) {
  const headers = setSubaccountHeader(subaccount);
  return sparkpostApiRequest({
    type: 'TEST_WEBHOOK',
    meta: {
      method: 'POST',
      url: `/webhooks/${id}/validate`,
      data: { message },
      headers
    }
  });
}

export function getEventDocs() {
  return sparkpostApiRequest({
    type: 'GET_EVENT_DOCS',
    meta: {
      method: 'GET',
      url: '/webhooks/events/documentation'
    }
  });
}

export function getEventSamples(events) {
  return sparkpostApiRequest({
    type: 'GET_EVENT_SAMPLES',
    meta: {
      method: 'GET',
      url: '/webhooks/events/samples',
      params: { events: events.join(',') }
    }
  });
}

export function getBatches({ id, subaccount = null, params }) {
  const headers = setSubaccountHeader(subaccount);
  return sparkpostApiRequest({
    type: 'GET_WEBHOOK_BATCHES',
    meta: {
      method: 'GET',
      url: `/webhooks/${id}/batches`,
      headers,
      params
    }
  });
}
