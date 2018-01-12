# Test Types

For this project, we usually work with what we refer to as unit tests, functional component tests, and snapshot tests.

### Unit Testing
   
When we just need to test logic, we write simple unit tests. A good unit test should provide a set of inputs and given those inputs, assert expectations about the outputs. At times they may also test side-effects such as "was this method called", etc.

While most useful for testing simple JavaScript functions such as helpers and selectors, this technique is also used to test actions, some component class methods, etc.

```js
it('should add numbers', () => {
  const result = add(2, 3);
  expect(result).toEqual(5);
});
```

### Functional Component Testing

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

### Snapshot Testing

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

Once we got more comfortable with snapshot testing, we realized it wasn't only good for component rendering, but for any serializable string we want to watch for changes. Some examples include:

* **Action creators:** if an action returns JSON, you can make sure the JSON produced is always the same with a snapshot test
* **Action creator chains and thunks:** you can mock the dispatch method and assert that a chain of calls happened in the same way, in the same order
* **Any mocks that makes successive calls** can have those calls serialized and snapshotted, so instead of asserting on `myMock.calls.[0].args[0]` you can give `myMock.calls` to the snapshot assertion directly.
