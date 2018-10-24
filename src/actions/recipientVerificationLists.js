import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';

export function createRecipientVerificationList(data) {
  return sparkpostApiRequest({
    type: 'CREATE_RECIPIENT_VERIFICATION_LIST',
    meta: {
      method: 'POST',
      url: '/labs/recipient-verification-api',
      data
    }
  });
}
