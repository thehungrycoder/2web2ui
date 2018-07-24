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

export function createAbTest({ abTest, subaccount = null }) {
  const headers = setSubaccountHeader(subaccount);

  return sparkpostApiRequest({
    type: 'CREATE_AB_TEST',
    meta: {
      method: 'POST',
      url: '/ab-test',
      data: abTest,
      headers
    }
  });
}

export function createAbTestDraft({ abTest, subaccount = null }) {
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
