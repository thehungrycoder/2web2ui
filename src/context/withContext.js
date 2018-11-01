import React from 'react';

function withContext(Context, Component) {
  return (props) => (
    <Context.Consumer children={(context) => <Component {...props} {...context} />}/>
  );
}

export default withContext;
