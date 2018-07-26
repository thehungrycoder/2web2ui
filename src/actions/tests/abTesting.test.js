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

  it('should dispatch a create action', () => {
    mockStore.dispatch(abTesting.createAbTest({ id: 'ab-test-id' }));
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('should dispatch a create draft action', () => {
    mockStore.dispatch(abTesting.createAbTestDraft({ id: 'ab-test-id' }));
    expect(mockStore.getActions()).toMatchSnapshot();
  });
});
