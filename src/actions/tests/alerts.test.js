import { createMockStore } from 'src/__testHelpers__/mockStore';
import * as alerts from '../alerts';

jest.mock('../helpers/sparkpostApiRequest', () => jest.fn((a) => a));

describe('Action Creator: Alerts', () => {
  let mockStore;

  beforeEach(() => {
    mockStore = createMockStore({});
  });

  it('should dispatch a list action', () => {
    mockStore.dispatch(alerts.listAlerts());
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('should dispatch a create action', () => {
    mockStore.dispatch(alerts.createAlert({ data: 'data' }));
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('should dispatch an update action', () => {
    mockStore.dispatch(alerts.updateAlert({ id: 'alert-id', data: 'data' }));
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('should dispatch a delete action', () => {
    mockStore.dispatch(alerts.deleteAlert({ id: 'alert-id' }));
    expect(mockStore.getActions()).toMatchSnapshot();
  });
});
