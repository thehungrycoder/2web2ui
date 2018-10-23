import { snapshotActionCases } from 'src/__testHelpers__/snapshotActionHelpers';
import {
  listRecipientLists,
  createRecipientList,
  updateRecipientList,
  deleteRecipientList,
  getRecipientList
} from '../recipientLists';

jest.mock('src/actions/helpers/sparkpostApiRequest');

describe('Recipient List Actions', () => {
  snapshotActionCases('.createRecipientList', [
    {
      name: 'when uploading csv',
      action: () => (
        createRecipientList({
          data: 'csv-file'
        })
      )
    }
  ]);

  snapshotActionCases('.listRecipientLists', [
    {
      name: 'when showErrorAlert is on',
      action: () => (
        listRecipientLists({
          showErrorAlert: true
        })
      )
    }
  ]);

  snapshotActionCases('.updateRecipientList', [
    {
      name: 'when passing and id',
      action: () => (
        updateRecipientList({
          id: 'update-me'
        })
      )
    }
  ]);

  snapshotActionCases('.deleteRecipientList', [
    {
      name: 'when passing and id',
      action: () => (
        deleteRecipientList({
          id: 'delete-me'
        })
      )
    }
  ]);

  snapshotActionCases('.getRecipientList', [
    {
      name: 'when passing and id',
      action: () => (
        getRecipientList({
          id: 'get-me'
        })
      )
    }
  ]);
});
