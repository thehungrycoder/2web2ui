import React from 'react';
import _ from 'lodash';
import { withRouter, Redirect } from 'react-router-dom';
import { DEFAULT_REDIRECT_ROUTE } from 'src/constants';

/*
 * Redirect to either the default route or the original route the user wanted before
 * being rudely interrupted by our auth flow.
 * This is meant for use immediately after authentication completes.
 */
export const RedirectAfterLogin = (props) => {
  const defaultRoute = { ...props.location, pathname: DEFAULT_REDIRECT_ROUTE };
  const route = _.get(props, 'location.state.redirectAfterLogin', defaultRoute);

  return <Redirect to={route} />;
};

export default withRouter(RedirectAfterLogin);
