import { createMockStore } from '../../__testHelpers__/mockStore';
import * as Actions from '../globalAlert';

describe('Actions: Global alerts', () => {

  let store;

  beforeEach(() => {
    store = createMockStore({ globalAlert: { alerts: []}});
  });

  describe('show alert', () => {
    it('should dispatch the correct action', () => {
      store.dispatch(Actions.showAlert({ message: 'a message', type: 'success' }));
      expect(store.getActions()).toMatchSnapshot();
    });

    it('should dispatch the correct action without type', () => {
      store.dispatch(Actions.showAlert({ message: 'a message' }));
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('clear alert', () => {
    it('should dispatch the correct action', () => {
      const store = createMockStore();
      store.dispatch(Actions.clear('alert_1'));
      expect(store.getActions()).toMatchSnapshot();
    });
  });
});
