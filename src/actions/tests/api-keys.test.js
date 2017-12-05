import { createMockStore } from '../../__testHelpers__/mockStore';
import * as Actions from '../api-keys';

jest.mock('../helpers/sparkpostApiRequest', () => jest.fn((action) => action));

describe('listApiKeys()', () => {
  it('dispatches the correct action', () => {
    const store = createMockStore({ apiKeys: { keys: []}});

    store.dispatch(Actions.listApiKeys());
    expect(store.getActions()).toMatchSnapshot();
  });
});

describe('listGrants()', () => {
  it('dispatches the correct action', () => {
    const store = createMockStore({ apiKeys: { grants: []}});

    store.dispatch(Actions.listGrants());
    expect(store.getActions()).toMatchSnapshot();
  });
});
