import { snapshotActionCases } from 'src/__testHelpers__/snapshotActionHelpers';
import {
  createSnippet
} from '../snippets';

jest.mock('src/actions/helpers/sparkpostApiRequest');

describe('Snippet Actions', () => {
  snapshotActionCases('.createSnippet', [
    {
      name: 'with id and name',
      action: () => createSnippet({ id: 'test-snippet', name: 'Test Snippet' })
    }
  ]);
});
