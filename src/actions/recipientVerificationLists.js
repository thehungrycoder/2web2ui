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

export function singleAddress(address) {
  return sparkpostApiRequest({
    type: 'SINGLE_RECIPIENT_VERIFICATION',
    meta: {
      method: 'GET',
      url: `labs/recipient-verification-api/single/${address}`,
      email: address
    }
  });
}

export function getLatest() {
  return sparkpostApiRequest({
    type: 'GET_LATEST_UPLOAD',
    meta: {
      method: 'GET',
      url: 'labs/recipient-verification-api/latest'
    }
  })
}

export function getStatus(list_id) {
  return sparkpostApiRequest({
    type: 'GET_UPLOAD_STATUS',
    meta: {
      method: 'GET',
      url: `labs/recipient-verification-api/get-job/${list_id}`
    }
  })
}
