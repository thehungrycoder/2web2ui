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
