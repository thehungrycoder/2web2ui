import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';

export function uploadRecipientVerificationList(data) {
  return sparkpostApiRequest({
    type: 'UPLOAD_RECIPIENT_VERIFICATION_LIST',
    meta: {
      method: 'POST',
      url: 'v1/recipient-validation',
      data
    }
  });
}

export function singleAddress(address) {
  return sparkpostApiRequest({
    type: 'SINGLE_RECIPIENT_VERIFICATION',
    meta: {
      method: 'GET',
      url: `v1/recipient-validation/single/${address}`,
      email: address
    }
  });
}
