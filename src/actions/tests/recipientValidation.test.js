import { snapshotActionCases } from 'src/__testHelpers__/snapshotActionHelpers';
import {
  uploadList,
  singleAddress,
  getLatestJob,
  getJobStatus
} from '../recipientValidation';

jest.mock('src/actions/helpers/sparkpostApiRequest');

describe('Recipient Verification Actions', () => {
  snapshotActionCases('.uploadList', [
    {
      name: 'when uploading csv',
      action: () => (
        uploadList({
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

  snapshotActionCases('.getLatestJob', [
    {
      name: 'when getting latest list upload',
      action: () => getLatestJob()
    }
  ]);

  snapshotActionCases('.getJobStatus', [
    {
      name: 'when getting status of a list job',
      action: () => getJobStatus('12345')
    }
  ]);
});
