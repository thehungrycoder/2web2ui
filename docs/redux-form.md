# Redux Form
#react/redux #redux-form

## Resources
* API: [Redux Form - API](https://redux-form.com/7.0.0/docs/api/)
* Examples: [Redux Form - Examples](https://redux-form.com/7.0.0/examples/)
* [GH Issue on Checkbox groups](https://github.com/erikras/redux-form/issues/1037#issuecomment-243003954)

## General Guide
All this stuff is taken from the redux-form docs. I tried to summarize and make it more relevant to how we use it, but go to there if you want the source.

### What it is

redux-form provides:

* A Redux reducer that listens to dispatched redux-form actions to maintain your form state in Redux.
* A React component decorator that wraps your entire form in a Higher Order Component (HOC) and provides functionality via props.
* A Field component to connect your individual field inputs to the Redux store.

### Project Setup

In our app, you will find the reducer imported in `/src/reducers/index.js`  like so:
```js
import { reducer as reduxFormReducer } from 'redux-form';
[...]
export default combineReducers({
[...]
  form: reduxFormReducer
});
```

This makes it so that our forms can connect to form state changes, which are caused by actions the form dispatches under the hood.  It is one of the few actual redux-y things you need to do to set up a form, and it only needs to be done once for the whole project.

### Making a form

Start by importing the right stuff
```js
import React, { Component } from 'react';
import { reduxForm } from 'redux-form';

class MyForm extends Component {
  render() {
    return (
      <form onSubmit={this.props.handleSubmit}>
        <Field name='firstName' component={someComponent}/>
        <button submit>Submit</button>
      </form>
    );
  }
}

// Give your form a name, and wrap your component with the redux-form higher order component.
const formOptions = { form: 'my-form-name' };
export default reduxForm(formOptions)(MyForm);
```

**handleSubmit**

`handleSubmit` is a [redux-form function](https://redux-form.com/7.0.0/docs/api/props.md/#-code-handlesubmit-eventorsubmit-function-code-) passed through as a prop that either:

1) Calls your own `this.props.onSubmit` if provided in the parent component
```js
// Parent
<MyForm onSubmit={this.mySubmitFunc}>

// MyForm - calls mySubmitFunc automatically
// Useful for form reusability
<form onSubmit={this.props.handleSubmit}>
```

2) Or, wraps your submit function directly
```js
// If your submit functions is within your form component
<form onSubmit={this.props.handleSubmit(this.mySubmitFunc)}>

// Useful if your submit action is in a separate component
<Page primaryAction={{ content: 'Action', onClick={this.props.handleSubmit(this.mySubmitFunc)} }} >
```

**Field**

`Field` is a redux-form component through which you communicate with the state. **Every element on the form you want to have return a value to handleSubmit or change the state of the form has to be a Field** Field has the ability to behave like a regular `<input/>` tag, or you can pass any component to it via the `compoment` prop.

We have a most input types ready for use with redux-form in `src/components/reduxFormWrappers`.

The `name` prop you pass to `<Field>` tells redux form where to store its value. For example:

```js
<Field name='firstName' />
<Field name='card.number'/>
```

These two fields will store values under:
```js
// App redux store
{
  // The redux-form store
  form: {
    // The form name you've assigned to your form
    my-form-name: {
      values: {
        firstName: 'value',
        card: {
          number: 'value'
        }
      }
    }
  }
}
```

## Form level props
Wrapping your component in redux form provides you with a number of [useful props](https://redux-form.com/7.0.0/docs/api/props.md). `handleSubmit()` is one of them.

If the submit function you've passed to `handleSubmit` returns a promise, you have access to submit-related props: `submitting`, `submitSucceeded`, etc:
```js
<Button submit>
  { this.props.submitting ? 'Loading...' : 'Create' }
</Button>
```

## Accessing Form values
The normal react way of accessing an inputs value is by assigning a `ref` to that field and reading its value. Because all our values should reference the redux store (and not a ref), we use a [selector that redux form provides](https://redux-form.com/7.0.0/docs/api/formvalueselector.md/): `formValueSelector`.

In your redux connected component, select the values you want through `mapStateToProps`.
```js
import { formValueSelector } from 'redux-form';

// ...

const mapStateToProps = (state, props) => {
  const selector = formValueSelector('my-form-name');
  return {
    firstNameValue: selector(state, 'firstName')
  };
};
```

The value of your `firstName` field is now accessible through your component props: `this.props.firstNameValue`. This is useful if you need to show or hide sections of your form based on input value.

## Setting initial form values
You would normally set initial values directly on the field components themselves through `defaultValue`. But since our values are stored in redux, we need to tell redux-form what its intial store state should look like.

In your `mapStateToProps` function, set `initialValues`:
```js
const mapStateToProps = (state, props) => {
  return {
    initialValues: {
      firstName: 'default first name'
    }
  };
};

const formOptions = {
  form: 'my-form-name',
  enableReinitialize: true // This is only required if the values you choose are pulled from redux
};

export default connect(mapStateToProps, {})(reduxForm(formOptions)(MyForm));
```

## Field level validation
Assign validation requirements through the `validate` prop on the `<Field>` component directly. We have a number of redux-form specific validation helpers available in `src/helpers/validation`.

You can specify multiple validators using an array: `validate={[required, maxLength(10)]}`

```js
import { required } from 'src/helpers/validation';

<Field name='firstName' validate={required} />
```
