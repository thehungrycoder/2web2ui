# Redux Form
#react/redux #redux-form

## Resources
* API: [Redux Form - API](http://redux-form.com/6.0.0-alpha.4/docs/api/)
* Examples: [Redux Form - Examples](http://redux-form.com/6.0.0-alpha.4/examples/)
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
```
[...]
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
```
import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
```

Your form will be a regular react component
```
class MyForm extends Component {
  render() {
    const { handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit}>
          <Field name="firstName" component={someComponent}/>
        <button type="submit">Submit</button>
 [...bunch of closing bracks...]
}
```

* `handleSubmit` will be a function you pass as a prop from the page using the form.  Like: `<MyForm handleSubmit={() => {doTheThing()}} />`
* `Field`  is the main component through which you communicate with the state. **Every element on the form you want to have return a value to handleSubmit or change the state of the form has to be a Field** Field has the ability to behave like a regular `<input/>` tag, or you can pass any component to it via the `compoment` prop.

You then want to decorate the form with the reduxForm component
```
// Decorate the form component
MyFrom = reduxForm({
  form: 'myForm' // a unique name for this form
})(MyForm);
```

That’s it (for a form that just returns values to handleSubmit).

## The important parts (upcoming)
