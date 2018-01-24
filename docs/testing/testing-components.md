# Testing Components

Components are the trickiest thing we have to test because they involve testing the relationships between state, props, and rendered output. To do this, we use a variety of techniques that we'll walk through below.

## Techniques for testing components

#### Basic shallow render snapshot

We use [enzyme]() to render React components for testing. In almost all cases, you'll want to use the `shallow` method provided by enzyme, which renders just one "layer" of components without trying to render and mount the entire tree of children as well.

We often test a component's "default state" by giving it the most basic props it accepts and snapshotting the output.

```jsx
it('should render correctly', () => {
  const props = {
    fetchData: jest.fn(),
    submit: jest.fn(),
    visible: true
  };
  const wrapper = shallow(<ComponentOne {...props} />);
  expect(wrapper).toMatchSnapshot();
});
```

#### Change props + re-render

In this set of tests, we've moved the shallow rendering into a `beforeEach` to limit repetition. We can use enzyme's `setProps` method to change the props inside the component after it's been shallow-rendered (this will also trigger `componentWillReceiveProps`, `componentWillUpdate`, and `componentDidUpdate` lifecycle hooks, but not `componentDidMount` again).

When we set this `visible` prop to false, we expect a totally different render, so we snapshot the output there as well.

```jsx
// ComponentOne.js
render() {
  if (!this.props.visible) {
    return null;
  }

  return (
    <div>
      <button id='change-message' onClick={this.handleClick}>Change the message</button>
      <h2>{this.state.message}</h2>
      <ComponentTwo onSubmit={this.handleSubmit} />
    </div>
  );
}

// ComponentOne.test.js
let props;
let wrapper;

beforeEach(() => {
  props = {
    fetchData: jest.fn(),
    submit: jest.fn(),
    visible: true
  };
  wrapper = shallow(<ComponentOne {...props} />);
});

// basic render snapshot
it('should render correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

// change props + re-render snapshot
it('should render when not visible', () => {
  wrapper.setProps({ visible: false });
  expect(wrapper).toMatchSnapshot();
});
```

#### Assert mocks were called during `componentDidMount`

The `cDM` lifecycle hook is called during shallow render, so you can assert that passed in mocks were called during the "mount" phase.

```jsx
// in ComponentOne.js
componentDidMount() {
  this.props.fetchData();
}

// in ComponentOne.test.js
it('should fetch data on mount', () => {
  expect(props.fetchData).toHaveBeenCalledTimes(1);
});
```

#### Testing `componentWillReceiveProps` and other prop/state syncing

When you sync props to local state, it's often sufficient to just check that prop changes result in the appropriate state changes. If those state changes drastically affect the rendered output, you can also snapshot the wrapper.

```jsx
// ComponentOne.js
componentWillReceiveProps({ submitted }) {
  if (typeof submitted === 'boolean') {
    this.setState({ submitted });
  }
}

// ComponentOne.test.js
it('should update state if submitted prop changes and is boolean', () => {
  expect(wrapper.state('submitted')).toEqual(false);

  // no change on other prop changes
  wrapper.setProps({ random: 123, cool: 'story' });
  expect(wrapper.state('submitted')).toEqual(false);

  // no change if value isn't boolean
  wrapper.setProps({ submitted: 'ok' });
  expect(wrapper.state('submitted')).toEqual(false);

  // change
  wrapper.setProps({ submitted: true });
  expect(wrapper.state('submitted')).toEqual(true);

  // change
  wrapper.setProps({ submitted: false });
  expect(wrapper.state('submitted')).toEqual(false);
});
```

#### Simulating events

[Enzyme](http://airbnb.io/enzyme/docs/api/) lets us "simulate" an event, which means it will call the method assigned to any `onEvent` prop when you call `wrapper.simulate('event')`. It will also use your second argument to `simulate` as the mock event passed to the listener.

To simulate an event, you have to first get a reference to the child component where the listener is attached. There are a few ways to do this.

##### Find an element by ID

```jsx
// ComponentOne.js
handleClick = (e) => {
  e.preventDefault();
  this.setState({ message: e.target.value });
}

// in render()
<button id='change-message' onClick={this.handleClick}>Change the message</button>

// ComponentOne.test.js
it('should change the message on click', () => {
  const button = wrapper.find('#change-message');
  const e = {
    preventDefault: jest.fn(),
    target: { value: 'A very new message' }
  };

  button.simulate('click', e);

  expect(wrapper.state('message')).toEqual('A very new message');
  expect(e.preventDefault).toHaveBeenCalledTimes(1);
  expect(wrapper).toMatchSnapshot();
});
```

##### Find an element by Component reference

```jsx
// ComponentOne.js
handleSubmit = (values) => {
  this.setState({ submitted: true });
  this.props.submit(values);
}

// in render()
<ComponentTwo onSubmit={this.handleSubmit} />

// ComponentOne.test.js
it('should set the submitted flag', () => {
  const c2 = wrapper.find(ComponentTwo);

  c2.simulate('submit');

  expect(wrapper.state('submitted')).toEqual(true);
});
```

For more on all the ways to `find` elements in components, see [the enzyme docs](http://airbnb.io/enzyme/docs/api/ShallowWrapper/find.html#findselector--shallowwrapper).

#### Testing class and instance methods directly

Simulating an event isn't always the best way to test a component method. Someimes, for instance, a method is given to a child event that will be called with custom values that aren't just a DOM event. 

```jsx
<ComponentTwo onSubmit={this.handleSubmit} />
```

In this case, `ComponentTwo` will call our `onSubmit` function with a hash of values, so we'll call `this.handleSubmit` directly with some mock values to see if it works as expected. To get at methods on the component's class instance, we call `wrapper.instance()`.

```jsx
it('should submit values', () => {
  const instance = wrapper.instance();
  const values = {};

  instance.handleSubmit(values);

  expect(props.submit).toHaveBeenCalledWith(values);
}); 
```


## Real examples

[Component test examples](./examples/tests/ComponentOne.test.js)

```npm run test-examples -- -p Component```
