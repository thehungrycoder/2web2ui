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

export function getLatestJob() {
  return sparkpostApiRequest({
    type: 'GET_LATEST_JOB',
    meta: {
      method: 'GET',
      url: 'labs/recipient-verification-api/latest'
    }
  });
}

export function getJobStatus(list_id) {
  return sparkpostApiRequest({
    type: 'GET_JOB_STATUS',
    meta: {
      method: 'GET',
      url: `labs/recipient-verification-api/get-job/${list_id}`
    }
  });
}
