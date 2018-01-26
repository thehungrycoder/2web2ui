import React from 'react';
import { ProtectedRoute, AuthenticationGate } from 'src/components/auth';
import { Support, GlobalAlertWrapper, RouteWatch } from 'src/components';
import Layout from 'src/components/layout/Layout';
import routes from 'src/config/routes';

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';

const App = () => (
  <Router>
    <div>
      <RouteWatch />
      <AuthenticationGate />
      <Layout>
        <Switch>
          {
            routes.map((route) => {
              const MyRoute = route.public ? Route : ProtectedRoute;

              route.exact = !(route.exact === false); // this makes exact default to true

              if (route.redirect) {
                return <Redirect key={route.path} exact from={route.path} to={route.redirect} />;
              }

              return <MyRoute key={route.path} {...route} />;
            })
          }
        </Switch>
      </Layout>
      <Support />
      <GlobalAlertWrapper />
    </div>
  </Router>
);

export default App;
