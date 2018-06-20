# Test Types

For this project, we usually work with what we refer to as [unit tests](#unit-tests), [functional component tests](#functional-component-tests), and [snapshot tests*](#snapshot-tests). We have also recently introduced [integration-tests](#integration-tests).

This document also includes a few words about [end-to-end browser tests](#end-to-end-tests).

_*Snapshot disclaimer: To be perfectly honest (and less perfectly clear), snapshot testing is less of its own testing type and more of a testing tool that can be used within other tests, whenever you have a medium to large sized string you want to track changes in. This is why you'll see snapshot assertions show up alongside unit tests and in functional component tests._

## Unit Testing
   
When we just need to test logic, we write simple unit tests. A good unit test should provide a set of inputs and given those inputs, assert expectations about the outputs. At times they may also test side-effects such as "was this method called", etc.

While most useful for testing simple JavaScript functions such as helpers and selectors, this technique is also used to test actions, some component class methods, etc.

```js
it('should add numbers', () => {
  const result = add(2, 3);
  expect(result).toEqual(5);
});
```

#### Isolation

The biggest rule of unit testing is that you should test functions in as much _isolation_ as possible. This way if a test fails, you know exactly where the problem can be found.

In practice, this usually means you should mock dependencies rather than running them in your test. With some big exceptions (we rarely mock lodash, for instance), you should always mock imported dependency functions in unit tests.

For example, say you have a simple formatting function:

```js
export function formatObject({ id, fname, lname, color }) {
  return {
    id: id.toUpperCase(),
    name: `${fname} ${lname}`,
    color: formatColor(color)
  }
}
```

In this example, `formatColor` is a different helper of ours which takes an HTML color string and produces an object with hex, RGBa, HSLa, etc. versions of the color. Rather than let that function operate on the test data, we would test that function separately. Here, we'd mock it and force it to always return the string 'formatted', which lets us know our mock was properly called.

```js
beforeEach(() => {
  mocks.formatColor = jest.fn(() => 'formatted');
});

it('should format a simple object', () => {
  const simple = {
    id: 'abc',
    fname: 'Jessie',
    lname: 'Soho',
    color: 'DodgerBlue'
  };
  expect(formatObject(simple)).toEqual({
    id: 'ABC',
    name: 'Jessie Soho',
    color: 'formatted'
  });
});
```

#### Private Functions (or any functions in the same file as the one you're testing)

If a function isn't exported from a file (a "private" function) or if it's exported from the same file as your test function is, there's no good way to mock that function with Jest. In that case, you have three options:

1. Let the public function test the other function by proxy. If the function is really private (not exported), this may be the only way to go. 
1. Move the other function to its own file where it can be tested on its own and mocked in this file. This is often a fine solution, although we don't really want to end up with one function per file.
1. Use dependency injection. See next section.

#### Dependency Injection "Trick"

In extreme cases, you need to spy on or mock a function that is in the same file as the function you're testing. Jest doesn't make this easy, so using ES6 default parameters to provide a dependency injection interface is probably the least bad option.

```js
// myfile.js
export function one() {
  return 'a';
}

export function two({ localOne = one }) {
  return `${localOne()} - z`;
}

// myfile.test.js
import { two } from '../myfile';

it('should return the right string', () => {
  const localOne = jest.fn(() => 'x');
  const result = two({ localOne });
  expect(localOne).toHaveBeenCalledTimes(1);
  expect(result).toEqual('x - z');
})
```


## Functional Component Testing

For React components, we use a tool called enzyme to render the component and test its behavior within the React context. This includes:

* Did it mount/unmount etc. correctly?
* Does event logic work correctly? (clicks, submits, etc)

```jsx
import { shallow, mount } from 'enzyme';
import MyComponent from '../MyComponent';
import UpdateButton from '../UpdateButton';

it('should retrieve data on mount', () => {
  const getData = jest.fn();
  const wrapper = mount(<MyComponent getData={getData} />);
  expect(getData).toHaveBeenCalled();
});

it('should call update on click', () => {
  const update = jest.fn();
  const wrapper = shallow(<MyComponent update={update} />);
  expect(wrapper.state('updated')).toEqual(false);
  wrapper.find(UpdateButton).simulate('click');
  expect(update).toHaveBeenCalled();
  expect(wrapper.state('updated')).toEqual(true);
});
```

## Snapshot Testing

Jest, our test runner, gives us an assertion that lets us test against a "snapshotted" string to detect changes, called [snapshot testing](http://facebook.github.io/jest/docs/en/snapshot-testing.html). The most common use-case for this is to test the rendered output (in a simplified form) of a component, so these assertions often show up right next to other assertions inside functional component tests, like so:

```jsx
it('should render correctly', () => {
  const data = [1, 2, 3];
  const wrapper = shallow(<MyBanner title="Test title" data={data} />);
  expect(wrapper).toMatchSnapshot();
});
```

The important thing to point out here is that a snapshot test _always_ succeeds on its first run. The first run creates a `__snapshots__` folder adjacent to wherever the test lives, and then puts a `.snap` file that matches thet test file's name in that folder. Inside that `.snap` file will be a string that looks like this:

```
// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`MyComponent should render correctly 1`] = `
<Banner
  status="info"
  title="Test title"
>
  <ul>
    <li key="1">Item 1</li>
    <li key="2">Item 2</li>
    <li key="3">Item 3</li>
  </ul>
</Banner>
`;
```

Snapshot tests are great for testing basic input/output for components. "If I give this component these props, does it render how I expect?" That way, if something you change later accidentally changes how this component renders in a certain situation, your snapshot assertion will fail with a diff of what changed. **And if you did in fact mean for that change to happen, updating the snapshot file is as easy as typing the letter "u" in the Jest CLI's watch mode.**

#### Snapshot testing other things

Once we got more comfortable with snapshot testing, we realized it wasn't only good for component rendering, but for any serializable string we want to watch for changes. Some examples include:

* **Action creators:** if an action returns JSON, you can make sure the JSON produced is always the same with a snapshot test
* **Action creator chains and thunks:** you can mock the dispatch method and assert that a chain of calls happened in the same way, in the same order
* **Any mocks that makes successive calls** can have those calls serialized and snapshotted, so instead of asserting on `myMock.calls.[0].args[0]` you can give `myMock.calls` to the snapshot assertion directly.

## Integration Tests

We've recently added the ability to write integration tests that test our code within Redux, Redux Form, React Router, etc. and mostly test that form inputs result in the right HTTP calls.

See [our integration testing guide](../../src/__integration__/README.md).

## End to End Tests

We aren't doing any end to end browser testing (e.g. Selenium webdriver, etc) at all right now. This decision was made on purpose, because the cost of setting up and maintaining that kind of test suite as well as the frailty those tests usually contain often make them close to worthless. After fighting with them for more hours than we want to talk about, we turned them off in our previous web UI app and have kept them off here, for now, as well.

For now, we've opted to focus exclusively on the other kinds of tests in this document while at the same time implementing a robust error-logging tool to stay on top of when errors occur. In the future, we plan to revisit end to end testing and build a small, focused suite of end to end tests that cover our critical paths in the most stable way possible, looking at something like Google's `puppeteer` or similar modern end-to-end frameworks.
