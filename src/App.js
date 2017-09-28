import React from 'react';
import { ProtectedRoute, AuthenticationGate } from 'src/components/auth';
import { GlobalAlert } from 'src/components';
import routes from 'src/config/routes';
import {
  BrowserRouter as Router,
  Route,
  Redirect
} from 'react-router-dom';

export default function App() {
  return (
    <Router>
      <div>
        <AuthenticationGate />

        {routes.map((route) => {
          const MyRoute = route.public ? Route : ProtectedRoute;
          route.exact = !(route.exact === false); // this makes exact default to true

          if (route.redirect) {
            return <Route key={route.path} {...route} render={() => <Redirect to={route.redirect} />} />;
          }
          return <MyRoute key={route.path} {...route} />;
        })}

        <GlobalAlert />
      </div>
    </Router>
  );
}
