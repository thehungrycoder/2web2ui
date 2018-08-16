import { createMockStore } from 'src/__testHelpers__/mockStore';
import * as abTesting from '../abTesting';

jest.mock('../helpers/sparkpostApiRequest', () => jest.fn((a) => a));

describe('Action Creator: A/B Testing', () => {
  let mockStore;

  beforeEach(() => {
    mockStore = createMockStore({});
  });

  it('should dispatch a list action', () => {
    mockStore.dispatch(abTesting.listAbTests());
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('should dispatch a create draft action', () => {
    mockStore.dispatch(abTesting.createAbTestDraft({ id: 'ab-test-id' }));
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('should dispatch a get test action without subaccount', () => {
    mockStore.dispatch(abTesting.getAbTest({ id: 'test_one', version: 2 }));
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('should dispatch a get test action with subaccount', () => {
    mockStore.dispatch(abTesting.getAbTest({ id: 'test_one', version: 2, subaccountId: 101 }));
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('should dispatch a delete test action', () => {
    mockStore.dispatch(abTesting.deleteAbTest({ id: 'test_one', subaccountId: 101 }));
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('should dispatch a cancel test action', () => {
    mockStore.dispatch(abTesting.cancelAbTest({ id: 'test_one', subaccountId: 101 }));
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('should dispatch a schedule test action', () => {
    mockStore.dispatch(abTesting.scheduleAbTest({ data: 'data', id: 'test_one', subaccountId: 101 }));
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('should dispatch an update test action', () => {
    mockStore.dispatch(abTesting.updateAbTest({ data: 'data', id: 'test_one', subaccountId: 101 }));
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('should dispatch a get latest test version action without subaccount', () => {
    mockStore.dispatch(abTesting.getLatestAbTest({ id: 'test_one' }));
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('should dispatch a get latest test version action with subaccount', () => {
    mockStore.dispatch(abTesting.getLatestAbTest({ id: 'test_one', subaccountId: 101 }));
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('should dispatch an update draft action without subaccount', () => {
    mockStore.dispatch(abTesting.updateDraft({ data: 'data', id: 'test_one' }));
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('should dispatch an update draft action with subaccount', () => {
    mockStore.dispatch(abTesting.updateDraft({ data: 'data', id: 'test_one', subaccountId: 101 }));
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('should dispatch an update scheduled action', () => {
    mockStore.dispatch(abTesting.updateAbTest({ data: 'data', id: 'test_one', subaccountId: 101 }));
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('should dispatch an reschedule action', () => {
    mockStore.dispatch(abTesting.rescheduleAbTest({ data: 'data', id: 'test_one', subaccountId: 101 }));
    expect(mockStore.getActions()).toMatchSnapshot();
  });
});
