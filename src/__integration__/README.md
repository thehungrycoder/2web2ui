# Integration Testing

This folder contains a set of tests meant to test the integration between various components inside the React app. The main case here is testing that values added to a set of form inputs, when that form is submitted, will produce the same set of HTTP calls. This guarantees that changes to the internals of the forms and various form components, actions, etc. have not broken the flow of the form -> API calls, via snapshot tests.

Note: These tests run with all of our React integrations in-tact, such as Redux, Redux Form, React Router, etc. Axios is always fully mocked in our tests, so no HTTP calls will be made via the axios library. Other HTTP calls that may be made (e.g. analytics etc) need to be manually mocked to prevent leaking HTTP calls during tests.

## Mock responses

As axios is fully mocked by default during tests, if you need certain calls to load certain test data, you can set that up by adding data to the appropriate file inside the http-responses folder.

**Responses that aren't mocked will return the following:**

```
{
  data: {
    success: true,
    results: []
  }
}
```

#### Mock response example

A GET call to `/account/something` can be mocked by adding a file in the following location: `http-responses/account/something/get.js`.

* The file name should be the lowercased method, so get.js, put.js, etc.
* The file should have one default export which should be a function that returns the response object
* You can respond to request headers, query params, subsequent calls, etc. inside of the response function, which is given the entire request object (method, url, params, etc)

Remember: these responses are used for all tests and can't currently be changed per test, so you'll need to make the responses generic enough to work for all tests or do something clever around responding differently based on a header or something.

## Testing Forms

Testing a form usually involves the following steps:

#### Import the integration form helper

```js
import { setupForm } from './helpers';
```

#### Import your form component

```js
import UpdatePaymentForm from 'src/pages/billing/forms/UpdatePaymentForm';
```

#### Import axios and get a reference to the singleton

```
import axios from 'axios';
const axiosMock = axios.create();
```

Calling `axios.create()` will give you a reference to the same singleton used by every other axios instance in the app (works like this in tests only). To see how this works, look in the __mocks__ folder in the root of the project. See also: https://facebook.github.io/jest/docs/en/manual-mocks.html#mocking-node-modules

#### Set up your test form

Inside of a jest test, await the result of the setup function:

```js
test('Update Payment Form', async () => {
  const form = await setupForm(<UpdatePaymentForm />);

```

The setup helper does the following:

1. Configures the Redux store with all of the app's reducers, initializing them with their initial state
1. Logs the user in with a login action, with a token of `very-real-access-token` which will then appear in all SparkPost API request snapshots
1. Sets the global "ACCESS_CONTROL_READY" state to true so that components who are waiting for this will stop waiting
1. Uses enzyme's `mount()` method to mount the passed in component tree, mounted inside of the Redux Provider and inside of a React Router `<MemoryRouter>` to make sure Link components don't blow up.
1. Performs an "async flush" which waits for a tick on the event loop to complete before returning
1. Performs an "update" on the mounted component, updating all state after the previous tick completion
1. Returns the form object (see below)

#### The `form` object

The returned form object has the following keys:

* `mounted` - the enzyme mounted component, in case you need it
* `find` - the find method from the mounted component, for convenience so you can do `form.find()`
* `store` - The redux store
* `change` - A method that takes an index and a value, and will simulate a change event to find the `Field` at that index and change its value
* `asyncFlush` - convenience method to wait for the next JS tick
* `fill` - Fill helper for filling form fields (see below for more)
* `submit` - Submits the form and does an async flush for you
* `debug` - Pretty prints the current redux state, defaults to the form state but can accept a string path to anywhere in the redux state tree

#### How to `fill` fields

You can use the returned `form.fill()` method to fill form fields. The fill method takes a single field object (or an array of field objects so that the fields will be filled in the precise order you intend.) Each field object should have a type (defaults to "text"), a name or selector, and a value.

**Name vs. selector:**

`{ type: 'text', name: 'this-name' }` -> enzyme will look for `<input name='this-name' />`
`{ type: 'text', selector: 'id="myId"' }` -> enzyme will look for `<input id="myId" />`

| Type | What `value` represents |
|------|-------|
| text | the string value for the field |
| select | the value of the option to select from the group |
| checkbox | boolean representing whether this box should be checked or not |
| radio | find the option with this value and select it (can alternatively use `index`, which finds the option at this index and selects it) |
| typeahead | usually an object that matches the object to be selected from the typeahead list |

#### Fill the form, submit it, and snapshot

The last step is to fill the form with values, submit it, and then expect the axios calls to be the same via snapshot.

```js
form.fill([
  { name: 'firstName', value: 'Firsty' },
  { name: 'lastName', value: 'Lasty' },
  { type: 'checkbox', name: 'isCool', value: true },
  { type: 'radio', name: 'favoriteFruit', value: 'bananas' }
]);

axiosMock.mockClear();
await form.submit();
expect(axiosMock.mock.calls).toMatchSnapshot();
```

Note: we clear the axios mock here to get rid of any HTTP calls that have been issued while the form is being mounted, so that we only test the calls that are part of the form's submission.
