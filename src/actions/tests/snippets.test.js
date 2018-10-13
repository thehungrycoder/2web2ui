import { snapshotActionCases } from 'src/__testHelpers__/snapshotActionHelpers';
import {
  createSnippet
} from '../snippets';

jest.mock('src/actions/helpers/sparkpostApiRequest');

describe('Snippet Actions', () => {
  snapshotActionCases('.createSnippet', [
    {
      name: 'when assigned to master account',
      action: () => createSnippet({ id: 'test-snippet', name: 'Test Snippet' })
    },
    {
      name: 'when shared with all subaccounts',
      action: () => (
        createSnippet({
          id: 'test-snippet',
          name: 'Test Snippet',
          sharedWithSubaccounts: true
        })
      )
    },
    {
      name: 'with a subaccount',
      action: () => (
        createSnippet({
          id: 'test-snippet',
          name: 'Test Snippet',
          subaccount: {
            id: 'example-subaccount'
          }
        })
      )
    }
  ]);
});
