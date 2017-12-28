# Jest

Zero configuration testing platform with built-in [mocking library](http://facebook.github.io/jest/docs/en/mock-functions.html), [snapshot testing](http://facebook.github.io/jest/docs/en/snapshot-testing.html#content), and more.  For more infomation, refer to the [Jest website](http://facebook.github.io/jest).

## Enzyme

A test library for testing React components.  Get started with [using Jest with enzyme](http://airbnb.io/enzyme/docs/guides/jest.html#using-jest-with-enzyme) and [DOM testing](http://facebook.github.io/jest/docs/en/tutorial-react.html#dom-testing) to understand how Jest and Enzyme work together.  For more information, refer to the [Enzyme website](http://airbnb.io/enzyme).

#### Manually Call Component Methods

You can manually call a component function with an [`instance`](http://airbnb.io/enzyme/docs/api/ReactWrapper/instance.html) of the component.  This is not a preferred test pattern.  The preferred way to test event handlers and other methods is to [`simulate`](http://airbnb.io/enzyme/docs/api/ShallowWrapper/simulate.html) user events.  If your component function calls `setState`, you will need to use [`update`](http://airbnb.io/enzyme/docs/api/ShallowWrapper/update.html) to force a re-render.

```
class ExampleComponent extends Component {
  onLoad() {
    this.setState({ loading: false });
  }

  render() {
    // ...
  }
}
```

```
test('render when loaded', () => {
  const wrapper = shallow(<ExampleComponent />);

  wrapper.instance().onLoad();
  wrapper.update();

  expect(wrapper).toMatchSnapshot();
});
```
