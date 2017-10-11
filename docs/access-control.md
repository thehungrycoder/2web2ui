# Access Control

Initial discussion and strategy for authorization access control: [#98](https://github.com/SparkPost/2web2ui/issues/98)

## The `AccessControl` Component

Control the appearance of any component by wrapping it in the `<AccessControl>` component.

Example:

```jsx
render() {
  return (
    <div>
      <h1>A Title For Everyone</h1>
      <p>Content for everyone too</p>
      <AccessControl condition={configFlag('showSpecialMessage')}>
        <p>A special message for a chosen few.</p>
      </AccessControl>
    </div>
  )
}
```

#### Props

* **condition** (required)

  This is a function that'll receive a hash containing a `state` object that contains everything returned by the `accessConditionState` selector. The returned function should return a boolean representing whether the current user is granted access to this component's children.

  _Note: You should almost always use [condition helpers](https://github.com/SparkPost/2web2ui/blob/hotfix/FAD-5307/docs/access-control.md#condition-helpers) for this prop._

* **redirect**

  If this is passed (as a string path), when the function returned by `condition()` returns false, a react router `<Redirect>` is rendered to push the app to the given path. Mostly useful for route-level access control.

  _Note: The redirect will not happen before the `accessControlReady` flag is true in the global redux store. See the [Access Control Ready](#access-control-ready) section below for more information._

## Route access

The `<ProtectedRoute>` component now wraps its given component with the `<AccessControl>` component, passing through the `condition` from the route config (if it exists). It also sets `redirect` to "/dashboard" so that if the condition fails for any route, it will be redirected.

### Route config

Routes should all be set up in `src/config/routes.js`, and look like this:

```js
[
  {
    path: '/account/billing',
    component: BillingPage,
    condition: hasGrants('account/manage')
  },
  {
    path: '/some/other/path',
    component: SomeOtherPage,
    condition: composeConditions(hasGrants('some/other', 'also/this'), anotherHelper('some argument'))
  }
]
```

_Note: Routes default to exact: true because [it makes more sense](https://github.com/ReactTraining/react-router/issues/4958)._

## Condition helpers

Condition helpers are functions that return a condition function. Any time you need to use an access control condition, create a helper for that condition scenario. Whenever that returned function is called, it will be passed an object containing whatever [the `accessConditionState` selector](#access-condition-selector) returns, and it should return a boolean that reflects the access decision.

To avoid repetitiveness and noise, don't make helpers that work like this:
```js
// helpers/conditions/hasGrants.js
export default function(required, { currentUser }) {
  return _.difference(required, currentUser.grants).length === 0;
}

// config/routes.js
{
  path: 'account/billing',
  condition: ({ currentUser }) => hasGrants(['account/manage'], { currentUser })
}
```

Instead, have them _return a function_ so they work like this:
```js
// helpers/conditions/hasGrants.js
export default function(...required) {
  return ({ currentUser }) => _.difference(required, currentUser.grants).length === 0
}

// config/routes.js
{
  path: '/account/billing',
  condition: hasGrants('account/manage')
}
```

This makes conditions more readable and easier to compose.

#### Condition composition

You can compose multiple condition helpers together by using the `composeConditions` helper. For example, if you need to make a route's access dependent on grants _and_ a config flag:

```js
import { hasGrants, configFlag, composeConditions } from 'src/helpers/conditions';

export default [
  {
    path: '/reports/summary',
    condition: composeConditions(hasGrants('metrics/view'), configFlag('summaryChart.enabled'))
  }
]
```

## Access Condition Selector

To keep the state provided to access conditions in one place (and to provide better re-rendering capabilities so that conditions can be computed dynamically), there is now an access condition state selector.

```js
import { createSelector } from 'reselect';

const getAccount = (state) => state.account;
const getUser = (state) => state.currentUser;

export default createSelector(
  [getAccount, getUser],
  (account, currentUser) => ({ account, currentUser })
);
```

If you needed to provide more state values to any condition helper, you would add it here. Anywhere that you need to call an access condition helper, you should pass the helper's returned function the value that is returned from this selector (i.e. don't grab values from the state yourself). In those cases, your component should connect to the Redux store and use this selector in `mapStateToProps` so that whatever is relying on that access control will be re-computed whenever the relevant state changes. (See [the Navigation component](/src/components/navigation/Navigation.js) for an example of how this dynamic rendering works.)

## Access Control "Ready"

To prevent premature redirection for protected routes, we have an accessControlReady flag in the Redux state.

For example, if a route depended on whether an account's status is "active":

```js
const accountStatusHelper = (requiredStatus) => ({ account }) => account.status === requiredStatus;

[
  {
    path: '/my-account',
    condition: accountStatusHelper('active')
  }
]
```

When the page first loads, the account isn't yet available in the state, so the condition helper will return `false` and the page will be redirected to `/dashboard` too soon. Instead, the redirect now waits until the accessControlReady flag is true, which only happens after the state needed for access control has been successfully fetched at least once.

This is handled in [the accessControl action](/src/actions/accessControl.js) and [the accessControl reducer](/src/reducers/accessControl.js).
