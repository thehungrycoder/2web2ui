import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';
import setSubaccountHeader from './helpers/setSubaccountHeader';

export function listAbTests() {
  return sparkpostApiRequest({
    type: 'LIST_AB_TESTS',
    meta: {
      method: 'GET',
      url: '/ab-test',
      showErrorAlert: false
    }
  });
}

export function createAbTestDraft({ abTest, subaccount }) {
  const headers = setSubaccountHeader(subaccount);

  return sparkpostApiRequest({
    type: 'CREATE_AB_TEST_DRAFT',
    meta: {
      method: 'POST',
      url: '/ab-test/draft',
      data: abTest,
      headers
    }
  });
}

export function getAbTest({ id, version, subaccountId, type = 'GET_AB_TEST' }) {
  return sparkpostApiRequest({
    type,
    meta: {
      method: 'GET',
      url: `/ab-test/${id}`,
      showErrorAlert: false,
      headers: setSubaccountHeader(subaccountId),
      params: {
        version
      }
    }
  });
}

export function deleteAbTest({ id, subaccountId }) {
  return sparkpostApiRequest({
    type: 'DELETE_AB_TEST',
    meta: {
      method: 'DELETE',
      url: `/ab-test/${id}`,
      headers: setSubaccountHeader(subaccountId),
      data: { id, subaccountId }
    }
  });
}

export function cancelAbTest({ id, subaccountId }) {
  return sparkpostApiRequest({
    type: 'CANCEL_AB_TEST',
    meta: {
      method: 'POST',
      url: `/ab-test/${id}/cancel`,
      headers: setSubaccountHeader(subaccountId),
      id, subaccountId
    }
  });
}

export function scheduleAbTest(data, { id, subaccountId }) {
  return sparkpostApiRequest({
    type: 'SCHEDULE_AB_TEST',
    meta: {
      method: 'POST',
      url: `/ab-test/draft/${id}/schedule`,
      headers: setSubaccountHeader(subaccountId),
      data
    }
  });
}

// Gets the latest A/B test's version. Does not get full A/B test details.
export function getLatestAbTest({ id, subaccountId }) {
  return getAbTest({ id, subaccountId, type: 'GET_LATEST_AB_TEST' });
}

export function updateDraft(data, { id, subaccountId }) {
  return sparkpostApiRequest({
    type: 'UPDATE_AB_TEST_DRAFT',
    meta: {
      method: 'PUT',
      url: `/ab-test/draft/${id}`,
      headers: setSubaccountHeader(subaccountId),
      data
    }
  });
}

export function updateAbTest(data, { id, subaccountId }) {
  return sparkpostApiRequest({
    type: 'UPDATE_AB_TEST',
    meta: {
      method: 'PUT',
      url: `/ab-test/${id}`,
      headers: setSubaccountHeader(subaccountId),
      data
    }
  });
}
