import { createMockStore } from '../../__testHelpers__/mockStore';
import * as Actions from '../globalAlert';
import { isSuspendedForBilling } from 'src/helpers/conditions/account';

jest.mock('src/helpers/conditions/account');

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

  describe('suspension alerts', () => {

    it('should dispatch the default suspension alert', () => {
      isSuspendedForBilling.mockImplementation(() => false);
      store.dispatch(Actions.showSuspensionAlert());
      expect(store.getActions()).toMatchSnapshot();
    });

    it('should dispatch a suspended for billing suspension alert', () => {
      isSuspendedForBilling.mockImplementation(() => true);
      store.dispatch(Actions.showSuspensionAlert());
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
