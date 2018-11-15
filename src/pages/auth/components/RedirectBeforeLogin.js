import React from 'react';
import { withRouter, Redirect } from 'react-router-dom';

/*
 * Redirect to a given route preserving router state.
 * This is meant for use to move between the various stages of authentication
 * including username/password and TFA.
 */
export const RedirectBeforeLogin = ({ to, location: { search, state } = {}}) => {
  const route = {
    pathname: to,
    search,
    state
  };
  return <Redirect to={route} />;
};

export default withRouter(RedirectBeforeLogin);
