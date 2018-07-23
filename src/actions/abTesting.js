import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';

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
