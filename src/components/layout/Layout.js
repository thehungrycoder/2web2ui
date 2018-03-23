import React from 'react';
import { withRouter } from 'react-router-dom';
import Form from './Form';
import findRouteByPath from 'src/helpers/findRouteByPath';
import { Helmet } from 'react-helmet';

/**
 * Returns layout component from routes config
 */
export const Layout = ({ children, location }) => {
  const route = findRouteByPath(location.pathname);
  const LayoutComponent = route.layout || Form;
  return (
    <LayoutComponent>
      {route.title && <Helmet><title>{route.title} | SparkPost</title></Helmet>}
      {children}
    </LayoutComponent>
  );
};

export default withRouter(Layout);
