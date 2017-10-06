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

  This is a function that'll receive a hash containing `store` (the full Redux store) and `config`, and it should return a boolean representing whether or not the children should be rendered or `null` instead.

  _Note: You should almost always use [condition helpers](https://github.com/SparkPost/2web2ui/blob/hotfix/FAD-5307/docs/access-control.md#condition-helpers) for this prop._

* **redirect**

  If this is passed (as a string path), when the `condition` returns false, a react router `<Redirect>` is rendered to push the app to the given path. Mostly useful for route-level access control.

## Route access

The `<ProtectedRoute>` component now wraps its given component with the `<AccessControl>` component, passing through the `condition` from the route config. It also sets `redirect` to "/dashboard" so that if the condition fails for any route, it will be redirected.

### Route config

Routes should all be set up in `src/config/routes.js`, and look like this:

```js
[
  {
    path: '/account/billing',
    component: BillingPage,
    condition: hasGrants('account/manage')
  }
]
```

_Note: Routes default to exact: true because [it makes more sense](https://github.com/ReactTraining/react-router/issues/4958)._


## Condition helpers

Condition helpers are functions that return a condition function. Any time you need to use a condition, create a helper for that condition scenario. Whenever that returned function is called, it will be passed an object with keys `store` (the entire Redux store) and `config` (the current loaded tenant config), and it should return a boolean that reflects the access decision.

To avoid the repetitiveness and noise of passing `store`/`config` around everywhere, don't make helpers that work like this:
```js
// helpers/conditions/hasGrants.js
export default function(required, store) {
  return _.difference(required, store.grants).length === 0;
}

// config/routes.js
{
  path: 'account/billing',
  condition: ({ store }) => hasGrants('account/manage', store)
}
```

Instead, have them _return a function_ so they work like this:
```js
// helpers/conditions/hasGrants.js
export default function(...required) {
  return ({ store }) => _.difference(required, store.grants).length === 0
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

