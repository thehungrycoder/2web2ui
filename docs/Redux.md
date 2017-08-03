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

## Reducers

(reducer pattern)

## 5xx

...to be handled
