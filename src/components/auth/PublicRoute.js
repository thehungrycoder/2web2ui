import React from 'react';
import { Route } from 'react-router-dom';
import AccessControl from './AccessControl';

export default function PublicRoute(props) {
  const { component: Component, condition, ...routeProps } = props;
  return (
    <Route {...routeProps} render={(reactRouterProps) => (
      <AccessControl condition={condition} redirect='/auth' wait={false}>
        <Component {...routeProps} {...reactRouterProps} />
      </AccessControl>
    )} />
  );
}
