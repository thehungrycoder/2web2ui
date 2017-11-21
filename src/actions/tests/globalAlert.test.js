import { createMockStore } from '../../__testHelpers__/mockStore';
import * as Actions from '../globalAlert';

Date.now = jest.fn(() => 1511303984050);

describe('show alert', () => {
  it('should dispatch the correct action', () => {
    const store = createMockStore({ globalAlert: { alerts: []}});
    store.dispatch(Actions.showAlert({ message: 'a message', type: 'success' }));
    expect(store.getActions()).toMatchSnapshot();
  });

  it('should dispatch the correct action without type', () => {
    const store = createMockStore({ globalAlert: { alerts: []}});
    store.dispatch(Actions.showAlert({ message: 'a message' }));
    expect(store.getActions()).toMatchSnapshot();
  });
});

describe('clear alert', () => {
  it('should dispatch the correct action', () => {
    const store = createMockStore();
    store.dispatch(Actions.clear(0));
    expect(store.getActions()).toMatchSnapshot();
  });
});
