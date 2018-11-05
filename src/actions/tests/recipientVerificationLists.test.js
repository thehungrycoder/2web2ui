import { snapshotActionCases } from 'src/__testHelpers__/snapshotActionHelpers';
import {
  uploadRecipientVerificationList,
  singleAddress,
  getLatest,
  getStatus
} from '../recipientVerificationLists';

jest.mock('src/actions/helpers/sparkpostApiRequest');

describe('Recipient Verification Actions', () => {
  snapshotActionCases('.uploadRecipientVerificationList', [
    {
      name: 'when uploading csv',
      action: () => (
        uploadRecipientVerificationList({
          data: 'csv-file'
        })
      )
    }
  ]);

  snapshotActionCases('.singleAddress', [
    {
      name: 'when verifying a single address',
      action: () => (
        singleAddress({
          address: 'foo@bar.com'
        })
      )
    }
  ]);

  snapshotActionCases('.getLatest', [
    {
      name: 'when getting latest list upload',
      action: () => getLatest()
    }
  ]);

  snapshotActionCases('.getStatus', [
    {
      name: 'when getting status of a list job',
      action: () => getStatus('12345')
    }
  ]);
});
