import sparkpostLabsRequest from 'src/actions/helpers/sparkpostLabsRequest';

export function createRecipientVerificationList(data) {
  return sparkpostLabsRequest({
    type: 'CREATE_RECIPIENT_VERIFICATION_LIST',
    meta: {
      method: 'POST',
      url: '/recipient-verification-api',
      data,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  });
}
