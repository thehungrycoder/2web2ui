import React from 'react';

/**
 * A higher order component to wrap your components with context consumers
 * An alternative to using consumers directly in render
 *
 * @param  Context   Context to consume
 * @param  Component Component to be wrapped
 *
 * @example
 *   export default withContext(ReactContext, YourComponent)
 */

function withContext(Context, Component) {
  const WithContext = (props) => (
    <Context.Consumer children={(context) => <Component {...props} {...context} />}/>
  );
  WithContext.displayName = `WithContext(${Component.displayName || Component.name || 'Component'})`;
  return WithContext;
}

export default withContext;
