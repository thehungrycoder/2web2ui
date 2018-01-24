# Testing Selectors

Selectors are functions that receive the full redux state (and optionally local props as a second arg) and return "selected" values from those inputs. Because of this, they are easy to test and should be fully unit-tested. 

In fact, if at any point you find yourself adding logic to a `mapStateToProps` function while connecting a component to Redux, you should move that logic to a selector where it can be unit tested. (As a rule, we don't test anything about the `connect` process, including `mapStateToProps`).

#### Working examples

[Selector test examples](./examples/tests/selectors.test.js)

```npm run test-examples -- -p selectors```

#### Things to remember

* Selectors should be unit tested
  * See the section on [mocking with Jest](./mocking.md) for more on mocking in general
  * For more on unit testing basics, see our [section on unit testing](./types.md#unit-testing)
* Though we use the [reselect](https://github.com/reactjs/reselect) library to compose and memoize our selectors, we don't need to test that the memoization works.
* Snapshot assertions work great in selector unit tests since they are always returning JSON.

#### Example

```js
it('should select a summary', () => {
  const state = {
    users: [1, 2, 3],
    accounts: ['a', 'b', 'c', 'd', 'e'],
    bills: [
      { total: 114.50 },
      { total: 15.00 },
      { total: 219.85 }
    ]
  };
  const selected = selectSummary(state);
  expect(selected).toMatchSnapshot();
});
```

Produces snapshot:
```
// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`Selectors should select a summary 1`] = `
Object {
  "nAccounts": 5,
  "nUsers": 3,
  "totalBills": 349.35,
}
`;
```
