import React from 'react';
import { withRouter } from 'react-router-dom';
import { matchPath } from 'react-router';
import _ from 'lodash';

import Form from './Form';
import routes from 'src/config/routes';

/**
 * Returns layout component from routes config
 */
const Layout = ({ children, location }) => {

  // matchPath uses the same matching that <Route> uses
  const route = _.find(routes, ({ path, exact = true }) => matchPath(location.pathname, {
    path,
    exact,
    strict: false
  }));

  return React.createElement((route && route.layout) || Form, {}, children);
};

export default withRouter(Layout);
