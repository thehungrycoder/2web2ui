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
    type: 'GET_LATEST',
    meta: {
      method: 'GET',
      url: 'labs/recipient-verification-api/latest'
    }
  })
}

// {
//     "upload_timestamp": 1540588558,
//     "list_id": "55169360-d964-11e8-908a-69a01fff9956",
//     "complete": false,
// }

export function getJob(list_id) {
  return sparkpostApiRequest({
    type: 'GET_JOB',
    meta: {
      method: 'GET',
      url: `labs/recipient-verification-api/get-job/${list_id}`
    }
  })
}

// {
//     "upload_timestamp": 1540588558,
//     "list_id": "55169360-d964-11e8-908a-69a01fff9956",
//     "complete": false,
// }
