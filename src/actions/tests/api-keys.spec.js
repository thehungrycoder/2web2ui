import { createMockStore } from '../../__testHelpers__/mockStore';
import * as Actions from '../api-keys';

jest.mock('../helpers/sparkpostApiRequest', () => jest.fn((action) => action));

describe('listApiKeys()', () => {
  it('dispatches the correct action when no keys are present', () => {
    const store = createMockStore({ apiKeys: { keys: []}});

    store.dispatch(Actions.listApiKeys());
    expect(store.getActions()).toMatchSnapshot();
  });

  it('does not dispatch when keys are already loaded', () => {
    const store = createMockStore({
      apiKeys: { keysLoaded: true }
    });

    store.dispatch(Actions.listApiKeys());
    expect(store.getActions()).toHaveLength(0);
  });
});

describe('listGrants()', () => {
  it('dispatches the correct action when no grants are present', () => {
    const store = createMockStore({ apiKeys: { grants: []}});

    store.dispatch(Actions.listGrants());
    expect(store.getActions()).toMatchSnapshot();
  });

  it('does not dispatch when grants are already loaded', () => {
    const store = createMockStore({
      apiKeys: { grantsLoaded: true }
    });

    store.dispatch(Actions.listGrants());
    expect(store.getActions()).toHaveLength(0);
  });
});
