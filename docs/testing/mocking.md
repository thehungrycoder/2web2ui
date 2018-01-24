# Mocking with Jest

Jest mocking is powerful but a bit different than our usual `sinon` and `proxyquire` flows. Check the Jest mocking docs for more information, but this is a short overview of things we've learned.

## jest.fn()

This is how you make the equivalent of a sinon "stub" in jest. It creates a dummy mock function that returns undefined by default and is wrapped as a spy for you so you can assert that it's been called, etc.

```jsx
const fetchData = jest.fn();
const wrapper = shallow(<MyComponent fetchData={fetchData} />);
expect(fetchData).toHaveBeenCalled();
```

### Controlling what a stub returns

The easiest way is to pass a function to `jest.fn`:
```js
const getRandomNumber = jest.fn(() => 5);
expect(add1(getRandomNumber)).toEqual(6);
expect(getRandomNumber).toHaveBeenCalledTimes(1);
```

You can also access the arguments passed to a stub this way:
```js
const add = jest.fn((a, b) => a + b);
expect(test(1, 4, add)).toEqual(5);
expect(add).toHaveBeenCalledWith(1, 4);
```

Jest also gives you [`mockReturnValue`](https://facebook.github.io/jest/docs/en/mock-functions.html#mock-return-values) and [`mockImplementation`](https://facebook.github.io/jest/docs/en/mock-functions.html#mock-implementations) functions to control what these mock functions return.

### Controlling what a stub returns, differently per call

To control what a mock returns on subsequent calls, both the `mockReturnValue` and `mockImplementation` methods have `*Once` companion methods that set up the return for a single call each.

```js
const myMock = jest.fn()
  .mockImplementation(() => 'default value')
  .mockImplementationOnce(() => 1)
  .mockImplementationOnce(() => 2);

myMock(); // 1
myMock(); // 2
myMock(); // "default value"
```

See more: [Mock functions docs](https://facebook.github.io/jest/docs/en/mock-function-api.html)

## jest.spyOn()

Spies don't affect or change how a function is actually called, but let you keep track of how many times a function is called and with what arguments.

```js
jest.spyOn(window, 'addEventListener');
setupListeners();
expect(window.addEventListener).toHaveBeenCalledTimes(3);
```

See more: [`jest.spyOn` docs](https://facebook.github.io/jest/docs/en/jest-object.html#jestspyonobject-methodname)

## Stub and spy expectations

See [the jest expect docs](https://facebook.github.io/jest/docs/en/expect.html) to see the full list of matchers you can use to assert how a stub or spy was called.

You can do normal `chai` style expectations:

```js
expect(myMock).toHaveBeenCalled();
expect(myMock).toHaveBeenCalledTimes(3);
expect(myMock).toHaveBeenCalledWith('a', [1, 2, 3]);
expect(myFunc()).toEqual(someValue);
expect(myFunc()).toBe(someExactReference);
```

To negate any expectation you can use `.not`:
```js
expect(myMock).not.toHaveBeenCalled();
expect(myFunc()).not.toEqual('nope');
```

For promises:
```js
expect(myAsyncFunc()).resolves.toEqual('async result');
expect(myAsyncBlowup()).rejects.toThrow('Error message here');
```

_Note: `rejects` solves the "promise accidentally succeeded" problem, but you can also add `jest.hasAssertions()` to tell Jest that every test in that file needs to have at least one assertion or fail._

When you don't care about one of the arguments a stub was called with:
```js
expect(myMock).toHaveBeenCalledWith(expect.anything(), 5);
expect(myMock).toHaveBeenCalledWith(10, expect.any(Function));
```

See more: [expect matchers](https://facebook.github.io/jest/docs/en/expect.html)

## Using `async` and `await` for async tests

Async/await is a newer JS syntax and makes async tests much less error-prone. Instead of this:

```js
it('should do async things', () => {
  myAsyncThing().then((result) => {
    expect(result).toEqual(10);
    return otherAsyncThing(result);
  }).then((result2) => {
    expect(result2).toEqual(25);
  });
});
```

This test won't work right because I forgot to return `myAsyncThing` so the test runner doesn't know to wait. Instead, we prefer to use async/await like so:

```js
it('should do async things', async () => {
  const result = await myAsyncThing();
  expect(result).toEqual(10);

  const result2 = await otherAsyncThing(result);
  expect(result2).toEqual(25);
});
```

No more worrying about returning the promise, less nesting, overall better experience for async tests.

## jest.mock()

When testing code in file `A.js`, you can mock the imports found in `A.js` by using `jest.mock()`. 

A.js
```js
import b2, { b1 } from './B';

export default function myFunc(prefix) {
  return `${prefix} ${b1()} ${b2()}`;
}
```

B.js
```js
export function b1() {
  return 'b1';
}

export default function b2() {
  return 'b2';
}

```

In our test:
```js
import a from '../A';

jest.mock('../B');

describe('Test mocking', () => {

  it('should let dependencies be mocked', () => {
    expect(a('hi')).toEqual('hi undefined undefined');
  });

});
```

### Things to understand about `jest.mock()`

1. Call `jest.mock` at the top of your file after your imports
1. Use the path to the mocked module relative to where you're calling from in the test file
1. Jest will auto-discover and mock all of the functions in the mocked module, but they will all return undefined by default

### Controlling mock return values

You _can_ pass a 2nd arg to `jest.mock()` to control how the module is mocked, but it's a one-time set up and isn't very useful, in our experience. The best way to control mock return values dynamically is to use the `import * as` hack.

For a default export, it looks like this:
```js
import a from '../A';
import * as mockB from '../B';

jest.mock('../B');

describe('Test mocking', () => {

  it('should control a default export', () => {
    mockB.default = jest.fn(() => 'mocked default');
    expect(a('hi')).toEqual('hi undefined mocked default');
  });

});
```

For a named export, use the name instead of `.default`:
```js
it('should control a named export', () => {
  mockB.b1 = jest.fn(() => 'mocked named');
  expect(a('hi')).toEqual('hi mocked named undefined');
});
```

### Don't let your mocks leak

Leaky mocks cause really big headaches. Consider these two tests run together:
```js
it('should control a default export', () => {
  mockB.default = jest.fn(() => 'mocked default');
  expect(a('hi')).toEqual('hi undefined mocked default');
});

it('should control a named export', () => {
  mockB.b1 = jest.fn(() => 'mocked named');
  expect(a('hi')).toEqual('hi mocked named undefined');
});
```

The second test will fail.
```
  ● Test mocking › should control a named export

    expect(received).toEqual(expected)

    Expected value to equal:
      "hi mocked named undefined"
    Received:
      "hi mocked named mocked default"
```

This is because the default mock set up in the first test has leaked into the second test. Jest gives us a few ways to clear/restore/reset mocks.

**jest.restoreAllMocks** - wipes out mocks, _but only for spies_, which are created with `jest.spyOn` (weird)
**jest.clearAllMocks** - clears call count for all mocks, including the `jest.fn()` stubs

But watch what happens if we use clear for our test problem:
```js
afterEach(() => {
  jest.clearAllMocks();
});
```

We will still get:
```
  ● Test mocking › should control a named export

    expect(received).toEqual(expected)

    Expected value to equal:
      "hi mocked named undefined"
    Received:
      "hi mocked named mocked default"
```

This still fails because "clearAllMocks" only clears out the call count and "mock.instances" values. **To truly clear out our mocks between tests, we should always use `resetAllMocks`**, like so:

```js
afterEach(() => {
  jest.resetAllMocks();
});
```

And now our tests will pass without leakage.
