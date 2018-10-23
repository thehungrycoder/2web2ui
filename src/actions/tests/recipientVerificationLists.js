import { snapshotActionCases } from 'src/__testHelpers__/snapshotActionHelpers';
import {
  createRecipientVerificationList
} from '../recipientVerificationLists';

jest.mock('src/actions/helpers/sparkpostLabsRequest');

describe('Recipient Verification Actions', () => {
  snapshotActionCases('.createRecipientVerificationList', [
    {
      name: 'when uploading csv',
      action: () => (
        createRecipientVerificationList({
          data: 'csv-file'
        })
      )
    }
  ]);
});
