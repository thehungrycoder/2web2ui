# Testing Action Creators

Action creators that perform any kind of logic or complicated dispatching should be unit tested and in some cases snapshot tested.

**Note: If your action creation logic has become too complicated, you can always move some of the logic out to a helper where it will be unit tested, leaving your action easier to test.**

The following are some common action creator test patterns.

* [Snapshot basic JSON](#snapshot-testing-basic-json)
* [Using the mock store](#using-the-mock-store-to-test-dispatches)
* [Manual mocks and async actions](#manual-mocks-and-async-actions)

## Snapshot testing basic JSON

This method works well if the action creator returns a standard action, i.e. a JSON object. Note: if there is a case that only returns null, or an empty object/array or other primitive, it's better to assert against that directly instead of snapshotting it.

#### Working examples

[Basic Action Creator Tests](./examples/tests/action-creators-basic.test.js)

```npm run test-examples -- -p action-creators-basic```

#### Things to remember

* Make sure you test a sufficient number of cases to cover the action ([check the coverage report](./coverage.md) if you need help seeing if you've covered it all, but also look through to see if you've missed any logic forks).
* If it's easy to assert against a real value, it's often clearer to do that than to match against a snapshot, so use your judgment. For example:

```js
it('should return a basic action', () => {
  expect(basicActionCreator({ name: 'Jo' })).toMatchSnapshot();
});

it('should return an empty object if no name is given', () => {
  // assert against empty object for clarity, rather than matching snapshot
  expect(basicActionCreator()).toEqual({});
});
```

## Using the mock store to test dispatches

When there are several actions chained together in a specific order, using our mock store can make it easy to test what actions were dispatched. We use a library called `redux-mock-store` to handle this for us in some cases, and we've wired it up to all of our Redux middleware so it's easy to use.

#### Working examples

[Thunk-powered Action Creators](./examples/tests/action-creators-thunk.test.js)

```npm run test-examples -- -p action-creators-thunk```

#### Things to remember

* You'll need to import the mock store helpers.

```js
import { mockStore, createMockStore } from 'src/__testHelpers__';
```

* Dispatch your action creator (thunk or otherwise) directly as you would in the code, using `mockStore.dispatch()`, and it will keep track of all of the actions that were dispatched along the way for you.

```js
it('should dispatch correctly', () => {
  mockStore.dispatch(withThunk());

  // getActions returns an array of all actions dispatched, perfect for snapshotting
  expect(mockStore.getActions()).toMatchSnapshot();
});
```

* If you need to mock out some state, you'll have to use the `createMockStore` helper.

```js
it('should use mock state', () => {

  // We have to use createMockStore if we need to pre-load mocked state
  const mockStore = createMockStore({
    name: 'Bob'
  });

  // dependsOnState internally calls getState() and uses the name key
  mockStore.dispatch(dependsOnState());
  expect(mockStore.getActions()).toMatchSnapshot();
});
```

## Manual mocks and async actions

Sometimes the internals of an action creator are too complicated for the mock store to work out of the box. It's actually pretty easy to mock dispatch (and getState, if necessary) ourselves, so for complex situations, we do that.

One example of complex action scenarios is the async action, which happens to be the most frequently used action creator scenario in our app. The following examples show both async and manual mocks together, although either scenario could happen on its own, as well.

#### Working examples

[Manually-mocked Async Action Creators](./examples/tests/action-creators-manual-mock-async.test.js)

```npm run test-examples -- -p action-creators-manual-mock-async```

#### Things to remember

* See [our docs on mocking with Jest](./mocking.md) for more info on mocking in general.

* A thunk is just a function that is meant to be called with `dispatch` and `getState`, so it's easy to mock.

```js
const mockState = {
  a: 1,
  b: 2
};
const dispatchMock = jest.fn();
const getStateMock = jest.fn(() => mockState);
const thunk = callMyActionCreator();

thunk(dispatchMock, getStateMock);

// assert!
```

* Jest stubs have an array of all of their calls on them found at `.mock.calls`, which is also perfect for snapshotting.

```js
thunk(dispatchMock);
expect(dispatchMock.mock.calls).toMatchSnapshot();
```

* For async actions, you'll need to make sure the mocks return promises in the right places.

```js
it('should dispatch 2 async calls', async () => {
  // here we create our own dispatch mock which always returns a promise
  // this works because all of the dispatches are async in this flow
  const dispatchMock = jest.fn(() => Promise.resolve());
  
  const thunk = asyncMock();

  // make sure you remember to wait for async to finish one way or another
  await thunk(dispatchMock);

  expect(dispatchMock).toHaveBeenCalledTimes(2);
  expect(dispatchMock.mock.calls).toMatchSnapshot();
});
```
Snapshot produced (2 async calls in sequence):
```
exports[`Manually mocked async action creators should dispatch 2 async calls 1`] = `
Array [
  Array [
    Object {
      "method": "GET",
      "url": "/account",
    },
  ],
  Array [
    Object {
      "method": "PUT",
      "url": "/other",
    },
  ],
]
`;
```

* If your chained actions depend on the results given back to them from previous calls, you'll have to get fancy with your mocks.

```js
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
Snapshot produced (uses account ID 5 in url, includes updated: true object in payload):
```
exports[`Manually mocked async action creators should dispatch multiple dependent calls 1`] = `
Array [
  Array [
    Object {
      "method": "GET",
      "url": "/account",
    },
  ],
  Array [
    Object {
      "body": Object {
        "name": "Bobbi",
      },
      "method": "PUT",
      "url": "/account/5",
    },
  ],
  Array [
    Object {
      "payload": Object {
        "updated": true,
      },
      "type": "UPDATE_ACCOUNT_SUCCESS",
    },
  ],
]
`;
```
