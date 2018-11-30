import { snapshotActionCases } from 'src/__testHelpers__/snapshotActionHelpers';
import {
  clearSnippet,
  createSnippet,
  getSnippet,
  getSnippets,
  deleteSnippet,
  updateSnippet
} from '../snippets';

jest.mock('src/actions/helpers/sparkpostApiRequest');

describe('Snippet Actions', () => {
  snapshotActionCases('.clearSnippet', [
    {
      name: 'by default',
      action: clearSnippet
    }
  ]);

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
          subaccountId: 'example-subaccount',
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
    },
    {
      name: 'excluding amp_html',
      action: () => (
        createSnippet({
          html: '<p>Testing...</p>',
          amp_html: '<p>AMP Testing...</p>'
        })
      )
    },
    {
      name: 'with amp_html',
      action: () => (
        createSnippet({
          amp_html: '<p>AMP Testing...</p>',
          isAmpLive: true
        })
      )
    }
  ]);

  snapshotActionCases('.getSnippet', [
    {
      name: 'with id',
      action: () => getSnippet({ id: 123 })
    },
    {
      name: 'with id and subaccount',
      action: () => getSnippet({ id: 123, subaccountId: 456 })
    }
  ]);

  snapshotActionCases('.getSnippets', [
    {
      name: 'when assigned to master account',
      action: getSnippets
    }
  ]);

  snapshotActionCases('.deleteSnippet', [
    {
      name: 'when assigned to master account',
      action: () => (
        deleteSnippet({
          id: 'test-snippet'
        })
      )
    },
    {
      name: 'when assigned to subaccount',
      action: () => (
        deleteSnippet({
          id: 'test-snippet',
          subaccountId: 101
        })
      )
    }
  ]);

  snapshotActionCases('.updateSnippet', [
    {
      name: 'when assigned to master account',
      action: () => (
        updateSnippet({
          id: 'test-snippet',
          name: 'Test Snippet',
          text: 'Testing...'
        })
      )
    },
    {
      name: 'when shared with all subaccounts',
      action: () => (
        updateSnippet({
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
        updateSnippet({
          id: 'test-snippet',
          name: 'Test Snippet',
          subaccountId: 'example-subaccount',
          text: 'Testing...'
        })
      )
    },
    {
      name: 'with html and text content',
      action: () => (
        updateSnippet({
          html: '<p>Testing...</p>',
          id: 'test-snippet',
          name: 'Test Snippet',
          text: 'Testing...'
        })
      )
    },
    {
      name: 'excluding amp_html',
      action: () => (
        updateSnippet({
          html: '<p>Testing...</p>',
          amp_html: '<p>AMP Testing...</p>'
        })
      )
    },
    {
      name: 'with amp_html',
      action: () => (
        updateSnippet({
          amp_html: '<p>AMP Testing...</p>',
          isAmpLive: true
        })
      )
    }
  ]);
});
