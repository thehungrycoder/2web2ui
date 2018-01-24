import { withThunk, dependsOnState } from '../action-creators';
import { mockStore, createMockStore } from 'src/__testHelpers__';

describe('Action creators using thunks', () => {

  it('should dispatch correctly', () => {
    mockStore.dispatch(withThunk());

    // getActions returns an array of all actions dispatched, perfect for snapshotting
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('should use mock state', () => {

    // We have to use createMockStore if we need to pre-load mocked state
    const mockStore = createMockStore({
      name: 'Bob'
    });

    mockStore.dispatch(dependsOnState());
    expect(mockStore.getActions()).toMatchSnapshot();
  });

});
