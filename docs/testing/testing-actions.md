# Testing Action Creators

Action creators that perform any kind of logic or complicated dispatching should be unit tested and in some cases snapshot tested.

The following are some common action creator test patterns.

## Snapshot testing regular JSON

This method works well if the action creator returns a standard action, i.e. a JSON object. Note: if there is a case that only returns null, or an empty object/array or other primitive, it's better to assert against that directly instead of snapshotting it.

Full working examples:  
[Basic Action Creator Tests](./examples/tests/action-creators-basic.test.js)

Run these tests:  
`npm run test-examples -- -p action-creators-basic`

The general idea:

```js
it('should return a basic action', () => {
  expect(basicActionCreator({ name: 'Jo' })).toMatchSnapshot();
});

it('should return an empty object if no name is given', () => {
  // when it's easy to assert the real value, it's often clearer
  // to do that instead of matching against a snapshot
  expect(basicActionCreator()).toEqual({});
});

it('should return an empty object if no name is given', () => {
  expect(basicActionCreator()).toEqual({});
});
```

## Using the mock store to test dispatches

When there are several actions chained together in a specific order, using our mock store can make it easy to test what actions were dispatched.

Full working examples:  
[Thunk-powered Action Creators](./examples/tests/action-creators-thunk.test.js)

Run these tests:  
`npm run test-examples -- -p action-creators-thunk`

```js
import { mockStore, createMockStore } from 'src/__testHelpers__';

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
```

## Manual mocks and async actions

Sometimes the internals of an action creator are too complicated for the mock store to work out of the box. It's actually pretty easy to mock dispatch (and getState, if necessary), so for complex situations, we do that.

One example of complex action scenarios is the async action, which is one of the most frequently used in our case. These examples show both async and manual mocks, although either scenario could happen on its own, as well.

Full working examples:  
[Manually-mocked Async Action Creators](./examples/tests/action-creators-manual-mock-async.test.js)

Run these tests:  
`npm run test-examples -- -p action-creators-manual-mock-async`

```js
import * as mocks from '../_example-mocks';

jest.mock('../_example-mocks');

beforeEach(() => {
  mocks.apiRequest = jest.fn((a) => a);
});

it('should dispatch 2 async calls', async () => {
  // here we create our own dispatch mock which always returns a promise
  // this works because all of the dispatches are async in this flow
  const dispatchMock = jest.fn(() => Promise.resolve());
  
  const thunk = asyncMock();
  await thunk(dispatchMock);

  expect(dispatchMock).toHaveBeenCalledTimes(2);

  // jest.fn mocks store their calls here, which are easy to snapshot
  expect(dispatchMock.mock.calls).toMatchSnapshot();
});

it('should dispatch multiple dependent calls', async () => {
  const dispatchMock = jest.fn(() => Promise.resolve()) // default return for dispatch mock

    // first time dispatch is called, will do this
    .mockImplementationOnce(() => Promise.resolve({ id: 5 }))

    // second time dispatch is called, will do this
    .mockImplementationOnce(() => Promise.resolve({ updated: true }));

  const thunk = asyncDependent({ name: 'Bobbi' });
  await thunk(dispatchMock);

  expect(dispatchMock).toHaveBeenCalledTimes(3);
  expect(dispatchMock.mock.calls).toMatchSnapshot();
});
```
