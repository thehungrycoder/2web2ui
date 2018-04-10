# Redux

## General Resources
* The [redux docs](http://redux.js.org/) are a great place to start
* Egghead.io [course](https://egghead.io/courses/getting-started-with-redux)
* More advanced Egghead.io [course](https://egghead.io/courses/building-react-applications-with-idiomatic-redux)


## Middleware
We use [thunk](https://github.com/gaearon/redux-thunk), a middleware that intercepts our actions and handles http requests for us.<br>
It's set up in `src/index.js`<br>

```
import thunk from 'redux-thunk';
import spApiMiddleware from './middleware/sparkpostApiMiddleware';
[...]
composeEnhancers(applyMiddleware(thunk, spApiMiddleware))
```

## Actions

(action pattern)

### Chaining Actions
Chaining actions might be necessary when multiple asynchronous operations need to occur in a particular order (so that one action can use the results of another, for instance). However, it is important to think about the downstream effects of chaining multiple actions together. Redux has its own lifecycle to handle async actions (pending, success, error) that doesn't always play nicely with Promises.  

When chaining `sparkpostApiRequest` or `zuoraRequest` actions, we utilize an `onSuccess` callback that gets passed to the action creator as `meta` data. In this way, we're able to dispatch a subsequent action based on the success of the current one and even pass in the return value. If an error occurs during one of the actions then we simply won't call the next `onSuccess` function. In this way, we can break the chain without throwing an error.

Note: We still need to throw errors until *all* action creators have been unchained. Once we do that, we can `return` the error instead and examine it inside of the component (bye bye unhandled rejections).

## Reducers

(reducer pattern)

## 5xx

...to be handled
