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
export function getAbTest({ id, version }) {
  // Is this even needed? seems to work without /draft/
  // const url = draft ? `/ab-test/draft/${id}` : `/ab-test/${id}`;

  return sparkpostApiRequest({
    type: 'GET_AB_TEST',
    meta: {
      method: 'GET',
      url: `/ab-test/${id}`,
      showErrorAlert: false,
      params: {
        version
      }
    }
  });
}

export function updateDraftTest() {
  return sparkpostApiRequest({
    type: 'UPDATE_AB_TEST_DRAFT',
    meta: {
      method: 'PUT',
      url: `/ab-test/draft/${id}`
    }
  });
}

export function updateTest() {
  return sparkpostApiRequest({
    type: 'UPDATE_AB_TEST',
    meta: {
      method: 'PUT',
      url: `/ab-test/${id}`
    }
  });
}
