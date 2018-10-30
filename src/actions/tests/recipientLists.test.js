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
      name: 'when list is not loaded',
      action: () => (
        listRecipientLists()
      ),
      state: {
        recipientLists: {
          listLoaded: false
        }
      }
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
