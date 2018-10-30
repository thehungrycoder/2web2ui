import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';

export function uploadRecipientVerificationList(data) {
  return sparkpostApiRequest({
    type: 'UPLOAD_RECIPIENT_VERIFICATION_LIST',
    meta: {
      method: 'POST',
      url: 'labs/recipient-verification-api',
      data
    }
  });
}
