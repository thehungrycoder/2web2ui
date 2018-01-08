# Jest

Zero configuration testing platform with built-in [mocking library](http://facebook.github.io/jest/docs/en/mock-functions.html), [snapshot testing](http://facebook.github.io/jest/docs/en/snapshot-testing.html#content), and more.  For more information, refer to the [Jest website](http://facebook.github.io/jest).

## Argument Matchers

_a.k.a. asymmetric matchers_

Jest provides several argument matchers (e.g.  [expect.objectContaining](https://facebook.github.io/jest/docs/en/expect.html#expectobjectcontainingobject), [expect.arrayContaining](https://facebook.github.io/jest/docs/en/expect.html#expectarraycontainingarray), etc.).  They can be used to loosely match any expected value.  They should only be used with mock function matchers (e.g. [.toHaveBeenCalledWith](https://facebook.github.io/jest/docs/en/expect.html#tohavebeencalledwitharg1-arg2-) or [.toHaveBeenLastCalledWith](https://facebook.github.io/jest/docs/en/expect.html#tohavebeenlastcalledwitharg1-arg2-)) to confirm a mock has been called with the expected arguments.

```js
it('calls callback with an error', () => {
  const callback = jest.fn();
  subject('invalid', callback);
  expect(callback).toHaveBeenCalledWith(expect.objectContaining({ status: 'error' }));
});
```

## Enzyme

A test library for testing React components.  Get started with [using Jest with enzyme](http://airbnb.io/enzyme/docs/guides/jest.html#using-jest-with-enzyme) and [DOM testing](http://facebook.github.io/jest/docs/en/tutorial-react.html#dom-testing) to understand how Jest and Enzyme work together.  For more information, refer to the [Enzyme website](http://airbnb.io/enzyme).

#### Manually Call Component Methods

You can manually call a component function with an [`instance`](http://airbnb.io/enzyme/docs/api/ReactWrapper/instance.html) of the component.  This is not a preferred test pattern.  The preferred way to test event handlers and other methods is to [`simulate`](http://airbnb.io/enzyme/docs/api/ShallowWrapper/simulate.html) user events.  If your component function calls `setState`, you will need to use [`update`](http://airbnb.io/enzyme/docs/api/ShallowWrapper/update.html) to force a re-render.

```js
class ExampleComponent extends Component {
  onLoad() {
    this.setState({ loading: false });
  }

  render() {
    // ...
  }
}
```

```js
it('render when loaded', () => {
  const wrapper = shallow(<ExampleComponent />);

  wrapper.instance().onLoad();
  wrapper.update();

  expect(wrapper).toMatchSnapshot();
});
```

## Jest In Case

This is a handy utility for combining similar tests.  Visit the [project website](http://thejameskyle.com/jest-in-case.html) for the full explanation.

Our only recommendation is to define your test cases as an Object, so your test case description doesn't get overlooked or forgotten.

```js
import cases from 'jest-in-case';

const TEST_CASES = {
  'case #1': {
    // args
  },
  'case #2': {
    // args
  },
  // ...
};

cases('description', (args) => {
  // assertion
}, TEST_CASES);
```
