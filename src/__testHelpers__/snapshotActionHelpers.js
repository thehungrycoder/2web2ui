import { createMockStore } from 'src/__testHelpers__/mockStore';
import cases from 'jest-in-case';

export function snapshotAction({ action, state = {}}) {
  const store = createMockStore(state);
  store.dispatch(action());
  expect(store.getActions()).toMatchSnapshot();
}

// testCases should be an object or array in the style of jest-in-case
// each case should be an object with keys:
// - name: test name
// - action: function that should be dispatched
// - state: optional initial redux state object
export function snapshotActionCases(title, testCases) {
  cases(title, (options) => snapshotAction(options), testCases);
}
