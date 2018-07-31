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
