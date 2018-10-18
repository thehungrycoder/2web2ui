import { snapshotActionCases } from 'src/__testHelpers__/snapshotActionHelpers';
import {
  createSnippet,
  getSnippets
} from '../snippets';

jest.mock('src/actions/helpers/sparkpostApiRequest');

describe('Snippet Actions', () => {
  snapshotActionCases('.createSnippet', [
    {
      name: 'when assigned to master account',
      action: () => (
        createSnippet({
          id: 'test-snippet',
          name: 'Test Snippet',
          text: 'Testing...'
        })
      )
    },
    {
      name: 'when shared with all subaccounts',
      action: () => (
        createSnippet({
          id: 'test-snippet',
          name: 'Test Snippet',
          sharedWithSubaccounts: true,
          text: 'Testing...'
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
          },
          text: 'Testing...'
        })
      )
    },
    {
      name: 'with html and text content',
      action: () => (
        createSnippet({
          html: '<p>Testing...</p>',
          id: 'test-snippet',
          name: 'Test Snippet',
          text: 'Testing...'
        })
      )
    }
  ]);

  snapshotActionCases('.getSnippets', [
    {
      name: 'when assigned to master account',
      action: getSnippets
    }
  ]);
});
