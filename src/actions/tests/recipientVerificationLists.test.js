import { snapshotActionCases } from 'src/__testHelpers__/snapshotActionHelpers';
import {
  uploadRecipientVerificationList,
  singleAddress
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
});
