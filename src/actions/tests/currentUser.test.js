import { snapshotActionCases } from 'src/__testHelpers__/snapshotActionHelpers';
import * as actions from '../currentUser';

jest.mock('src/actions/helpers/sparkpostApiRequest', () => jest.fn((a) => a));

snapshotActionCases('Action: Current User', {
  get: {
    action: actions.get,
    state: {
      auth: {
        username: 'bkemper'
      }
    }
  },
  'getGrantsFromCookie without grants': {
    action: () => actions.getGrantsFromCookie({})
  },
  'getGrantsFromCookie with grants': {
    action: () => actions.getGrantsFromCookie({ grants: ['test/grant']})
  },
  'updateUserUIOptions with updates': {
    action: () => actions.updateUserUIOptions({ example: 'test' }),
    state: {
      currentUser: {
        username: 'bkemper'
      }
    }
  }
});
